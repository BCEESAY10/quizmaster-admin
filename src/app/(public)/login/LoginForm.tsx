"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Form } from "@/src/components/forms/Form";
import { FormInput } from "@/src/components/forms/FormInput";
import {
  loginSchema,
  LoginInput,
  bootstrapAdminSchema,
  BootstrapAdminInput,
} from "@/src/lib/validations";
import { adminsAPI } from "@/src/lib/api";

export default function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showBootstrap, setShowBootstrap] = useState(false);
  const [setupKey, setSetupKey] = useState("");
  const [showSetupKey, setShowSetupKey] = useState(false);

  const onLoginSubmit = async (data: LoginInput) => {
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
      console.error("Login failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const onBootstrapSubmit = async (data: BootstrapAdminInput) => {
    setError(null);
    setIsLoading(true);

    if (!setupKey.trim()) {
      setError("Admin setup key is required");
      setIsLoading(false);
      return;
    }

    try {
      await adminsAPI.bootstrap(setupKey, {
        fullname: data.fullName,
        email: data.email,
        password: data.password,
      });

      setError(null);
      setShowBootstrap(false);
      setSetupKey("");
      alert(
        "Super admin created successfully! Please log in with your credentials.",
      );
    } catch (err) {
      const errorMsg =
        err instanceof Error && "response" in err
          ? (err as any).response?.data?.message || err.message
          : "Failed to create super admin. Please check the setup key and try again.";
      setError(errorMsg);
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
            {showBootstrap
              ? "Initial Setup"
              : "Sign in to manage your application"}
          </p>
        </div>

        {/* Forms */}
        <div className="bg-white rounded-lg shadow-md p-8">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {showBootstrap ? (
            // Bootstrap Form
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Admin Setup Key
                </label>
                <div className="relative">
                  <input
                    type={showSetupKey ? "text" : "password"}
                    value={setupKey}
                    onChange={(e) => setSetupKey(e.target.value)}
                    placeholder="Enter the setup key"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowSetupKey(!showSetupKey)}
                    className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                    disabled={isLoading}>
                    {showSetupKey ? "Hide" : "Show"}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  One-time setup only
                </p>
              </div>

              <Form
                schema={bootstrapAdminSchema}
                onSubmit={onBootstrapSubmit}
                isLoading={isLoading}
                submitButton={{
                  text: "Create Super Admin",
                  loadingText: "Setting up...",
                  className: "w-full",
                }}>
                {({ register, formState: { errors } }) => (
                  <>
                    <FormInput
                      label="Full Name"
                      name="fullName"
                      type="text"
                      register={register}
                      error={errors.fullName}
                      placeholder="Super Administrator"
                      required
                    />

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
                      placeholder="Create a strong password"
                      required
                    />
                  </>
                )}
              </Form>

              <button
                onClick={() => {
                  setShowBootstrap(false);
                  setError(null);
                }}
                className="w-full mt-4 text-primary-600 hover:text-primary-700 font-medium text-sm">
                Back to Login
              </button>
            </>
          ) : (
            // Login Form
            <>
              <Form
                schema={loginSchema}
                onSubmit={onLoginSubmit}
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

              {/* Bootstrap Button */}
              <button
                onClick={() => {
                  setShowBootstrap(true);
                  setError(null);
                }}
                className="w-full mt-4 text-primary-600 hover:text-primary-700 font-medium text-sm">
                First Time Setup?
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
