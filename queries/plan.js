import { gql } from 'apollo-server-express';

export const PLANS = gql`
  query {
    Plans {
      id
      amount
      currency
      interval
      title
      description
    }
  }
`;

export default {
  PLANS
};
