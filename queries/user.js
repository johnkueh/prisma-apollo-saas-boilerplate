import { gql } from 'apollo-server-express';

export const ME = gql`
  query {
    Me {
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
  PaymentHistory {
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

export const RESET_PASSWORD = `
mutation ResetPassword($input: ResetPasswordInput!) {
  ResetPassword(input: $input) {
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
mutation AddCreditCard($input: AddCreditCardInput!) {
  AddCreditCard(input: $input) {
    message
  }
}
`;

export const SUBSCRIBE_PLAN = `
mutation SubscribePlan($input: SubscribePlanInput!) {
  SubscribePlan(input: $input) {
    message
  }
}
`;

export const INVITE_USER = `
mutation InviteUser($input: InviteUserInput!) {
  InviteUser(input: $input) {
    email
    firstName
    lastName
    status
  }
}
`;
