import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const user = {
          id: "1",
          name: process.env.DASHBOARD_USER || "admin",
        };
        const expectedUser = process.env.DASHBOARD_USER || "admin";
        const expectedPass = process.env.DASHBOARD_PASS || "password";
        if (
          credentials &&
          credentials.username === expectedUser &&
          credentials.password === expectedPass
        ) {
          return user;
        }
        return null;
      },
    }),
  ],
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET || "dev-secret",
  pages: { signIn: "/auth/login" },
};

export default authOptions;
