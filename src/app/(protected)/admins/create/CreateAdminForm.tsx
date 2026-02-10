"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Form } from "@/src/components/forms/Form";
import { FormInput } from "@/src/components/forms/FormInput";
import { createAdminSchema, CreateAdminInput } from "@/src/lib/validations";
import { useCreateAdmin } from "@/src/hooks/useAdmins";

export default function CreateAdminForm() {
  const router = useRouter();
  const createAdminMutation = useCreateAdmin();

  const onSubmit = (data: CreateAdminInput) => {
    createAdminMutation.mutate(data, {
      onSuccess: () => {
        router.push("/admins");
        router.refresh();
      },
    });
  };

  return (
    <>
      {createAdminMutation.error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {createAdminMutation.error.message || "Failed to create admin"}
        </div>
      )}

      <Form
        schema={createAdminSchema}
        onSubmit={onSubmit}
        isLoading={createAdminMutation.isPending}
        submitButton={{
          text: "Create Admin",
          loadingText: "Creating...",
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
              placeholder="johndoe@quizmaster.com"
              required
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
              <h3 className="text-sm font-medium text-blue-900 mb-2">Note:</h3>
              <p className="text-sm text-blue-800">
                The admin role will be assigned by the administrator based on
                your organizational needs.
              </p>
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
