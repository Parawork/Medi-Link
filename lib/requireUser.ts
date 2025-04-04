// lib/auth.ts
import type { SessionUser } from "@/lib/types";
import { auth } from "./auth";

export async function getCurrentUser(): Promise<SessionUser | null> {
  const session = await auth();
  return session?.user as SessionUser | null;
}

export async function requireUser(requiredRole?: SessionUser["role"]) {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Unauthorized - Please log in");
  }

  if (requiredRole && user.role !== requiredRole) {
    throw new Error(`Forbidden - Requires ${requiredRole} role`);
  }

  return user;
}
