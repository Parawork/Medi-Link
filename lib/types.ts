// lib/types.ts
import { Patient, Pharmacy } from "@prisma/client";

export type SessionUser = {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role: "PATIENT" | "PHARMACY";
  patient?: Patient | null;
  pharmacy?: Pharmacy | null;
};
