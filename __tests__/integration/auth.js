import { graphqlRequest } from '../../lib/test-util';
import {
  ME,
  PAYMENT_HISTORY,
  UPDATE_USER,
  DELETE_USER,
  ADD_CREDIT_CARD,
  SUBSCRIBE_PLAN,
  INVITE_USER
} from '../../queries/user';

const errorMessage = 'You must be authenticated to perform this action';

describe('unauthenticated requests', () => {
  it('shows authentication error for ME', async () => {
    const res = await graphqlRequest({ query: ME });
    expect(res.errors[0].message).toBe(errorMessage);
  });

  it('shows authentication error for PAYMENT_HISTORY', async () => {
    const res = await graphqlRequest({ query: PAYMENT_HISTORY });
    expect(res.errors[0].message).toBe(errorMessage);
  });

  it('shows authentication error for UPDATE_USER', async () => {
    const res = await graphqlRequest({
      query: UPDATE_USER,
      variables: {
        input: {
          firstName: 'Test',
          lastName: 'User',
          email: 'test@user.com',
          password: 'testpassword'
        }
      }
    });
    expect(res.errors[0].message).toBe(errorMessage);
  });

  it('shows authentication error for DELETE_USER', async () => {
    const res = await graphqlRequest({ query: DELETE_USER });
    expect(res.errors[0].message).toBe(errorMessage);
  });

  it('shows authentication error for ADD_CREDIT_CARD', async () => {
    const res = await graphqlRequest({
      query: ADD_CREDIT_CARD,
      variables: {
        input: {
          token: 'tok_123'
        }
      }
    });
    expect(res.errors[0].message).toBe(errorMessage);
  });

  it('shows authentication error for SUBSCRIBE_PLAN', async () => {
    const res = await graphqlRequest({
      query: SUBSCRIBE_PLAN,
      variables: {
        input: {
          planId: 'plan_123'
        }
      }
    });
    expect(res.errors[0].message).toBe(errorMessage);
  });

  it('shows authentication error for INVITE_USER', async () => {
    const res = await graphqlRequest({
      query: INVITE_USER,
      variables: {
        input: {
          firstName: 'Jacky',
          lastName: 'Chan',
          email: 'jacky@chan.com'
        }
      }
    });
    expect(res.errors[0].message).toBe(errorMessage);
  });
});
