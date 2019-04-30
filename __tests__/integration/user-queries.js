import Stripe from 'stripe';
import sgMail from '@sendgrid/mail';
import { graphqlRequest, prisma } from '../../lib/test-util';
import {
  ME,
  PAYMENT_HISTORY,
  SIGNUP,
  LOGIN,
  UPDATE_USER,
  FORGOT_PASSWORD,
  RESET_PASSWORD,
  DELETE_USER,
  ADD_CREDIT_CARD,
  SUBSCRIBE_PLAN,
  INVITE_USER
} from '../../queries/user';

let user;
let jwt;

beforeEach(async () => {
  ({
    data: {
      Signup: { user, jwt }
    }
  } = await graphqlRequest({
    query: SIGNUP,
    variables: {
      input: {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@user.com',
        password: 'testpassword'
      }
    }
  }));
});

afterEach(async () => {
  await prisma.deleteManyUsers();
  await prisma.deleteManyTeams();
  await prisma.deleteManyInvites();
});

it('able to get user profile', async () => {
  const res = await graphqlRequest({
    headers: {
      Authorization: `Bearer ${jwt}`
    },
    query: ME
  });

  expect(res.data).toEqual({
    Me: expect.objectContaining({
      id: expect.any(String),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName
    })
  });
});

it('able to login successfully', async () => {
  const res = await graphqlRequest({
    query: LOGIN,
    variables: {
      input: {
        email: 'test@user.com',
        password: 'testpassword'
      }
    }
  });

  expect(res.data).toEqual({
    Login: expect.objectContaining({
      jwt: expect.any(String),
      user: expect.objectContaining({
        id: expect.any(String),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      })
    })
  });
});

it('able to signup successfully', async () => {
  const res = await graphqlRequest({
    query: SIGNUP,
    variables: {
      input: {
        firstName: 'New',
        lastName: 'User',
        email: 'new.user@test.com',
        password: 'testpassword'
      }
    }
  });

  expect(res.data).toEqual({
    Signup: expect.objectContaining({
      jwt: expect.any(String),
      user: expect.objectContaining({
        id: expect.any(String),
        email: 'new.user@test.com',
        firstName: 'New',
        lastName: 'User'
      })
    })
  });
});

describe('signup - validation errors', () => {
  it('returns correct error messages', async () => {
    const res = await graphqlRequest({
      query: SIGNUP,
      variables: {
        input: {
          firstName: '',
          lastName: '',
          email: 'test+user@.com',
          password: ''
        }
      }
    });

    expect(res.errors[0].extensions.exception.errors).toEqual({
      firstName: 'First name must be at least 1 characters',
      lastName: 'Last name must be at least 1 characters',
      email: 'Email must be a valid email',
      password: 'Password must be at least 6 characters'
    });
  });

  it('returns correct error message when email is taken during signup', async () => {
    const res = await graphqlRequest({
      query: SIGNUP,
      variables: {
        input: {
          firstName: 'Test',
          lastName: 'User',
          email: 'test@user.com',
          password: 'testpassword'
        }
      }
    });

    expect(res.errors[0].message).toBe('Email is already taken');
  });
});

it('able to update user profile successfully', async () => {
  const res = await graphqlRequest({
    headers: {
      Authorization: `Bearer ${jwt}`
    },
    query: UPDATE_USER,
    variables: {
      input: {
        email: 'updated+user@test.com'
      }
    }
  });

  expect(res.data).toEqual({
    UpdateUser: expect.objectContaining({
      id: expect.any(String),
      email: 'updated+user@test.com',
      firstName: user.firstName,
      lastName: user.lastName
    })
  });
});

it('able to update user password successfully', async () => {
  const res = await graphqlRequest({
    headers: {
      Authorization: `Bearer ${jwt}`
    },
    query: UPDATE_USER,
    variables: {
      input: {
        password: 'newpassword'
      }
    }
  });

  expect(res.data).toEqual({
    UpdateUser: expect.objectContaining({
      id: expect.any(String),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName
    })
  });
});

describe('Update user validation errors', () => {
  it('returns correct error messages', async () => {
    const res = await graphqlRequest({
      headers: {
        Authorization: `Bearer ${jwt}`
      },
      query: UPDATE_USER,
      variables: {
        input: {
          firstName: '',
          lastName: '',
          email: 'test+user@.com',
          password: ''
        }
      }
    });

    expect(res.errors[0].extensions.exception.errors).toEqual({
      firstName: 'First name must be at least 1 characters',
      lastName: 'Last name must be at least 1 characters',
      email: 'Email must be a valid email',
      password: 'Password must be at least 6 characters'
    });
  });
});

it('not able to request forgot password if user doesnt exist', async () => {
  const res = await graphqlRequest({
    query: FORGOT_PASSWORD,
    variables: {
      input: {
        email: 'weird+user@email.com'
      }
    }
  });

  expect(sgMail.send).not.toHaveBeenCalled();

  // Sends this message back to the user irrespective of success or not
  expect(res.data.ForgotPassword.message).toBe(
    'A link to reset your password will be sent to your registered email.'
  );
});

it('able to request forgot password successfully', async () => {
  const res = await graphqlRequest({
    query: FORGOT_PASSWORD,
    variables: {
      input: {
        email: user.email
      }
    }
  });

  expect(sgMail.send).toHaveBeenCalled();
  expect(res.data.ForgotPassword.message).toBe(
    'A link to reset your password will be sent to your registered email.'
  );
});

it('able to reset password with correct token', async () => {
  await prisma.updateUser({
    where: { email: user.email },
    data: {
      resetPasswordToken: 'RESET-PASSWORD-TOKEN'
    }
  });
  const res = await graphqlRequest({
    query: RESET_PASSWORD,
    variables: {
      input: {
        password: 'newpassword',
        token: 'RESET-PASSWORD-TOKEN'
      }
    }
  });

  expect(res.data).toEqual({
    ResetPassword: {
      message: 'Password updated successfully.'
    }
  });
});

it('not able to reset password with wrong token', async () => {
  await prisma.updateUser({
    where: { email: user.email },
    data: {
      resetPasswordToken: 'RESET-PASSWORD-TOKEN'
    }
  });
  const res = await graphqlRequest({
    query: RESET_PASSWORD,
    variables: {
      input: {
        password: 'newpassword',
        token: 'RESET-PASSWORD-TOKEN-WRONG'
      }
    }
  });

  expect(res.errors[0].message).toEqual('Password reset token is invalid.');
});

it('able to delete user successfully', async () => {
  const existingUsers = await prisma.users();
  expect(existingUsers.length).toBe(1);

  await graphqlRequest({
    headers: {
      Authorization: `Bearer ${jwt}`
    },
    query: DELETE_USER
  });

  const users = await prisma.users();
  expect(users.length).toBe(0);
});

it('able to add credit card', async () => {
  const res = await graphqlRequest({
    headers: {
      Authorization: `Bearer ${jwt}`
    },
    query: ADD_CREDIT_CARD,
    variables: {
      input: {
        token: 'CREDIT-CARD-TOKEN'
      }
    }
  });

  expect(res.data).toEqual({
    AddCreditCard: {
      message: 'Successfully updated billing information.'
    }
  });
});

it('able to subscribe to a plan', async () => {
  const res = await graphqlRequest({
    headers: {
      Authorization: `Bearer ${jwt}`
    },
    query: SUBSCRIBE_PLAN,
    variables: {
      input: {
        planId: 'STRIPE-PLAN-ID'
      }
    }
  });

  expect(res.data).toEqual({
    SubscribePlan: {
      message: 'Successfully subscribed to plan.'
    }
  });
});

it('able to get payment history', async () => {
  const res = await graphqlRequest({
    headers: {
      Authorization: `Bearer ${jwt}`
    },
    query: PAYMENT_HISTORY
  });

  expect(res).toMatchSnapshot();
});

it('able to invite other users to join a team', async () => {
  const res = await graphqlRequest({
    headers: {
      Authorization: `Bearer ${jwt}`
    },
    query: INVITE_USER,
    variables: {
      input: {
        firstName: 'Jacky',
        lastName: 'Chan',
        email: 'jacky@chan.com'
      }
    }
  });

  expect(sgMail.send).toHaveBeenCalledWith(
    expect.objectContaining({
      to: 'jacky@chan.com',
      dynamic_template_data: {
        invitee: 'Jacky Chan',
        inviter: user.email,
        signUpLink: expect.any(String)
      }
    })
  );

  expect(res.data).toEqual({
    InviteUser: {
      email: 'jacky@chan.com',
      firstName: 'Jacky',
      lastName: 'Chan',
      status: 'Pending'
    }
  });
});

it('able to signup successfully via an invite', async () => {
  await prisma.updateUser({
    where: { email: user.email },
    data: {
      team: {
        create: {
          name: 'Awesome team'
        }
      }
    }
  });

  await graphqlRequest({
    headers: {
      Authorization: `Bearer ${jwt}`
    },
    query: INVITE_USER,
    variables: {
      input: {
        firstName: 'Jacky',
        lastName: 'Chan',
        email: 'jacky@chan.com'
      }
    }
  });

  const invite = await prisma.invites({
    where: {
      user: {
        id: user.id
      }
    }
  });

  const res = await graphqlRequest({
    query: SIGNUP,
    variables: {
      input: {
        firstName: 'Test',
        lastName: 'User',
        email: 'invited+user@test.com',
        password: 'testpassword',
        inviteId: invite.id
      }
    }
  });
});
