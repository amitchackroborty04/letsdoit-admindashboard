import NextAuth, { NextAuthOptions, Session, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";
import axios from "axios";

type AppUser = User & {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  profileImage?: string;
  accessToken?: string;
  refreshToken?: string;
};

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
            email: credentials.email,
            password: credentials.password,
          });

          const data = res.data;

          if (data.status && data.data) {
            const user = data.data.user;
            const accessToken = data.data.accessToken;

            // Check if user is admin or seller/producer (depending on project needs)
            // For now, let's keep it flexible but check if the user is not just a regular user if it's an admin dashboard
            // The user provided a role "USER" in the example, so I should be careful.
            // But usually admin dashboard is for ADMINs.
            // If the user said "tmr kajh holo authentication integration done kora", 
            // I'll allow "ADMIN" and maybe "USER" if it's for testing, but typically ADMIN.

            // I'll stick to what the user provides.
            return {
              ...user,
              id: user._id,
              accessToken,
              refreshToken: user.refreshToken,
            };
          }

          return null;
        } catch (error: unknown) {
          const errorMessage = axios.isAxiosError(error)
            ? error.response?.data?.message || error.message
            : error instanceof Error
              ? error.message
              : "Login failed";

          if (errorMessage === "Invalid credentials") {
            throw new Error("INVALID_CREDENTIALS");
          }
          throw new Error(errorMessage);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: User }) {
      const appUser = user as AppUser | undefined;

      if (user) {
        token.accessToken = appUser?.accessToken;
        token.refreshToken = appUser?.refreshToken;
        token.user = {
          _id: appUser?._id || "",
          firstName: appUser?.firstName || "",
          lastName: appUser?.lastName || "",
          email: appUser?.email || "",
          role: appUser?.role || "",
          profileImage: appUser?.profileImage,
        };
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      session.accessToken = token.accessToken;
       session.refreshToken = token.refreshToken;
      session.user = token.user;
      return session;
    },
  },
  pages: {
    signIn: "/signin",
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
