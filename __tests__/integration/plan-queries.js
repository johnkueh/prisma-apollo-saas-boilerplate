import { createTestClient } from 'apollo-server-testing';
import { ApolloServer } from 'apollo-server-express';
import Stripe from 'stripe';
import { prisma } from '../../lib/prisma-mock';
import typeDefs from '../../schema';
import resolvers from '../../resolvers';
import schemaDirectives from '../../directives';
import { PLANS } from '../../queries/plan';

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

it('able to retrieve all plans', async () => {
  server.context = () => ({
    prisma,
    user: { id: 1, email: 'test@user.com' }
  });

  client = createTestClient(server);
  const res = await client.query({
    query: PLANS
  });

  expect(Stripe.mocks.plans.list).toBeCalledTimes(1);
  expect(res).toMatchSnapshot();
});
