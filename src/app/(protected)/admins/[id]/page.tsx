"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import AdminDetailsView from "./AdminDetailsView";
import { useAdmin } from "@/src/hooks/useAdmins";
import { LoadingSpinner } from "@/src/components/ui/LoadingSpinner";
import { useEffect, useState } from "react";
import { Admin } from "@/src/types";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default function AdminDetailPage({ params }: Props) {
  const router = useRouter();
  const { data: session } = useSession();
  const [id, setId] = useState<string>("");
  const { data: admin, isLoading, error } = useAdmin(id);

  useEffect(() => {
    params.then((resolvedParams) => {
      setId(resolvedParams.id);
    });
  }, [params]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !admin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-2">Admin not found</p>
          <p className="text-gray-600 mb-4">
            The admin you&apos;re looking for doesn&apos;t exist or there was an
            error loading the data.
          </p>
          <button
            onClick={() => router.push("/admins")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Back to Admins
          </button>
        </div>
      </div>
    );
  }

  return (
    <AdminDetailsView
      admin={admin}
      currentUserId={(session?.user as Admin)?.id ?? ""}
    />
  );
}
