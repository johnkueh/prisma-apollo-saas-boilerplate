import _ from 'lodash';
import request from 'supertest';
import { app, prisma as prismaClient } from '../app';

export const graphqlRequest = async ({ variables, query, headers = {} }) => {
  const { body } = await request(app)
    .post('/graphql')
    .set(headers)
    .send({
      query,
      variables
    });

  // Debug use only
  if (body.errors) debugErrors(body);

  return body;
};

export const debugErrors = body => {
  _.map(body.errors, error => {
    switch (error.extensions.code) {
      case 'BAD_USER_INPUT':
        return null;
      case 'UNAUTHENTICATED':
        return null;
      default:
        return console.log(`❌  ${error.extensions.code}`, error);
    }
  });
};

export const prisma = prismaClient;

export default {
  graphqlRequest,
  prisma
};
