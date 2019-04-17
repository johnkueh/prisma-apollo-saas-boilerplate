import { defaultFieldResolver } from 'graphql';
import { SchemaDirectiveVisitor, AuthenticationError } from 'apollo-server';

export default class RequireAuthDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field;
    field.resolve = async (...args) => {
      const [, , { prisma, user }] = args;

      if (user) {
        const dbUser = await prisma.user({ id: user.id });
        if (dbUser) {
          const result = await resolve.apply(this, args);
          return result;
        }
      }

      throw new AuthenticationError('You must be authenticated to perform this action');
    };
  }
}
