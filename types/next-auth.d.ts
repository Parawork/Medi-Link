// types/next-auth.d.ts
import { DefaultSession, DefaultUser } from "next-auth";
import { Patient, Pharmacy } from "@prisma/client";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user?: {
      id: string;
      role: "PATIENT" | "PHARMACY" | "ADMIN";
      patient?: Patient | null;
      pharmacy?: Pharmacy | null;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
    role: "PATIENT" | "PHARMACY" | "ADMIN";
    patient?: Patient | null;
    pharmacy?: Pharmacy | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "PATIENT" | "PHARMACY" | "ADMIN";
    patient?: Patient | null;
    pharmacy?: Pharmacy | null;
  }
}
