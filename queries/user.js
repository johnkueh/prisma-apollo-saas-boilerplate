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
mutation Signup($firstName: String!, $lastName: String!, $email: String!, $password: String!) {
  signup(firstName: $firstName, lastName: $lastName, email: $email, password: $password) {
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
mutation Login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
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
mutation UpdateUser($firstName: String, $lastName: String, $email: String, $password: String) {
  updateUser(firstName: $firstName, lastName: $lastName, email: $email, password: $password) {
    id
    firstName
    lastName
    email
  }
}
`;

export const FORGOT_PASSWORD = `
mutation ForgotPassword($email: String!) {
  forgotPassword(email: $email) {
    message
  }
}
`;

export const DELETE_USER = `
mutation DeleteUser {
  deleteUser {
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
