import { createTestClient } from 'apollo-server-testing';
import { ApolloServer } from 'apollo-server-express';
import bcrypt from 'bcrypt';
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
