import { mockServer } from 'graphql-tools';
import schema from '../index';
import {
  ME,
  PAYMENT_HISTORY,
  SIGNUP,
  LOGIN,
  UPDATE_USER,
  FORGOT_PASSWORD,
  DELETE_USER,
  ADD_CREDIT_CARD,
  SUBSCRIBE_PLAN
} from '../../queries/user';

const mocks = {
  Boolean: () => false,
  ID: () => '1',
  Int: () => 1,
  Float: () => 12.34,
  String: () => 'String',
  DateTime: () => new Date(2018, 8, 8)
};

const server = mockServer(schema, mocks, false);

describe('User schema', () => {
  it('has valid type definitions', () => {
    expect(() => server.query(`{ __schema { types { name } } }`)).not.toThrow();
  });

  it(`query { me } should return expected value`, () => {
    const variables = {};
    expect(server.query(ME, variables)).resolves.toMatchSnapshot();
  });

  it(`query { paymentHistory } should return expected value`, () => {
    const variables = {};
    expect(server.query(PAYMENT_HISTORY, variables)).resolves.toMatchSnapshot();
  });

  it(`mutation { signUp } should return expected value`, () => {
    const variables = {
      firstName: 'John',
      lastName: 'Kueh',
      email: 'john@beaconmaker.com',
      password: 'test123'
    };

    expect(server.query(SIGNUP, variables)).resolves.toMatchSnapshot();
  });

  it(`mutation { login } should return expected value`, () => {
    const variables = {
      email: 'john@beaconmaker.com',
      password: 'test123'
    };

    expect(server.query(LOGIN, variables)).resolves.toMatchSnapshot();
  });

  it(`mutation { forgotPassword } should return expected value`, () => {
    const variables = {
      email: 'john@beaconmaker.com'
    };

    expect(server.query(FORGOT_PASSWORD, variables)).resolves.toMatchSnapshot();
  });

  it(`mutation { updateUser } should return expected value`, () => {
    const variables = {
      firstName: 'John',
      lastName: 'Kueh',
      email: 'john@beaconmaker.com',
      password: 'test123'
    };

    expect(server.query(UPDATE_USER, variables)).resolves.toMatchSnapshot();
  });

  it(`mutation { deleteUser } should return expected value`, () => {
    const variables = {
      id: 1
    };

    expect(server.query(DELETE_USER, variables)).resolves.toMatchSnapshot();
  });

  it(`mutation { addCreditCard } should return expected value`, () => {
    const variables = {
      token: 'tok_1234'
    };

    expect(server.query(ADD_CREDIT_CARD, variables)).resolves.toMatchSnapshot();
  });

  it(`mutation { subscribePlan } should return expected value`, () => {
    const variables = {
      planId: 'plan_123'
    };

    expect(server.query(SUBSCRIBE_PLAN, variables)).resolves.toMatchSnapshot();
  });
});
