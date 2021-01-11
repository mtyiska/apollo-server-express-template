import { gql } from "apollo-server-express";
export default gql`
  extend type Query {
    getAuthUserProfile: User! @isAuth
    authenticateUser(username: String!, password: String!): AuthResponse!
  }

  extend type Mutation {
    registerUser(input: CreateUser!): AuthResponse!
  }

  input CreateUser {
    email: String!
    username: String!
    firstName: String!
    lastName: String!
    password: String!
    avatarImage: String
  }

  # remove password from here so we don't expose it
  type User {
    id: ID!
    email: String!
    username: String!
    firstName: String!
    lastName: String!
    avatarImage: String
  }

  type AuthResponse {
    success: Boolean!
    user: User!
    token: String!
  }
`;
