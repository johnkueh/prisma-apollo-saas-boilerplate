import { gql } from 'apollo-server-express';

export default gql`
  extend type Mutation {
    InviteUser(input: InviteUserInput!): Invite! @requireAuth
  }

  input InviteUserInput {
    firstName: String!
    lastName: String!
    email: String!
  }

  type Invite {
    id: String!
    email: String!
    firstName: String!
    lastName: String!
    status: String!
  }
`;
