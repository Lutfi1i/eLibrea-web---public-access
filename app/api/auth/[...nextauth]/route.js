import { getUserByEmail, getUserById } from "@/lib/action";
import { compare } from "bcryptjs";
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    cookies: {
        sessionToken: {
            name: `next-auth.session-token`,
            options: {
                httpOnly: true,
                sameSite: 'lax',
                path: '/',
                secure: process.env.NODE_ENV === 'production',
            },
        },
    },
    pages: {
        signIn: '/login'
    },
    providers: [
  
    CredentialsProvider({
    async authorize(credentials, req) {
        //  1. Unboxing data credentials
        const email = credentials?.email;
        const password = credentials?.password;

        //  2. Mencari user berdasarkan email
        const user = await getUserByEmail(email); 

        if (!user) return null;

        //  3. Mengcompare password
        const isValid = await compare(password, user.password);

        if (!isValid) return null;

        //  4. Simpan user kedalam session
        return {
            name: user.username,
            id: user.id,
            email: user.email, 
            role : user.role,
            profile_picture: user.profile_picture
        }
     }
   })
 ], 
 callbacks: {
  async jwt({ user, token }) {
    if (user) {
      token.id = user.id;
      token.role = user.role
      token.profile_picture = user.profile_picture
    } else if (token?.id) {
      const existingUser = await getUserById(token.id);
      if (existingUser) {
        token.role = existingUser.role;
        token.profile_picture = existingUser.profile_picture;
      }
    }
    return token;
  },
  async session({ session, token }) {
    if (session.user) {
      session.user.role = token.role;
      session.user.id = token.id;
      const existingUser = await getUserById(token.id);
      session.user.profile_picture = existingUser?.profile_picture ?? token.profile_picture ?? null;
    }
    return session;
  }
 }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }

