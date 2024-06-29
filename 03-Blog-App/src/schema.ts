import { gql } from "apollo-server";

export const typeDefs = gql`
    type Query {
        posts: [Post!]!
    }

    type Mutation {
        postCreate(post: PostInput!): PostPayload!
        postUpdate(postId: ID!, post: PostInput!): PostPayload!
        postDelete(postId: ID!): PostPayload!
        signup(credentials: CredentialsInput!, name: String!, bio: String!): AuthPayload
        signin(credentials: CredentialsInput!): AuthPayload
    }

    type Post {
        id: ID!
        title: String!
        content: String!
        publishied: Boolean!
        createdAt: String!
        user: User!
    }

    type User {
        id: ID!
        email: String!
        name: String!
        createdAt: String!
        profile: Profile!
        posts: [Post!]!
    }

    type Profile {
        id: ID!
        bio: String!
        user: User!
    }

    type UserError {
        message: String!
    }

    type PostPayload {
        userErrors: [UserError!]!
        post: Post
    }

    type AuthPayload {
        userErrors: [UserError!]!
        token: String
    }

    input PostInput {
        title: String
        content: String
    }

    input CredentialsInput {
        email: String!
        password: String!
    }
`