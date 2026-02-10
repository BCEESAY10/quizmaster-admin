"use client";

import { useRouter } from "next/navigation";
import UserDetailsPageView from "./UsersDetailsView";
import { useUser } from "@/src/hooks/useUsers";
import { LoadingSpinner } from "@/src/components/ui/LoadingSpinner";
import { useEffect, useState } from "react";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default function UserDetailPage({ params }: Props) {
  const router = useRouter();
  const [id, setId] = useState<string>("");
  const { data: user, isLoading, error } = useUser(id);

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

  if (error || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-2">User not found</p>
          <p className="text-gray-600 mb-4">
            The user you&apos;re looking for doesn&apos;t exist or there was an
            error loading the data.
          </p>
          <button
            onClick={() => router.push("/users")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Back to Users
          </button>
        </div>
      </div>
    );
  }

  return <UserDetailsPageView user={user} />;
}
