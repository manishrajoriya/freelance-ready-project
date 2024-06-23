import NextAuthOption, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/dbConnect";
import UserModel from "@/models/user";


export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials:any): Promise<any> {
                await connectDB();
                try {
                   const user = await UserModel.findOne({
                        $or: [
                            { email: credentials.identifier },
                            { username: credentials.identifier }
                        ]
                    })
                    if (!user) {
                        throw new Error("User not found");
                    }

                    if (!user.isVerified) {
                        throw new Error("User not verified");
                    
                    }

                   const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

                   if (isPasswordValid) {
                    return user;
                   }else{
                    throw new Error("Invalid password");
                   
                   }
                } catch (error:any) {
                    throw new Error(error);
                }
            }
            
        })
    ],
    callbacks: {
       
    async jwt({ token, user,  }) {
        if (user) {
            token._id = user._id?.toString()
            token.isVerified = user.isVerified
            token.isAcceptingMessages = user.isAcceptingMessages
            token.username = user.username
        }

      return token
    },
    async session({ session, token }) {
        if (token && session.user) {
            session.user._id = token._id 
            session.user.isVerified = token.isVerified
            session.user.isAcceptingMessages = token.isAcceptingMessages 
            session.user.username = token.username 
        }
      return session
    },
       
    },

    pages: {
        signIn: "/sign-in"
    },
    session: {
        strategy: "jwt"
    
    },
    secret: process.env.NEXTAUTH_SECRET
}