import _ from 'lodash';
import sendEmail from '../services/sendgrid';

export default {
  Mutation: {
    async InviteUser(parent, { input }, { user, prisma }, info) {
      const { email, firstName, lastName } = input;
      const team = await prisma.user({ id: user.id }).team();
      const invite = await prisma.createInvite({
        email,
        firstName,
        lastName,
        user: {
          connect: {
            id: user.id
          }
        },
        team: {
          connect: {
            id: team.id
          }
        }
      });

      sendEmail({
        template_id: process.env.INVITE_USER_TEMPLATE_ID,
        to: email,
        from: process.env.SUPPORT_EMAIL_ADDRESS,
        dynamic_template_data: {
          invitee: `${firstName} ${lastName}`,
          inviter: user.email,
          signUpLink: `https://app.zapcms.com/signup?inviteId=${invite.id}`
        }
      });

      return invite;
    }
  }
};
