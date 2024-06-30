import { Context } from "..";

interface UserParentType {
    id: number,
}

export const User = {
    posts: async(parent: UserParentType, __: any, { userInfo, prisma }: Context) => {
        const isOwnedProfile = parent.id === userInfo?.userId;
        if(isOwnedProfile){
            return await prisma.post.findMany({
                where: {
                    authorId: parent.id
                }, 
                orderBy: [
                    {
                        createdAt: "desc"
                    }
                ]
            })
        }else{
            return await prisma.post.findMany({
                where: {
                    authorId: parent.id,
                    published: true
                },
                orderBy: [
                    {
                        createdAt: "desc"
                    }
                ]
            })
        }
    },
};