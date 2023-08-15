import NextAuth from "next-auth/next";
import GoogleProvider from 'next-auth/providers/google'
import { connectToDB } from "@/utils/database";
import User from "@/models/User";

export const authOptions = {
    pages:{
        signIn:'/login'
    },
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        })
    ],
    callbacks:{
        async session({session, token}){
            await connectToDB()
            const tokenUser = await User.findOne({
                email: session.user.email
            })
            session.user.isEventManager = tokenUser.isEventManager
            session.user.id = tokenUser.id
            session.user.stripeCustomerId = tokenUser.stripeCustomerId
            return session
        },
        async jwt({token, profile}){
            return token
        },
        async signIn({profile}){
            try {

                await connectToDB();
                const userExists = await User.findOne({email: profile.email})
                if (!userExists){
                    await User.create({
                        email:profile.email,
                        name: profile.name
                    })
                }
                
                return true
                
            } catch (error) {
                return false
            }
        }
    }
}

const handler = NextAuth(authOptions)


export {handler as GET, handler as POST}