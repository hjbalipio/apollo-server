import { JSON_SIGNATURE } from '../../keys';
import { Context } from '../../index';
import validator from "validator";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";
import { User } from '@prisma/client';

interface SignupArgs {
    credentials: {
        email: string;
        password: string;
    };
    name: string;
    bio: string;
}

interface SigninArgs {
    credentials: {
        email: string;
        password: string;
    };
}

interface AuthPayload {
    userErrors: {
        message: string
    }[],
    token: string | null
}

export const authResolvers = {
    signup: async (_: any, { credentials, name, bio }: SignupArgs, { prisma }: Context ): Promise<AuthPayload> => {
        const { email, password } = credentials;
        const isEmail = validator.isEmail(email);
        if(!isEmail){
            return {
                userErrors: [{
                    message: "Please provide a valid email"
                }],
                token: null
            }
        }

        const isValidPassword = validator.isLength(password, { min: 5 });
        if(!isValidPassword){
            return {
                userErrors: [{
                    message: "Invalid Password"
                }],
                token: null
            }
        }

        if(!name || !bio){
            return {
                userErrors: [{
                    message: "Invalid name or bio"
                }],
                token: null
            }
        }

        const isEmailExist = await prisma.user.findFirst({
            where: {
                email
            }
        });

        if(isEmailExist){
            return {
                userErrors: [{
                    message: "Email is already registered!"
                }],
                token: null
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        
        const user = await prisma.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
            }
        });

        await prisma.profile.create({
            data: {
                userId: user.id,
                bio: bio
            }
        });

        return {
            userErrors: [],
            token: JWT.sign({
                    userId: user.id,
                    email: user.email
                }, JSON_SIGNATURE, {
                    expiresIn: 3600000,
                })
        }
    },

    signin: async (_: any, { credentials }: SigninArgs, { prisma }: Context): Promise<AuthPayload> => {
        const { email, password } = credentials;
        
        const user = await prisma.user.findUnique({
            where: {
                email
            }
        });

        if(!user){
            return {
                userErrors: [
                    {
                        message: "Invalid credentials",
                    }
                ],
                token: null
            }
        }

        const isMatchPassword = await bcrypt.compare(password, user.password);

        if(!isMatchPassword){
            return {
                userErrors: [
                    {
                        message: "Invalid credentials",
                    }
                ],
                token: null
            }
        }

        return {
            userErrors: [],
            token: JWT.sign({ userId: user.id }, JSON_SIGNATURE, {
                expiresIn: 3600000,
            })
        }

    }
}