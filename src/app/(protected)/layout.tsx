import { getServerAuthSession } from "@/src/lib/auth";
import { redirect } from "next/navigation";
import { MainLayout } from "@/src/components/layout/MainLayout";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerAuthSession();

  if (!session) {
    redirect("/login");
  }

  return <MainLayout session={session}>{children}</MainLayout>;
}
