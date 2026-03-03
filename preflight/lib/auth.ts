import CredentialsProvider from "next-auth/providers/credentials";
import EmailProvider from "next-auth/providers/email";
import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "./prisma";
import type { Adapter } from 'next-auth/adapters';

type SimpleUser = { id: string; name?: string };

const providers = [
  CredentialsProvider({
    name: "Credentials",
    credentials: {
      username: { label: "Username", type: "text" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      const user: SimpleUser = {
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
];

// If email server is configured, add Email provider (magic link)
if (process.env.EMAIL_SERVER && process.env.EMAIL_FROM) {
  providers.push(
    // EmailProvider returns a provider configuration usable by NextAuth
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    })
  );
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as unknown as Adapter,
  providers,
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET || "dev-secret",
  pages: { signIn: "/auth/login" },
};

export default authOptions;
