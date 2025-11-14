"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Form } from "@/src/components/forms/Form";
import { FormInput } from "@/src/components/forms/FormInput";
import { loginSchema, LoginInput } from "@/src/lib/validations";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: LoginInput) => {
    setError(null);
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
        return;
      }

      router.push("/");
      router.refresh();
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-primary-500 mb-2">
            🧠 QuizMaster
          </h1>
          <h2 className="text-2xl font-semibold text-gray-900">Admin Panel</h2>
          <p className="text-gray-500 mt-2">
            Sign in to manage your application
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-lg shadow-md p-8">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <Form
            schema={loginSchema}
            onSubmit={onSubmit}
            isLoading={isLoading}
            submitButton={{
              text: "Sign In",
              loadingText: "Signing in...",
              className: "w-full",
            }}>
            {({ register, formState: { errors } }) => (
              <>
                <FormInput
                  label="Email Address"
                  name="email"
                  type="email"
                  register={register}
                  error={errors.email}
                  placeholder="admin@quizmaster.com"
                  required
                />

                <FormInput
                  label="Password"
                  name="password"
                  type="password"
                  register={register}
                  error={errors.password}
                  placeholder="Enter your password"
                  required
                />
              </>
            )}
          </Form>

          {/* Demo credentials */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800 font-medium mb-2">
              Demo Credentials:
            </p>
            <div className="text-sm text-blue-700 space-y-1">
              <p>
                <strong>Super Admin:</strong> superadmin@quizmaster.com
              </p>
              <p>
                <strong>Admin:</strong> admin@quizmaster.com
              </p>
              <p>
                <strong>Password:</strong> password
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
