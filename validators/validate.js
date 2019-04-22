import { UserInputError } from 'apollo-server';
import _ from 'lodash';

export default async ({ input, schema }) => {
  try {
    await schema.validate(input, { abortEarly: false });
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
};
