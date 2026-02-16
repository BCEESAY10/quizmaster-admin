"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { formatDate } from "@/src/utils/formatters";
import { useDeleteAdmin, useAdmins } from "@/src/hooks/useAdmins";
import { useSearchAdmins } from "@/src/hooks/useSearchAdmins";
import { useAllAdmins } from "@/src/hooks/useAllAdmins";
import { LoadingSpinner } from "@/src/components/ui/LoadingSpinner";
import { Button } from "@/src/components/ui/Button";
import { Input } from "@/src/components/ui/Input";
import ConfirmDialog from "@/src/components/ui/ConfirmDialogue";
import { Admin } from "@/src/types";

export default function AdminsTable() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [limit] = useState(10);
  const deleteAdmin = useDeleteAdmin();

  // Debounce search input
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSearchQuery(searchInput);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchInput]);

  // Load all admins initially
  const { data: allAdminsData, isLoading: allAdminsLoading } = useAllAdmins({
    page: currentPage,
    limit,
  });

  // Search admins
  const { data: searchResults, isLoading: searchLoading } = useSearchAdmins({
    search: searchQuery,
    page: currentPage,
    limit,
    enabled: searchQuery.length > 0,
  });

  // Use search results if searching, otherwise use all admins
  const isSearching = searchQuery.length > 0;
  const data = isSearching ? searchResults : allAdminsData;
  const isLoading = isSearching ? searchLoading : allAdminsLoading;

  const admins = data?.data ?? [];
  const pagination = data?.pagination;

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>, id: string) => {
    e.stopPropagation();
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (deleteId) {
      deleteAdmin.mutate(deleteId, {
        onSuccess: () => {
          setDeleteId(null);
        },
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search Bar - Always visible */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <Input
          placeholder="Search by name or email..."
          value={searchInput}
          onChange={(e) => {
            setSearchInput(e.target.value);
            setCurrentPage(1);
          }}
          leftIcon={<Search className="h-5 w-5 text-gray-400" />}
        />
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex items-center justify-center h-96">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Admin
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {admins.map((admin: Admin) => (
                  <tr
                    key={admin.id}
                    onClick={() => router.push(`/admins/${admin.id}`)}
                    className="hover:bg-gray-50 cursor-pointer transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 shrink-0">
                          <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                            <span className="text-primary-600 font-medium text-sm">
                              {admin.fullName
                                .split(" ")
                                .map((n: string) => n[0])
                                .join("")
                                .toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {admin.fullName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {admin.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          admin.role === "super_admin"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-blue-100 text-blue-800"
                        }`}>
                        {admin.role === "super_admin" ? "Super Admin" : "Admin"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {admin.createdAt ? formatDate(admin.createdAt) : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={(e) => handleDelete(e, admin.id)}
                        className="text-red-600 hover:text-red-900">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {admins.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No admins found</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Page {pagination.page} of {pagination.totalPages} (Total:{" "}
            {pagination.total} admins)
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

      {/* Stats footer */}
      {pagination && (
        <div className="flex items-center justify-between text-sm text-gray-500">
          <p>
            Showing {admins.length} of {pagination.total} admins
          </p>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
        title="Delete Admin"
        description="Are you sure you want to delete this admin? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={deleteAdmin.isPending}
      />
    </div>
  );
}
