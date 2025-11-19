"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Form } from "@/src/components/forms/Form";
import { FormInput } from "@/src/components/forms/FormInput";
import { FormSelect } from "@/src/components/forms/FormSelect";
import { createAdminSchema, CreateAdminInput } from "@/src/lib/validations";

export default function CreateAdminForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (data: CreateAdminInput) => {
    setIsLoading(true);
    setError(null);

    try {
      // TODO: Replace with actual API call
      const response = await fetch("/api/admins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message ?? "Failed to create admin");
      }

      // Simulate success
      await new Promise((resolve) => setTimeout(resolve, 1000));

      router.push("/admins");
      router.refresh();
    } catch (err) {
      setError("Failed to create admin. Please try again.");
      console.error("Create admin failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <Form
        schema={createAdminSchema}
        onSubmit={onSubmit}
        isLoading={isLoading}
        submitButton={{
          text: "Create Admin",
          loadingText: "Creating...",
          className: "w-full",
        }}>
        {({ register, formState: { errors } }) => (
          <div className="space-y-6">
            <FormInput
              label="Full Name"
              name="name"
              register={register}
              error={errors.name}
              placeholder="John Doe"
              required
            />

            <FormInput
              label="Email Address"
              name="email"
              type="email"
              register={register}
              error={errors.email}
              placeholder="johndoe@quizmaster.com"
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

            <FormInput
              label="Password"
              name="password"
              type="password"
              register={register}
              error={errors.password}
              placeholder="Minimum 8 characters"
              required
            />

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

      <div className="mt-4">
        <button
          onClick={() => router.back()}
          className="text-gray-600 hover:text-gray-900 text-sm font-medium">
          ← Cancel and go back
        </button>
      </div>
    </>
  );
}
