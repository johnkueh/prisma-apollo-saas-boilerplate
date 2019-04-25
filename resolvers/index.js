import { GraphQLDateTime } from 'graphql-iso-date';

import userResolvers from './user';
import teamResolvers from './team';
import planResolvers from './plan';

const customScalarResolver = {
  DateTime: GraphQLDateTime
};

export default [customScalarResolver, userResolvers, teamResolvers, planResolvers];
