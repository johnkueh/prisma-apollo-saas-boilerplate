import _ from 'lodash';
import { UserInputError } from 'apollo-server';
import * as yup from 'yup';

export default {
  Mutation: {
    async CreateTeam(
      parent,
      {
        input: { name }
      },
      { user, prisma },
      info
    ) {
      const team = await prisma.user({ id: user.id }).team();
      if (team) {
        throw new UserInputError('You have already created a team.');
      } else {
        return prisma
          .updateUser({
            where: { id: user.id },
            data: {
              team: {
                create: {
                  name
                }
              }
            }
          })
          .team();
      }
    },
    async UpdateTeam(parent, { input }, { user, prisma }, info) {
      console.log('UpdateTeam resolver CALLED');

      const schema = yup.object().shape({
        name: yup.string().min(1, 'Team name must be at least 1 character')
      });

      try {
        await schema.validate(input, { abortEarly: false });
      } catch (error) {
        const { name, inner } = error;
        throw new UserInputError(name, {
          errors: inner.map(({ path, message }) => ({
            path,
            message
          }))
        });
      }

      const { name } = input;
      const team = await prisma.user({ id: user.id }).team();
      if (team) {
        return prisma.updateTeam({
          where: { id: team.id },
          data: { name }
        });
      }

      throw new UserInputError('You have not created team yet.');
    }
  }
};
