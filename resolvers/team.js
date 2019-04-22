import _ from 'lodash';
import { UserInputError } from 'apollo-server';
import { validateTeam } from '../validators/team';

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
      await validateTeam(input);

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
