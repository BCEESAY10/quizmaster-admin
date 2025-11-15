import { getServerAuthSession } from "@/src/lib/auth";
import { redirect } from "next/navigation";
import { isSuperAdmin } from "@/src/lib/permissions";
import AdminDetailsView from "./AdminDetailsView";
import { mockAdmins } from "@/src/mocks/admins";

interface Props {
  params: {
    id: string;
  };
}

export default async function AdminDetailPage({ params }: Props) {
  const session = await getServerAuthSession();

  if (!isSuperAdmin(session)) {
    redirect("/");
  }

  // TODO: Fetch admin from database
  const admin = mockAdmins.find((a) => a.id === params.id);

  if (!admin) {
    redirect("/admins");
  }

  return (
    <AdminDetailsView admin={admin} currentUserId={(session.user as any).id} />
  );
}
