import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    me: User @requireAuth
    paymentHistory: [Invoice] @requireAuth
  }

  extend type Mutation {
    Signup(input: SignupInput!): AuthPayload! @analytics(type: "identify")
    Login(input: LoginInput!): AuthPayload! @analytics(type: "identify")
    ForgotPassword(input: ForgotPasswordInput!): Result
    ResetPassword(input: ResetPasswordInput!): Result
    UpdateUser(input: UpdateUserInput!): User! @requireAuth
    addCreditCard(token: String): Result @requireAuth
    subscribePlan(planId: String!): Result @requireAuth
    DeleteUser: User! @requireAuth
  }

  input SignupInput {
    firstName: String!
    lastName: String!
    email: String!
    password: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input ForgotPasswordInput {
    email: String!
  }

  input ResetPasswordInput {
    email: String!
    token: String!
  }

  input UpdateUserInput {
    firstName: String
    lastName: String
    email: String
    password: String
  }

  type AuthPayload {
    jwt: String!
    user: User!
  }

  type Result {
    message: String
  }

  type User {
    id: String
    firstName: String
    lastName: String
    fullName: String @computed(value: "$firstName $lastName")
    email: String
    createdAt: DateTime
    updatedAt: DateTime
    periodStart: DateTime
    periodEnd: DateTime
    team: Team
  }

  type Invoice {
    amountDue: Int
    amountPaid: Int
    invoicePdf: String
    status: String
    date: DateTime
    periodStart: DateTime
    periodEnd: DateTime
  }
`;
