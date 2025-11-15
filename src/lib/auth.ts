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
      async authorize(credentials) {
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
          credentials.password,
          admin.password
        );

        if (!isValidPassword) {
          throw new Error("Invalid credentials");
        }

        // Return user object (without password)
        return {
          id: admin.id,
          email: admin.email,
          fullName: admin.fullName,
          role: admin.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as Admin).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
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
