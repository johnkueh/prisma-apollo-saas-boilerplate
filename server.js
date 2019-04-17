import 'dotenv/config';
import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';
import jwt from 'express-jwt';
import bodyParser from 'body-parser';
import moment from 'moment';
import { prisma } from './generated/prisma-client';
import typeDefs from './schema';
import resolvers from './resolvers';
import schemaDirectives from './directives';
import { handleWebhook } from './services/stripe';

const app = express();

app.use(
  jwt({ secret: process.env.JWT_SECRET, credentialsRequired: false }),
  // https://github.com/auth0/express-jwt/issues/194
  (err, req, res, next) => {
    if (err.code === 'invalid_token') return next();
    return next(err);
  }
);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  schemaDirectives,
  context: async ({ req }) => {
    let user = null;
    if (req) {
      if (req.user) {
        user = await prisma.user({ id: req.user.id });
      }
    }

    return {
      prisma,
      user
    };
  }
});

server.applyMiddleware({ app });

app.use(bodyParser.raw({ type: '*/*' }));
app.post(process.env.STRIPE_WEBHOOKS_PATH, (req, res, next) => {
  handleWebhook({
    req,
    res,
    handleSubscriptionUpdated: async ({ customerId, periodStart, periodEnd }) => {
      const user = await prisma.user({ stripeCustomerId: customerId });
      user.update({
        periodStart: moment.unix(periodStart).toDate(),
        periodEnd: moment.unix(periodEnd).toDate()
      });
    }
  });
  next();
});

app.listen({ port: 8000 }, () => {
  console.log('Apollo Server on http://localhost:8000/graphql');
});
