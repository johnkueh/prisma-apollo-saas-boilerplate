import { UserInputError } from 'apollo-server';
import _ from 'lodash';
import team from './team';
import user from './user';

const schemas = {
  team,
  user
};

export default {
  validate: async ({ type, input }) => {
    try {
      await schemas[type].validate(input, { abortEarly: false });
    } catch (error) {
      const { name, inner } = error;
      const errors = {};
      inner.forEach(({ path, message }) => {
        errors[path] = _.capitalize(message);
      });
      throw new UserInputError(name, {
        errors
      });
    }
  }
};
