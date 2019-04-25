import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    Plans: [Plan] @requireAuth
  }

  type Plan {
    id: String!
    title: String
    description: String
    amount: Int!
    currency: String!
    interval: String!
  }
`;
