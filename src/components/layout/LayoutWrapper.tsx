import { getServerAuthSession } from "@/src/lib/auth";
import { redirect } from "next/navigation";
import { MainLayout } from "./MainLayout";

interface Props {
  children: React.ReactNode;
  pathname: string;
}

export default async function MainLayoutWrapper({ children, pathname }: Props) {
  const session = await getServerAuthSession();

  if (!session && pathname !== "/login") {
    redirect("/login");
  }

  return <MainLayout session={session}>{children}</MainLayout>;
}
