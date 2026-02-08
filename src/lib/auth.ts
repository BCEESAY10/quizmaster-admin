import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { Admin } from "@/src/types";
import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api/v1";

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

        try {
          // Call backend login endpoint
          const response = await axios.post(`${API_BASE_URL}/auth/login`, {
            email: credentials.email,
            password: credentials.password,
          });

          const admin = response.data?.user || response.data;
          const token = response.data?.token || response.data?.accessToken;

          // Return user object with token
          return {
            id: admin.id,
            email: admin.email,
            fullName: admin.fullName,
            role: admin.role ?? "admin",
            accessToken: token,
          };
        } catch (error: any) {
          const message =
            error.response?.data?.message || "Invalid credentials";
          throw new Error(message);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.fullName = (user as any).fullName;
        token.accessToken = (user as any).accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.fullName = token.fullName as string;
      }
      // Attach accessToken to session for server-side access
      (session as any).accessToken = token.accessToken;
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
