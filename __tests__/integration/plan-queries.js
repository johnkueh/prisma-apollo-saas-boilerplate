import { graphqlRequest, prisma } from '../../lib/test-util';
import { SIGNUP } from '../../queries/user';
import { PLANS } from '../../queries/plan';

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
});

it('able to retrieve all plans', async () => {
  const res = await graphqlRequest({
    headers: {
      Authorization: `Bearer ${jwt}`
    },
    query: PLANS
  });

  expect(res).toMatchSnapshot();
});
