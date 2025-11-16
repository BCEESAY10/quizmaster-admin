import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { Admin } from "@/src/types";
import { mockAdmins } from "../mocks/admins";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        // Find admin by email
        const admin = mockAdmins.find((a) => a.email === credentials.email);

        if (!admin) {
          throw new Error("Invalid credentials");
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(
          credentials.password as string,
          admin.password as string
        );

        if (!isValidPassword) {
          throw new Error("Invalid credentials");
        }

        // Return user object (without password) and ensure role is a string
        return {
          id: admin.id!,
          email: admin.email,
          fullName: admin.fullName,
          role: admin.role ?? "admin",
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as Admin).role;
        token.fullName = (user as Admin).fullName;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.fullName = token.fullName as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    signOut: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// Helper function to get session on server
export async function getServerAuthSession() {
  const { getServerSession } = await import("next-auth");
  return getServerSession(authOptions);
}

// Helper to check if user is super admin
export async function requireSuperAdmin() {
  const session = await getServerAuthSession();
  if (!session || (session.user as Admin).role !== "super_admin") {
    throw new Error("Unauthorized: Super admin access required");
  }
  return session;
}

// Helper to check if user is authenticated
export async function requireAuth() {
  const session = await getServerAuthSession();
  if (!session) {
    throw new Error("Unauthorized: Authentication required");
  }
  return session;
}
