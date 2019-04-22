import { defaultFieldResolver } from 'graphql';
import { SchemaDirectiveVisitor } from 'apollo-server';

export default class ValidateDirective extends SchemaDirectiveVisitor {
  visitInputFieldDefinition(field) {
    const { name, resolve = defaultFieldResolver } = field;

    console.log('visitInputFieldDefinition CALLED');

    field.resolve = async (...args) => {
      const result = await resolve.apply(this, args);

      return result;
    };
  }
}
