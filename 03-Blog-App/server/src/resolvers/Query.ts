import { Context } from "..";

export const Query = {
    me: async(_: any, __: any, { userInfo, prisma }: Context) => {
        if(!userInfo) return null;
        return await prisma.user.findUnique({
            where: {
                id: userInfo.userId
            }
        })
    },

    profile: async(_: any, { userId }: { userId: string }, { prisma }: Context) => {
        return await prisma.profile.findUnique({
            where: {
                userId: Number(userId)
            }
        })
    },

    posts: async (_: any, __: any, { prisma }: Context) => {
        return await prisma.post.findMany({
            where: {
                published: true
            },
            orderBy: [
                {
                    createdAt: "desc",
                },
            ]
        });
    }
};