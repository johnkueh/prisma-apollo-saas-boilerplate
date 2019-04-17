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

beforeEach(() => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    schemaDirectives,
    context: () => ({
      prisma: {
        user: ({ id }) => userFactory({ id })
      }
    })
  });

  client = createTestClient(server);
});

it('shows authentication error when fetching Me', async () => {
  const res = await client.query({
    query: ME
  });

  expect(res).toMatchSnapshot();
});
