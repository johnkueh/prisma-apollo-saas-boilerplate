import { gql } from 'apollo-server-express';

import userSchema from './user';
import teamSchema from './team';
import planSchema from './plan';
import inviteUserSchema from './invite-user';

const linkSchema = gql`
  scalar DateTime

  directive @requireAuth on FIELD_DEFINITION
  directive @analytics(type: String!, event: String) on FIELD_DEFINITION
  directive @analytics_group(type: String!, event: String) on FIELD_DEFINITION
  directive @computed(value: String) on FIELD_DEFINITION

  type Query {
    _: Boolean
  }
  type Mutation {
    _: Boolean
  }
  # type Subscription {
  #   _: Boolean
  # }
`;

export default [linkSchema, userSchema, teamSchema, planSchema, inviteUserSchema];
