import { createTestClient } from 'apollo-server-testing';
import { ApolloServer } from 'apollo-server-express';
import typeDefs from '../../schema';
import resolvers from '../../resolvers';
import schemaDirectives from '../../directives';
import {
  ME,
  PAYMENT_HISTORY,
  UPDATE_USER,
  DELETE_USER,
  ADD_CREDIT_CARD,
  SUBSCRIBE_PLAN
} from '../../queries/user';

let client;

beforeAll(async () => {
  const server = await new ApolloServer({
    typeDefs,
    resolvers,
    schemaDirectives,
    context: () => ({})
  });

  client = createTestClient(server);
});

const errorMessage = 'You must be authenticated to perform this action';

describe('unauthenticated requests', () => {
  it('shows authentication error for ME', async () => {
    const res = await client.query({ query: ME });
    expect(res.errors[0].message).toBe(errorMessage);
  });

  it('shows authentication error for PAYMENT_HISTORY', async () => {
    const res = await client.query({ query: PAYMENT_HISTORY });
    expect(res.errors[0].message).toBe(errorMessage);
  });

  it('shows authentication error for UPDATE_USER', async () => {
    const res = await client.query({
      query: UPDATE_USER,
      variables: {
        input: {
          firstName: 'Test',
          lastName: 'User',
          email: 'test@user.com',
          password: 'testpassword'
        }
      }
    });
    expect(res.errors[0].message).toBe(errorMessage);
  });

  it('shows authentication error for DELETE_USER', async () => {
    const res = await client.query({ query: DELETE_USER });
    expect(res.errors[0].message).toBe(errorMessage);
  });

  it('shows authentication error for ADD_CREDIT_CARD', async () => {
    const res = await client.query({
      query: ADD_CREDIT_CARD,
      variables: {
        token: 'tok_123'
      }
    });
    expect(res.errors[0].message).toBe(errorMessage);
  });

  it('shows authentication error for SUBSCRIBE_PLAN', async () => {
    const res = await client.query({
      query: SUBSCRIBE_PLAN,
      variables: {
        planId: 'plan_123'
      }
    });
    expect(res.errors[0].message).toBe(errorMessage);
  });
});
