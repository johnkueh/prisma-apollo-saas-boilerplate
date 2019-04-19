import { gql } from 'apollo-server-express';

export const CREATE_TEAM = `
mutation CreateTeam($input: CreateTeamInput!) {
  CreateTeam(input: $input) {
    id
    name
  }
}
`;

export const UPDATE_TEAM = `
mutation UpdateTeam($input: UpdateTeamInput!) {
  UpdateTeam(input: $input) {
    id
    name
  }
}
`;
