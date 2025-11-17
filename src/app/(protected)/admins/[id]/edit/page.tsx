import { getServerAuthSession } from "@/src/lib/auth";
import { redirect } from "next/navigation";
import { isSuperAdmin } from "@/src/lib/permissions";
import EditAdminForm from "./EditAdminForm";
import { mockAdmins } from "@/src/mocks/admins";
import { Admin } from "@/src/types";

interface Props {
  params: {
    id: string;
  };
}

export default async function EditAdminPage({ params }: Props) {
  const { id } = await params;
  const session = await getServerAuthSession();

  if (!isSuperAdmin(session)) {
    redirect("/");
  }

  // TODO: Fetch admin from database
  const admin = mockAdmins.find((a) => a.id === id);

  if (!admin) {
    redirect("/admins");
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Edit Admin</h1>
        <p className="text-gray-500 mt-1">Update administrator information</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <EditAdminForm
          admin={admin}
          currentUserId={(session?.user as Admin)?.id ?? ""}
        />
      </div>
    </div>
  );
}
