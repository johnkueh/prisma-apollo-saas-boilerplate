import { gql } from 'apollo-server-express';

export default gql`
  extend type Mutation {
    CreateTeam(input: CreateTeamInput!): Team!
      @requireAuth
      @analytics(type: "track", event: "Create Team")
      @analytics_group(type: "group")
    UpdateTeam(input: UpdateTeamInput!): Team!
      @requireAuth
      @analytics(type: "track", event: "Update Team")
  }

  input CreateTeamInput {
    name: String!
  }

  input UpdateTeamInput {
    name: String!
  }

  type Team {
    id: String
    name: String
  }
`;
