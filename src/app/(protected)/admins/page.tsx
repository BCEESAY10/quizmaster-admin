import { getServerAuthSession } from "@/src/lib/auth";
import { redirect } from "next/navigation";
import { isSuperAdmin } from "@/src/lib/permissions";
import { mockAdmins } from "@/src/mocks/admins";
import AdminsTable from "./AdminsTable";
import Link from "next/link";

export default async function AdminsPage() {
  const session = await getServerAuthSession();

  // Only super admins can access this page
  if (!isSuperAdmin(session)) {
    redirect("/");
  }

  // TODO: Fetch admins from database
  const admins = mockAdmins;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admins</h1>
          <p className="text-gray-500 mt-1">
            Manage admin accounts and permissions
          </p>
        </div>
        <Link
          href="/admins/create"
          className="inline-flex items-center justify-center px-4 py-2.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium">
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add Admin
        </Link>
      </div>

      {/* Admins Table */}
      <AdminsTable admins={admins} />
    </div>
  );
}
