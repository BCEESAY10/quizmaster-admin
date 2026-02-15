"use client";

import { useState, useCallback } from "react";
import { Search, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { useDebounceSearch } from "@/src/hooks/useDebounceSearch";
import { useSearchUsers } from "@/src/hooks/useSearchUsers";
import { useAllUsers } from "@/src/hooks/useAllUsers";
import { useDeleteUser } from "@/src/hooks/useUsers";
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
  const deleteUser = useDeleteUser();
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [limit] = useState(10);

  // Use debounce search for the search input
  const searchFn = useCallback(async (query: string) => {
    // This function is just for debouncing - actual search happens in useSearchUsers
    return query;
  }, []);

  const { query: searchQuery, setQuery: setSearchQuery } =
    useDebounceSearch<string>({
      searchFn,
      delay: 500,
      minQueryLength: 0,
    });

  // Load all users if no search, or search results if searching
  const { data: allUsersData, isLoading: allUsersLoading } = useAllUsers({
    page: currentPage,
    limit,
  });

  const { data: searchResults, isLoading: searchLoading } = useSearchUsers({
    search: searchQuery,
    page: currentPage,
    limit,
    enabled: searchQuery.length > 0,
  });

  // Use search results if searching, otherwise use all users
  const isSearching = searchQuery.length > 0;
  const data = isSearching ? searchResults : allUsersData;
  const isLoading = isSearching ? searchLoading : allUsersLoading;

  const users = data?.data ?? [];
  const pagination = data?.pagination;

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
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1); // Reset to first page on new search
              }}
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
          data={users}
          columns={columns}
          isLoading={isLoading}
          onRowClick={(user) => router.push(`/users/${user.id}`)}
          emptyMessage={
            isSearching
              ? "No users found matching your search"
              : "No users available"
          }
        />
      </Card>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Page {pagination.page} of {pagination.totalPages} (Total:{" "}
            {pagination.total} users)
          </div>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1 || isLoading}
              leftIcon={<ChevronLeft className="h-4 w-4" />}>
              Previous
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() =>
                setCurrentPage(Math.min(pagination.totalPages, currentPage + 1))
              }
              disabled={currentPage === pagination.totalPages || isLoading}
              rightIcon={<ChevronRight className="h-4 w-4" />}>
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {users.length === 0 && !isLoading && isSearching && (
        <Card className="text-center py-12">
          <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Results</h3>
          <p className="text-gray-500">Try adjusting your search criteria</p>
        </Card>
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
