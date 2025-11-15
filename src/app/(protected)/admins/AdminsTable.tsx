"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Admin } from "@/src/types";
import { formatDate } from "@/src/utils/formatters";

interface AdminsTableProps {
  admins: Admin[];
}

export default function AdminsTable({ admins }: AdminsTableProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAdmins = admins.filter(
    (admin) =>
      admin.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Search */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <input
            type="text"
            placeholder="Search admins..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <svg
            className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Table */}
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
            {filteredAdmins.map((admin) => (
              <tr
                key={admin.id}
                onClick={() => router.push(`/admins/${admin.id}`)}
                className="hover:bg-gray-50 cursor-pointer transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                        <span className="text-primary-600 font-medium text-sm">
                          {admin.fullName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {admin.fullName}
                      </div>
                      <div className="text-sm text-gray-500">{admin.email}</div>
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
                  {formatDate(admin.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/admins/${admin.id}/edit`);
                    }}
                    className="text-primary-600 hover:text-primary-900 mr-4">
                    Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (
                        confirm(
                          `Are you sure you want to delete ${admin.fullName}?`
                        )
                      ) {
                        // TODO: Implement delete
                        console.log("Delete admin:", admin.id);
                      }
                    }}
                    className="text-red-600 hover:text-red-900">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredAdmins.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No admins found</p>
          </div>
        )}
      </div>
    </div>
  );
}
