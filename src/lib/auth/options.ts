import bcrypt from "bcryptjs";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { z } from "zod";
import { prisma } from "@/lib/database/prisma";
import { ensureDemoOAuthUser, findDemoUserByEmail, isDemoStore } from "@/lib/database/demo-store";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "Email and password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;
        const user = isDemoStore
          ? await findDemoUserByEmail(parsed.data.email)
          : await prisma.user.findUnique({ where: { email: parsed.data.email.toLowerCase() } });
        if (!user) return null;
        const isValid = await bcrypt.compare(parsed.data.password, user.password);
        if (!isValid) return null;
        return { id: user.id, name: user.name, email: user.email };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "google" || !user.email) return true;
      if (isDemoStore) {
        await ensureDemoOAuthUser({ name: user.name, email: user.email });
        return true;
      }
      await prisma.user.upsert({
        where: { email: user.email.toLowerCase() },
        update: { name: user.name || user.email },
        create: {
          name: user.name || user.email,
          email: user.email.toLowerCase(),
          password: await bcrypt.hash(crypto.randomUUID(), 12),
        },
      });
      return true;
    },
    async jwt({ token, user, account }) {
      if (user?.id && account?.provider !== "google") token.id = user.id;
      if (account?.provider === "google" && user?.email) {
        const appUser = isDemoStore
          ? await ensureDemoOAuthUser({ name: user.name, email: user.email })
          : await prisma.user.findUnique({ where: { email: user.email.toLowerCase() } });
        if (appUser) token.id = appUser.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) session.user.id = token.id as string;
      return session;
    },
  },
};
