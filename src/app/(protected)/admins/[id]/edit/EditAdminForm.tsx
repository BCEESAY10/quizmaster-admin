"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Form } from "@/src/components/forms/Form";
import { FormInput } from "@/src/components/forms/FormInput";
import { FormSelect } from "@/src/components/forms/FormSelect";
import { editAdminSchema, EditAdminInput } from "@/src/lib/validations";
import { useUpdateAdmin } from "@/src/hooks/useAdmins";
import { Admin } from "@/src/types";

interface EditAdminFormProps {
  admin: Admin;
  currentUserId: string;
}

export default function EditAdminForm({
  admin,
  currentUserId,
}: EditAdminFormProps) {
  const router = useRouter();
  const updateAdminMutation = useUpdateAdmin();
  const isCurrentUser = admin.id === currentUserId;

  const onSubmit = (data: EditAdminInput) => {
    // Check if user is trying to demote themselves
    if (
      isCurrentUser &&
      admin.role === "super_admin" &&
      data.role === "admin"
    ) {
      // Show error through mutation error handling
      updateAdminMutation.mutate(
        { id: admin.id, data: {} },
        {
          onError: () => {
            // Error will be shown in the component
          },
        },
      );
      return;
    }

    // Prepare update data (don't send password if empty)
    const updateData: Partial<Admin> = {
      fullname: data.fullname,
      email: data.email,
      role: data.role,
    };

    if (data.password && data.password.trim() !== "") {
      updateData.password = data.password;
    }

    updateAdminMutation.mutate(
      { id: admin.id, data: updateData },
      {
        onSuccess: () => {
          router.push(`/admins/${admin.id}`);
          router.refresh();
        },
      },
    );
  };

  return (
    <>
      {updateAdminMutation.error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {(() => {
            if (isCurrentUser && admin.role === "super_admin") {
              return "You cannot demote yourself from Super Admin";
            }
            return (
              updateAdminMutation.error.message || "Failed to update admin"
            );
          })()}
        </div>
      )}

      {isCurrentUser && (
        <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start">
            <svg
              className="h-5 w-5 text-yellow-600 mt-0.5 mr-3"
              fill="currentColor"
              viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <div className="text-sm text-yellow-800">
              <p className="font-medium">You are editing your own account</p>
              <p className="mt-1">
                Be careful when changing your role or password
              </p>
            </div>
          </div>
        </div>
      )}

      <Form
        schema={editAdminSchema}
        onSubmit={onSubmit}
        defaultValues={{
          fullname: admin.fullName,
          email: admin.email,
          role: admin.role,
          password: "",
        }}
        isLoading={updateAdminMutation.isPending}
        submitButton={{
          text: "Update Admin",
          loadingText: "Updating...",
          className: "w-full",
        }}>
        {({ register, formState: { errors } }) => (
          <div className="space-y-6">
            <FormInput
              label="Full Name"
              name="fullname"
              register={register}
              error={errors.fullname}
              placeholder="John Doe"
              required
            />

            <FormInput
              label="Email Address"
              name="email"
              type="email"
              register={register}
              error={errors.email}
              placeholder="john.doe@quizmaster.com"
              required
            />

            <FormSelect
              label="Role"
              name="role"
              register={register}
              error={errors.role}
              required
              options={[
                { value: "admin", label: "Admin" },
                { value: "super_admin", label: "Super Admin" },
              ]}
            />

            <div>
              <FormInput
                label="New Password"
                name="password"
                type="password"
                register={register}
                error={errors.password}
                placeholder="Leave blank to keep current password"
              />
              <p className="mt-1 text-sm text-gray-500">
                Only enter a password if you want to change it
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-blue-900 mb-2">
                Role Permissions:
              </h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>
                  • <strong>Admin:</strong> Can manage questions and categories
                </li>
                <li>
                  • <strong>Super Admin:</strong> Full access including admin
                  management
                </li>
              </ul>
            </div>
          </div>
        )}
      </Form>

      <div className="mt-4 flex items-center justify-between">
        <button
          onClick={() => router.push("/admins")}
          className="text-gray-600 hover:text-gray-900 text-sm font-medium">
          ← Cancel and go back
        </button>
        <p className="text-xs text-gray-500">
          Last updated:{" "}
          {admin.updatedAt
            ? new Date(admin.updatedAt).toLocaleDateString()
            : "N/A"}
        </p>
      </div>
    </>
  );
}
