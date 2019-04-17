import { createTestClient } from 'apollo-server-testing';
import { ApolloServer } from 'apollo-server-express';
import typeDefs from '../../schema';
import resolvers from '../../resolvers';
import schemaDirectives from '../../directives';
import userFactory from '../../factories/user';
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

beforeEach(async () => {
  server = await new ApolloServer({
    typeDefs,
    resolvers,
    schemaDirectives
  });
});

it('able to get user profile', async () => {
  server.context = () => ({
    prisma: {
      user: () =>
        userFactory({
          id: 1,
          email: 'test@user.com',
          password: 'testpassword'
        })
    },
    user: { id: 1, email: 'test@user.com' }
  });

  const client = createTestClient(server);
  const res = await client.query({
    query: ME
  });

  expect(res).toMatchSnapshot();
});

it('able to login successfully', async () => {
  server.context = () => ({
    prisma: {
      user: () =>
        userFactory({
          id: 1,
          email: 'test@user.com',
          password: 'testpassword'
        })
    }
  });
  const client = createTestClient(server);
  const res = await client.query({
    query: LOGIN,
    variables: {
      email: 'test@user.com',
      password: 'testpassword'
    }
  });

  expect(res).toMatchSnapshot();
});

it('able to signup successfully', async () => {
  server.context = () => ({
    prisma: {
      user: () => null,
      createUser: () =>
        userFactory({
          id: 1,
          email: 'test@user.com',
          password: 'testpassword'
        })
    }
  });
  const client = createTestClient(server);
  const res = await client.query({
    query: SIGNUP,
    variables: {
      firstName: 'Test',
      lastName: 'User',
      email: 'new.user@test.com',
      password: 'testpassword'
    }
  });

  expect(res).toMatchSnapshot();
});

it('returns correct error message when email is taken during signup', async () => {
  server.context = () => ({
    prisma: {
      user: () =>
        userFactory({
          id: 1,
          email: 'test@user.com',
          password: 'testpassword'
        })
    }
  });
  const client = createTestClient(server);
  const res = await client.query({
    query: SIGNUP,
    variables: {
      firstName: 'Test',
      lastName: 'User',
      email: 'test@user.com',
      password: 'testpassword'
    }
  });

  expect(res.errors[0].message).toBe('Email is already taken');
});

it('able to update user profile successfully', async () => {
  server.context = () => ({
    prisma: {
      user: () => userFactory({ id: 1 }),
      updateUser: ({ data: { email } }) =>
        userFactory({
          id: 1,
          email
        })
    },
    user: { id: 1, email: 'test@user.com' }
  });
  const client = createTestClient(server);
  const res = await client.query({
    query: UPDATE_USER,
    variables: {
      email: 'updated+user@test.com'
    }
  });

  expect(res).toMatchSnapshot();
});

it('able to update user password successfully', async () => {
  server.context = () => ({
    prisma: {
      user: () => userFactory({ id: 1 }),
      updateUser: ({ data: { email, password } }) =>
        userFactory({
          id: 1,
          email,
          password
        })
    },
    user: { id: 1, email: 'test@user.com' }
  });
  const client = createTestClient(server);
  const res = await client.query({
    query: UPDATE_USER,
    variables: {
      password: 'newpassword'
    }
  });

  expect(res).toMatchSnapshot();
});
