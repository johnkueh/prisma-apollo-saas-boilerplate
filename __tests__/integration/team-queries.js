import { graphqlRequest, prisma } from '../../lib/test-util';
import { SIGNUP } from '../../queries/user';
import { CREATE_TEAM, UPDATE_TEAM } from '../../queries/team';

describe('Team queries', () => {
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
  });

  it('creating a team when team already exists returns an error', async () => {
    await prisma.updateUser({
      where: { email: user.email },
      data: {
        team: {
          create: {
            name: 'Existing team'
          }
        }
      }
    });

    const res = await graphqlRequest({
      headers: {
        Authorization: `Bearer ${jwt}`
      },
      query: CREATE_TEAM,
      variables: {
        input: {
          name: 'New team name'
        }
      }
    });

    expect(res.errors[0].message).toEqual('You have already created a team.');
  });

  it('able to create team for user', async () => {
    const res = await graphqlRequest({
      headers: {
        Authorization: `Bearer ${jwt}`
      },
      query: CREATE_TEAM,
      variables: {
        input: {
          name: 'A new team name'
        }
      }
    });

    expect(res.data).toEqual({
      CreateTeam: {
        id: expect.any(String),
        name: 'A new team name'
      }
    });
  });

  it('able to update team name for user', async () => {
    await prisma.updateUser({
      where: { email: user.email },
      data: {
        team: {
          create: {
            name: 'Existing team'
          }
        }
      }
    });

    const res = await graphqlRequest({
      headers: {
        Authorization: `Bearer ${jwt}`
      },
      query: UPDATE_TEAM,
      variables: {
        input: {
          name: 'Updated team name'
        }
      }
    });

    expect(res.data).toEqual({
      UpdateTeam: {
        id: expect.any(String),
        name: 'Updated team name'
      }
    });
  });

  it('returns error if team name not provided', async () => {
    const res = await graphqlRequest({
      headers: {
        Authorization: `Bearer ${jwt}`
      },
      query: UPDATE_TEAM,
      variables: {
        input: {
          name: ''
        }
      }
    });

    expect(res.errors[0].extensions.exception.errors.name).toBe(
      'Team name must be at least 1 character'
    );
  });
});
