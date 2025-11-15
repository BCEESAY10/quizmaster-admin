import { getServerAuthSession } from "@/src/lib/auth";
import { redirect } from "next/navigation";
import LoginForm from "./LoginForm";

export default async function LoginPage() {
  const session = await getServerAuthSession();

  // If already logged in, redirect to dashboard
  if (session) {
    redirect("/");
  }

  return <LoginForm />;
}
