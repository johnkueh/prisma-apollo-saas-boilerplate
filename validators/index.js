import { UserInputError } from 'apollo-server';
import team from './team';

const schemas = {
  team
};

export default {
  validate: async ({ type, input }) => {
    try {
      await schemas[type].validate(input, { abortEarly: false });
    } catch (error) {
      const { name, inner } = error;
      throw new UserInputError(name, {
        errors: inner.map(({ path, message }) => ({
          path,
          message
        }))
      });
    }
  }
};
