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

let client;

beforeEach(async () => {
  const server = await new ApolloServer({
    typeDefs,
    resolvers,
    schemaDirectives,
    context: () => ({
      prisma: {
        user: () =>
          userFactory({
            id: 1,
            email: 'test@user.com',
            password: 'testpassword'
          })
      },
      user: { id: 1, email: 'test@user.com' }
    })
  });

  client = createTestClient(server);
});

it('able to get user profile', async () => {
  const res = await client.query({
    query: ME
  });

  expect(res).toMatchSnapshot();
});

it('able to login successfully', async () => {
  const res = await client.query({
    query: LOGIN,
    variables: {
      email: 'test@user.com',
      password: 'testpassword'
    }
  });

  expect(res).toMatchSnapshot();
});

it('returns correct error message when email is taken during signup', async () => {
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
