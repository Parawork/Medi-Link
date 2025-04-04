// auth.ts
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import type { User } from "next-auth";
import { prisma } from "@/app/utils/db";
import { Patient, Pharmacy } from "@prisma/client";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials): Promise<User | null> => {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
          include: {
            patient: true,
            pharmacy: true,
          },
        });

        if (!user || !user.password) return null;

        const isValid = await compare(
          credentials.password as string,
          user.password
        );

        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          role: user.role,
          name: user.username,
          ...(user.role === "PATIENT" && { patient: user.patient }),
          ...(user.role === "PHARMACY" && { pharmacy: user.pharmacy }),
        };
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user, trigger, session }) => {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        if (user.role === "PATIENT" && "patient" in user) {
          token.patient = user.patient;
        }
        if (user.role === "PHARMACY" && "pharmacy" in user) {
          token.pharmacy = user.pharmacy;
        }
      }

      if (trigger === "update" && session) {
        token = { ...token, ...session };
      }

      return token;
    },
    session: async ({ session, token }) => {
      if (session.user) {
        // Type-safe assignment
        session.user.id = token.id as string;
        session.user.role = token.role as "PATIENT" | "PHARMACY";

        if (token.role === "PATIENT" && token.patient) {
          session.user.patient = token.patient as Patient;
        }
        if (token.role === "PHARMACY" && token.pharmacy) {
          session.user.pharmacy = token.pharmacy as Pharmacy;
        }
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/login",
  },
});
