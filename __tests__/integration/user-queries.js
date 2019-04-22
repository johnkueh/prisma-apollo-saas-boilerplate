import { createTestClient } from 'apollo-server-testing';
import { ApolloServer } from 'apollo-server-express';
import sgMail from '@sendgrid/mail';
import Stripe from 'stripe';
import { prisma } from '../../lib/prisma-mock';
import typeDefs from '../../schema';
import resolvers from '../../resolvers';
import schemaDirectives from '../../directives';
import {
  ME,
  PAYMENT_HISTORY,
  SIGNUP,
  LOGIN,
  UPDATE_USER,
  FORGOT_PASSWORD,
  RESET_PASSWORD,
  DELETE_USER,
  ADD_CREDIT_CARD,
  SUBSCRIBE_PLAN
} from '../../queries/user';

let server;
let client;

beforeEach(async () => {
  server = await new ApolloServer({
    typeDefs,
    resolvers,
    schemaDirectives,
    context: () => ({
      prisma
    })
  });
  client = createTestClient(server);
});

it('able to get user profile', async () => {
  server.context = () => ({
    prisma,
    user: { id: 1, email: 'test@user.com' }
  });

  client = createTestClient(server);
  const res = await client.query({
    query: ME
  });

  expect(prisma.user).toHaveBeenCalledWith({ id: 1 });
  expect(res).toMatchSnapshot();
});

it('able to login successfully', async () => {
  const res = await client.query({
    query: LOGIN,
    variables: {
      input: {
        email: 'test+user@email.com',
        password: 'testpassword'
      }
    }
  });

  expect(prisma.user).toHaveBeenCalledWith({ email: 'test+user@email.com' });
  expect(res).toMatchSnapshot();
});

it('able to signup successfully', async () => {
  const res = await client.query({
    query: SIGNUP,
    variables: {
      input: {
        firstName: 'Test',
        lastName: 'User',
        email: 'new.user@test.com',
        password: 'testpassword'
      }
    }
  });

  expect(prisma.createUser).toHaveBeenCalledWith(
    expect.objectContaining({
      firstName: 'Test',
      lastName: 'User',
      email: 'new.user@test.com',
      password: expect.any(String),
      stripeCustomerId: 'cust_234'
    })
  );
  expect(res).toMatchSnapshot();
});

describe('signup - validation errors', () => {
  it('returns correct error messages', async () => {
    const res = await client.query({
      query: SIGNUP,
      variables: {
        input: {
          firstName: '',
          lastName: '',
          email: 'test+user@.com',
          password: ''
        }
      }
    });

    expect(res.errors[0].extensions.exception.errors).toEqual({
      firstName: 'First name must be at least 1 characters',
      lastName: 'Last name must be at least 1 characters',
      email: 'Email must be a valid email',
      password: 'Password must be at least 6 characters'
    });
  });

  it('returns correct error message when email is taken during signup', async () => {
    const res = await client.query({
      query: SIGNUP,
      variables: {
        input: {
          firstName: 'Test',
          lastName: 'User',
          email: 'test+user@email.com',
          password: 'testpassword'
        }
      }
    });

    expect(prisma.user).toHaveBeenCalledWith({ email: 'test+user@email.com' });
    expect(res.errors[0].message).toBe('Email is already taken');
  });
});

it('able to update user profile successfully', async () => {
  server.context = () => ({
    prisma,
    user: { id: 1, email: 'test@user.com' }
  });

  client = createTestClient(server);
  const res = await client.query({
    query: UPDATE_USER,
    variables: {
      input: {
        email: 'updated+user@test.com'
      }
    }
  });

  expect(prisma.updateUser).toHaveBeenCalledWith({
    where: { id: 1 },
    data: {
      email: 'updated+user@test.com'
    }
  });
  expect(res).toMatchSnapshot();
});

it('able to update user password successfully', async () => {
  server.context = () => ({
    prisma,
    user: { id: 1, email: 'test@user.com' }
  });

  client = createTestClient(server);
  const res = await client.query({
    query: UPDATE_USER,
    variables: {
      input: {
        password: 'newpassword'
      }
    }
  });

  expect(prisma.updateUser).toHaveBeenCalledWith(
    expect.objectContaining({
      where: { id: 1 },
      data: {
        password: expect.any(String)
      }
    })
  );
  expect(res).toMatchSnapshot();
});

it('not able to request forgot password if user doesnt exist', async () => {
  server.context = () => ({
    prisma,
    user: { id: 1, email: 'test+user@email.com' }
  });

  client = createTestClient(server);
  const res = await client.query({
    query: FORGOT_PASSWORD,
    variables: {
      input: {
        email: 'weird+user@email.com'
      }
    }
  });

  expect(prisma.user).toHaveBeenCalledWith({
    email: 'weird+user@email.com'
  });
  expect(prisma.updateUser).not.toHaveBeenCalled();
  expect(sgMail.send).not.toHaveBeenCalled();

  // Sends this message back to the user irrespective of success or not
  expect(res.data.ForgotPassword.message).toBe(
    'A link to reset your password will be sent to your registered email.'
  );
});

it('able to request forgot password successfully', async () => {
  server.context = () => ({
    prisma,
    user: { id: 1, email: 'test+user@email.com' }
  });

  client = createTestClient(server);
  const res = await client.query({
    query: FORGOT_PASSWORD,
    variables: {
      input: {
        email: 'test+user@email.com'
      }
    }
  });

  expect(prisma.user).toHaveBeenCalledWith({
    email: 'test+user@email.com'
  });
  expect(prisma.updateUser).toHaveBeenCalledWith({
    where: { email: 'test+user@email.com' },
    data: {
      resetPasswordToken: 'UUID-TOKEN'
    }
  });
  expect(sgMail.send).toHaveBeenCalled();
  expect(res.data.ForgotPassword.message).toBe(
    'A link to reset your password will be sent to your registered email.'
  );
});

it('able to reset password with correct token', async () => {
  server.context = () => ({
    prisma,
    user: { id: 1, email: 'test+user@email.com' }
  });

  client = createTestClient(server);
  const res = await client.query({
    query: RESET_PASSWORD,
    variables: {
      input: {
        password: 'newpassword',
        token: 'RESET-PASSWORD-TOKEN'
      }
    }
  });

  expect(prisma.user).toHaveBeenCalledWith({
    resetPasswordToken: 'RESET-PASSWORD-TOKEN'
  });
  expect(prisma.updateUser).toHaveBeenCalledWith({
    where: { resetPasswordToken: 'RESET-PASSWORD-TOKEN' },
    data: {
      password: expect.any(String),
      resetPasswordToken: null
    }
  });
  expect(res.data.ResetPassword.message).toBe('Password updated successfully.');
});

it('not able to reset password with wrong token', async () => {
  server.context = () => ({
    prisma,
    user: { id: 1, email: 'test+user@email.com' }
  });

  client = createTestClient(server);
  const res = await client.query({
    query: RESET_PASSWORD,
    variables: {
      input: {
        password: 'newpassword',
        token: 'RESET-PASSWORD-TOKEN-WRONG'
      }
    }
  });

  expect(prisma.user).toHaveBeenCalledWith({
    resetPasswordToken: 'RESET-PASSWORD-TOKEN-WRONG'
  });
  expect(prisma.updateUser).not.toHaveBeenCalled();
  expect(res).toMatchSnapshot();
});

it('able to delete user successfully', async () => {
  server.context = () => ({
    prisma,
    user: { id: 1, email: 'test+user@email.com' }
  });

  client = createTestClient(server);
  await client.query({
    query: DELETE_USER
  });

  expect(prisma.deleteUser).toHaveBeenCalledWith({
    id: 1
  });
});

it('able to add credit card', async () => {
  server.context = () => ({
    prisma,
    user: { id: 1, email: 'test+user@email.com', stripeCustomerId: 'cust_123' }
  });

  client = createTestClient(server);
  const res = await client.query({
    query: ADD_CREDIT_CARD,
    variables: {
      input: {
        token: 'CREDIT-CARD-TOKEN'
      }
    }
  });

  expect(Stripe.mocks.customers.update).toHaveBeenCalledWith('cust_123', {
    source: 'CREDIT-CARD-TOKEN'
  });
  expect(res.data.AddCreditCard.message).toBe('Successfully updated billing information.');
});

it('able to subscribe to a plan', async () => {
  server.context = () => ({
    prisma,
    user: { id: 1, email: 'test+user@email.com', stripeCustomerId: 'cust_123' }
  });

  client = createTestClient(server);
  const res = await client.query({
    query: SUBSCRIBE_PLAN,
    variables: {
      input: {
        planId: 'STRIPE-PLAN-ID'
      }
    }
  });

  expect(Stripe.mocks.subscriptions.create).toHaveBeenCalledWith({
    customer: 'cust_123',
    items: [{ plan: 'STRIPE-PLAN-ID' }]
  });

  expect(res.data.SubscribePlan.message).toBe('Successfully subscribed to plan.');
});

it('able to get payment history', async () => {
  server.context = () => ({
    prisma,
    user: { id: 1, email: 'test+user@email.com', stripeCustomerId: 'cust_123' }
  });

  client = createTestClient(server);
  const res = await client.query({
    query: PAYMENT_HISTORY
  });

  expect(Stripe.mocks.invoices.list).toHaveBeenCalledWith({
    customer: 'cust_123'
  });
  expect(res).toMatchSnapshot();
});
