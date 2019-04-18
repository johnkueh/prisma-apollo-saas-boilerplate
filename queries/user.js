import { gql } from 'apollo-server-express';

export const ME = gql`
  query {
    me {
      id
      firstName
      lastName
      fullName
      email
      createdAt
      updatedAt
      periodStart
      periodEnd
      team {
        id
        name
      }
    }
  }
`;

export const PAYMENT_HISTORY = `
query {
  paymentHistory {
    amountDue
    amountPaid
    invoicePdf
    status
    date
    periodStart
    periodEnd
  }
}
`;

export const SIGNUP = `
mutation Signup($input: SignupInput!) {
  Signup(input: $input) {
    jwt
    user {
      id
      firstName
      lastName
      email
    }
  }
}
`;

export const LOGIN = `
mutation Login($input: LoginInput!) {
  Login(input: $input) {
    jwt
    user {
      id
      firstName
      lastName
      email
    }
  }
}
`;

export const UPDATE_USER = `
mutation UpdateUser($input: UpdateUserInput!) {
  UpdateUser(input: $input) {
    id
    firstName
    lastName
    email
  }
}
`;

export const FORGOT_PASSWORD = `
mutation ForgotPassword($input: ForgotPasswordInput!) {
  ForgotPassword(input: $input) {
    message
  }
}
`;

export const DELETE_USER = `
mutation DeleteUser {
  DeleteUser {
    id
  }
}
`;

export const ADD_CREDIT_CARD = `
mutation AddCreditCard($token: String!) {
  addCreditCard(token: $token) {
    message
  }
}
`;

export const SUBSCRIBE_PLAN = `
mutation SubscribePlan($planId: String!) {
  subscribePlan(planId: $planId) {
    message
  }
}
`;
