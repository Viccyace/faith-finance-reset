import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "./db";
import User from "@/models/User";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        await dbConnect();
        const user = await User.findOne({ email: credentials.email.toLowerCase() });
        if (!user) return null;
        const isValid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!isValid) return null;
        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          onboardingComplete: user.onboardingComplete,
          currency: user.currency,
          country: user.country,
          plan: user.plan,
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.onboardingComplete = (user as any).onboardingComplete;
        token.currency = (user as any).currency;
        token.country = (user as any).country;
        token.plan = (user as any).plan;
      }
      if (trigger === "update" && session) {
        token.onboardingComplete = session.onboardingComplete ?? token.onboardingComplete;
        token.currency = session.currency ?? token.currency;
        token.name = session.name ?? token.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id;
        (session.user as any).onboardingComplete = token.onboardingComplete;
        (session.user as any).currency = token.currency;
        (session.user as any).country = token.country;
        (session.user as any).plan = token.plan;
      }
      return session;
    },
  },
};
