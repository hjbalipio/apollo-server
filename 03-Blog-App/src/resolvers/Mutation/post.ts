import { canUserMutatePost } from './../../utils/canUserMutatePost';
import { Context } from '../../index';
import { Post, Prisma } from "@prisma/client"

interface PostsArgs {
    post: {
        title?: string
        content?: string
    }
}

interface PostPayloadType {
    userErrors: {
        message: string
    }[],
    post: Post | Prisma.Prisma__PostClient<Post> | null;
}

export const postResolvers = {
    postCreate: async (_: any, { post }: PostsArgs, { prisma, userInfo }: Context): Promise<PostPayloadType> => {
        if(!userInfo){
            return {
                userErrors: [{
                    message: "Forbidden access (unauthenticated)"
                }],
                post: null
            }
        }

        const { title, content } = post;
        if(!title || !content){
             return {
                 userErrors: [{
                     message: "You must provide title and content to create a post"
                 }],
                 post: null
             }
         }
         
         return {
             userErrors: [], 
             post: prisma.post.create({
                     data: {
                         title, 
                         content,
                         authorId: userInfo.userId
                     }
                 })
         }
    },
 
     postUpdate: async (_: any, { post, postId }: { postId: string, post: PostsArgs["post"] }, { prisma, userInfo }: Context): Promise<PostPayloadType> => {
        if(!userInfo){
            return {
                userErrors: [{
                    message: "Forbidden access (unauthenticated)"
                }],
                post: null
            }
        }

        const error = await canUserMutatePost({ 
            userId: userInfo.userId,
            postId: Number(postId),
            prisma
        });

        if(error) return error;

        const { title, content } = post;
 
        if(!title && !content) {
             return {
                 userErrors: [{
                     message: "You must provide title or content to update a post"
                 }],
                 post: null
             }
         }
 
         const isPostExist = await prisma.post.findUnique({
             where: {
                 id: Number(postId)
             }
         });
 
         if(!isPostExist) {
             return {
                 userErrors: [{
                     message: "Post is not exist"
                 }],
                 post: null
             }
         }
 
         let payloadToUpdate = {
             title,
             content
         }
 
         if(!title) delete payloadToUpdate.title
         if(!content) delete payloadToUpdate.content
 
         return {
             userErrors: [],
             post: prisma.post.update({
                 data: {
                     ...payloadToUpdate
                 },
                 where: {
                     id: Number(postId)
                 }
             })
         }
    },
 
    postDelete: async (_:any, { postId }: { postId: string }, { prisma, userInfo }: Context): Promise<PostPayloadType> => {
        if(!userInfo){
            return {
                userErrors: [{
                    message: "Forbidden access (unauthenticated)"
                }],
                post: null
            }
        }

        const error = await canUserMutatePost({ 
            userId: userInfo.userId,
            postId: Number(postId),
            prisma
        });

        if(error) return error;

        const post = await prisma.post.findUnique({
             where: {
                 id: Number(postId)
             }
        });
 
        if(!post) {
             return {
                 userErrors: [{
                     message: "Post is not exist"
                 }],
                 post: null
             }
        }
 
        await prisma.post.delete({
             where: {
                 id: Number(postId)
             }
        });
 
        return {
             userErrors: [],
             post
        }
    }
 };