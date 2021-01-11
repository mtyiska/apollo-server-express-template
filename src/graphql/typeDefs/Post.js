import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    listPosts: [Post!]!
    getPost(id: ID!): PostResponse!
  }

  input CreatePost {
    title: String!
    content: String!
    featureImage: String
  }

  input UpdatePost {
    title: String
    content: String
    featureImage: String
  }

  type PostResponse {
    success: Boolean!
    post: Post
  }

  extend type Mutation {
    createPost(input: CreatePost!): PostResponse! @isAuth
    updatePost(id: ID!, input: UpdatePost!): PostResponse! @isAuth
    deletePost(id: ID!): PostResponse! @isAuth
  }

  # User type is coming from extending the base type
  type Post {
    id: ID
    title: String!
    content: String!
    featureImage: String
    createdAt: String
    updatedAt: String
    author: User!
  }
`;
