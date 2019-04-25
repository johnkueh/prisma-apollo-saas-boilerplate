import _ from 'lodash';
import { listAllPlans } from '../services/stripe';
import { toCamelCase } from '../helpers/arrayUtils';

export default {
  Query: {
    async Plans(parent, args, context, info) {
      const plans = await listAllPlans();

      return toCamelCase(plans);
    }
  }
};
