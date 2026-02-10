import { getServerAuthSession } from "@/src/lib/auth";
import { redirect } from "next/navigation";
import { isSuperAdmin } from "@/src/lib/permissions";
import EditAdminForm from "./EditAdminForm";
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

  // Fetch admin from backend API
  let admin: Admin | null = null;
  try {
    const backendUrl =
      process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api/v1";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const token = (session as any)?.accessToken;

    const response = await fetch(`${backendUrl}/admins/${id}`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error(
        "Failed to fetch admin:",
        response.status,
        response.statusText,
      );
      redirect("/admins");
    }

    const data = await response.json();
    admin = data.data ?? data;
  } catch (error) {
    console.error("Failed to fetch admin:", error);
    redirect("/admins");
  }

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
