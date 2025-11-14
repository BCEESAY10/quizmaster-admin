"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Form } from "@/src/components/forms/Form";
import { FormInput } from "@/src/components/forms/FormInput";
import { FormSelect } from "@/src/components/forms/FormSelect";
import { adminSchema, AdminInput } from "@/src/lib/validations";

export default function CreateAdminPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: AdminInput) => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/admins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create admin");
      }

      router.push("/admins");
      router.refresh();
    } catch (error) {
      alert("Failed to create admin. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Create Admin</h1>

      <div className="bg-white rounded-lg shadow-md p-6">
        <Form
          schema={adminSchema}
          onSubmit={onSubmit}
          isLoading={isLoading}
          submitButton={{
            text: "Create Admin",
            loadingText: "Creating...",
          }}>
          {({ register, formState: { errors } }) => (
            <>
              <FormInput
                label="Name"
                name="name"
                register={register}
                error={errors.name}
                placeholder="Enter admin name"
                required
              />

              <FormInput
                label="Email"
                name="email"
                type="email"
                register={register}
                error={errors.email}
                placeholder="admin@example.com"
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
            </>
          )}
        </Form>
      </div>
    </div>
  );
}
