import { getServerAuthSession } from "@/src/lib/auth";
import { redirect } from "next/navigation";
import { isSuperAdmin } from "@/src/lib/permissions";
import CreateAdminForm from "./CreateAdminForm";

export default async function CreateAdminPage() {
  const session = await getServerAuthSession();

  if (!isSuperAdmin(session)) {
    redirect("/");
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Create Admin</h1>
        <p className="text-gray-500 mt-1">
          Add a new administrator to the system
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <CreateAdminForm />
      </div>
    </div>
  );
}
