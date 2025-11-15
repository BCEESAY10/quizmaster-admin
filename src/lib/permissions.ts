import { Session } from "next-auth";
import { Admin } from "../types";

export function isSuperAdmin(session: Session | null): boolean {
  if (!session?.user) return false;
  return (session.user as Admin).role === "super_admin";
}

export function requireSuperAdmin(session: Session | null) {
  if (!isSuperAdmin(session)) {
    throw new Error("Unauthorized: Super admin access required");
  }
}
