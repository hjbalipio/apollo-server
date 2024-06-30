import { getUserFromToken } from './utils/getUserFromToken';
import { ApolloServer, gql } from "apollo-server";
import { typeDefs } from "./schema";
import { Query, Mutation, Profile, Post, User } from "./resolvers";
import { PrismaClient, Prisma } from '@prisma/client';
import { DefaultArgs } from "@prisma/client/runtime/library";

export const prisma = new PrismaClient();

export interface Context {
    prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
    userInfo: {
        userId: number;
    } | null
}

const server = new ApolloServer({
    typeDefs,
    resolvers: {
        Query,
        Mutation,
        Profile,
        Post,
        User
    },
    context: async ({ req }: any): Promise<Context> => {
        const userInfo = await getUserFromToken(req.headers.authorization);

        return {
            prisma,
            userInfo
        }
    }
});

server.listen().then(({url}) => {
    console.log(`Server is ready 🚀 at ${url}`);
})
