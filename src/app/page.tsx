import { redirect } from "next/navigation";
import { getServerAuthSession } from "@/src/lib/auth";

export default async function RootPage() {
  const session = await getServerAuthSession();

  // If authenticated, go to dashboard
  if (session) {
    redirect("/dashboard");
  }

  // If not authenticated, go to login
  redirect("/login");
}
