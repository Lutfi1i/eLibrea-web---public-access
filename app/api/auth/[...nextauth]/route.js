import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { API_BASE_URL } from "@/lib/api";

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
        async authorize(credentials) {
          const email = credentials?.email?.toString().trim();
          const password = credentials?.password?.toString() || "";

          if (!email || !password) return null;

          try {
            const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok || !data?.success || !data?.data?.user) {
              throw new Error(data?.message || "Email atau password salah");
            }

            const { user, token } = data.data;

            return {
              id: user.id,
              email: user.email,
              name: user.name || user.username,
              username: user.username,
              role: user.role,
              profile_picture: user.profile_picture,
              accessToken: token,
            };
          } catch (error) {
            console.error("Login via API gagal:", error);
            return null;
          }
        },
      }),
    ], 
 callbacks: {
    async jwt({ user, token }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.profile_picture = user.profile_picture;
        token.username = user.username;
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.profile_picture = token.profile_picture ?? null;
        session.user.username = token.username;
      }
      session.accessToken = token.accessToken;
      return session;
    },
  }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }

