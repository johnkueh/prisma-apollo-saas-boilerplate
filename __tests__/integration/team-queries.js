import { createTestClient } from 'apollo-server-testing';
import { ApolloServer } from 'apollo-server-express';
import sgMail from '@sendgrid/mail';
import Stripe from 'stripe';
import { prisma } from '../../lib/prisma-mock';
import typeDefs from '../../schema';
import resolvers from '../../resolvers';
import schemaDirectives from '../../directives';
import { CREATE_TEAM, UPDATE_TEAM } from '../../queries/team';

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

it('creating a team when team already exists returns an error', async () => {
  server.context = () => ({
    prisma,
    user: { id: 1, email: 'test+user@email.com' }
  });

  client = createTestClient(server);
  const res = await client.query({
    query: CREATE_TEAM,
    variables: {
      input: {
        name: 'Team name'
      }
    }
  });

  expect(prisma.user).toHaveBeenCalledWith({ id: 1 });
  expect(res).toMatchSnapshot();
});

it('able to create team for user', async () => {
  server.context = () => ({
    prisma,
    user: { id: 2, email: 'user+no+team@email.com' }
  });

  client = createTestClient(server);
  const res = await client.query({
    query: CREATE_TEAM,
    variables: {
      input: {
        name: 'A new team name'
      }
    }
  });

  expect(prisma.user).toHaveBeenCalledWith({ id: 2 });
  expect(prisma.updateUser).toHaveBeenCalledWith({
    where: { id: 2 },
    data: {
      team: {
        create: {
          name: 'A new team name'
        }
      }
    }
  });
  expect(res).toMatchSnapshot();
});

it('able to update team name for user', async () => {
  server.context = () => ({
    prisma,
    user: { id: 1, email: 'test+user@email.com' }
  });

  client = createTestClient(server);
  const res = await client.query({
    query: UPDATE_TEAM,
    variables: {
      input: {
        name: 'Updated team name'
      }
    }
  });

  expect(prisma.user).toHaveBeenCalledWith({ id: 1 });
  expect(prisma.updateTeam).toHaveBeenCalledWith({
    where: { id: 1 },
    data: {
      name: 'Updated team name'
    }
  });
  expect(res).toMatchSnapshot();
});
