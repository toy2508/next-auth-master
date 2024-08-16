import {PrismaClient, User, UserRole} from "@prisma/client";
import NextAuth, {DefaultSession} from "next-auth";
import {PrismaAdapter} from "@auth/prisma-adapter";
import authConfig from "@/auth.config";
import {getUserById} from "@/data/user";
import {db} from "@/lib/db";
import {getTwoFactorConfirmationByUserId} from "@/data/two-factor-confirmation";
import {getAccountByUserId} from "@/data/accounts";

// type UserProps = (User & { role: UserRole; isTwoFactorEnabled: boolean; isOAuth: boolean; }) | undefined


const prisma = new PrismaClient()


export const {
    handlers: {GET, POST},
    auth,
    signIn,
    signOut,
} = NextAuth({
    pages: {
        signIn: "/auth/login",
        error: "/auth/error"
    },
    events: {
        async linkAccount({user}){
            await db.user.update({
                where: {id: user.id},
                data: { emailVerified: new Date()}
            })
        }
    },
    callbacks: {
        async signIn({user, account}) {
            // Allow OAuth without email verification
            if (account?.provider !== "credentials") return true;

            const existingUser = await getUserById(user.id!)

            // Prevent sign in without email verification
            if (!existingUser?.emailVerified) return false;

            // TODO: ADD 2FA Check
            if(existingUser.isTwoFactorEnabled) {

                const twoFactorConfirmation
                    = await getTwoFactorConfirmationByUserId(existingUser.id)

                if(!twoFactorConfirmation) return false;

                // Delete two factor confirmation for next sign in
                await db.twoFactorConfirmation.delete({
                    where: {id: twoFactorConfirmation.id}
                })
            }

            return true
        },
        async session({token, session}) {
            if (token.sub && session.user) {
                session.user.id = token.sub;
            }
            
            // role 추가, next-auth.d.ts 파일에 session role type 추가
            if (token.role && session.user) {
                session.user.role = token.role;
            }

            if (token.isTwoFactorEnabled && session.user) {
                session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
            }

            if(session.user) {
                session.user.name = token.name;
                session.user.email = token.email!;
                session.user.isOAuth = token.isOAuth as boolean;
            }
            return session;
        },
        // jwt callback 함수를 작성해주면 session callback 함수에서 인자로 받을 수 있다.
        async jwt({token}) {
            if(!token.sub) return token;
            const existingUser = await getUserById(token.sub);


            if (!existingUser) return token;
            const existingAccount = await getAccountByUserId(existingUser?.id!)


            token.isOAuth = !!existingAccount;
            token.name = existingUser.name;
            token.email = existingUser.email;
            token.role = existingUser.role;
            token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;

            return token
        }
    },
    adapter: PrismaAdapter(prisma),
    session: {strategy: "jwt"},
    ...authConfig
})