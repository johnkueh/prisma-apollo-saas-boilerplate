import { UserInputError } from 'apollo-server';

export default {
  Mutation: {
    async createTeam(parent, { name }, { user, prisma }, info) {
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
    async updateTeam(parent, { name }, { user, prisma }, info) {
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
