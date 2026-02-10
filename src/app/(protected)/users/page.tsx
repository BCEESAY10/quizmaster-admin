"use client";

import { useState } from "react";
import { Search, Filter } from "lucide-react";
import { useUsers, useDeleteUser } from "@/src/hooks/useUsers";
import { Card } from "@/src/components/ui/Card";
import { Button } from "@/src/components/ui/Button";
import { Input } from "@/src/components/ui/Input";
import { DataTable } from "@/src/components/shared/DataTable";
import { formatDate } from "@/src/utils/formatters";
import { User } from "@/src/types";
import { useRouter } from "next/navigation";
import ConfirmDialog from "@/src/components/ui/ConfirmDialogue";

export default function UsersPage() {
  const router = useRouter();
  const { data: users, isLoading } = useUsers();
  const deleteUser = useDeleteUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filteredUsers = users?.filter(
    (user: User) =>
      user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>, id: string) => {
    e.stopPropagation();
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (deleteId) {
      deleteUser.mutate(deleteId, {
        onSuccess: () => {
          setDeleteId(null);
        },
      });
    }
  };

  const columns = [
    {
      key: "fullName",
      header: "User",
      render: (user: User) => {
        const fullName = user.fullName ?? user.fullname;
        return (
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center mr-3">
              <span className="text-primary-500 font-medium">
                {fullName
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("") || "?"}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                {fullName || "N/A"}
              </p>
              <p className="text-sm text-gray-500">{user.email || "N/A"}</p>
            </div>
          </div>
        );
      },
    },
    {
      key: "stats",
      header: "Quizzes",
      render: (user: User) => (
        <span className="text-sm text-gray-900">{user?.totalQuizzes}</span>
      ),
    },
    {
      key: "points",
      header: "Points",
      render: (user: User) => (
        <span className="text-sm text-gray-900">{user?.totalPoints}</span>
      ),
    },
    {
      key: "joinedAt",
      header: "Joined",
      render: (user: User) => (
        <span className="text-sm text-gray-500">
          {formatDate(user?.joinedAt ?? "")}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (user: User) => (
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/users/${user.id}`);
            }}
            className="text-primary-600 hover:text-primary-900 text-sm">
            View
          </button>
          <button
            onClick={(e) => handleDelete(e, user.id)}
            className="text-red-600 hover:text-red-900 text-sm">
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-500 mt-1">Manage and monitor user accounts</p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="h-5 w-5 text-gray-400" />}
            />
          </div>
          <Button variant="secondary" leftIcon={<Filter className="h-4 w-4" />}>
            Filters
          </Button>
        </div>
      </Card>

      {/* Users table */}
      <Card>
        <DataTable
          data={filteredUsers ?? []}
          columns={columns}
          isLoading={isLoading}
          onRowClick={(user) => router.push(`/users/${user.id}`)}
          emptyMessage="No users found"
        />
      </Card>

      {/* Stats footer */}
      {users && (
        <div className="flex items-center justify-between text-sm text-gray-500">
          <p>
            Showing {filteredUsers?.length} of {users.length} users
          </p>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
        title="Delete User"
        description="Are you sure you want to delete this user? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={deleteUser.isPending}
      />
    </div>
  );
}
