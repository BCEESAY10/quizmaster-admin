"use client";

import React from "react";
import { useForm, SubmitHandler, DefaultValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { clsx } from "clsx";

interface FormProps<T extends Record<string, any>> {
  schema: z.ZodAny;
  onSubmit: SubmitHandler<T>;
  defaultValues?: DefaultValues<T>;
  children: (methods: ReturnType<typeof useForm<T>>) => React.ReactNode;
  className?: string;
  submitButton?: {
    text: string;
    loadingText?: string;
    className?: string;
  };
  isLoading?: boolean;
}

export function Form<T extends Record<string, any>>({
  schema,
  onSubmit,
  defaultValues,
  children,
  className,
  submitButton = { text: "Submit", loadingText: "Submitting..." },
  isLoading = false,
}: FormProps<T>) {
  const methods = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  return (
    <form
      onSubmit={methods.handleSubmit(onSubmit)}
      className={clsx("space-y-6", className)}>
      {children(methods)}

      {submitButton && (
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading || methods.formState.isSubmitting}
            className={clsx(
              "px-6 py-2.5 rounded-lg font-medium",
              "focus:outline-none focus:ring-2 focus:ring-offset-2",
              "transition-colors",
              {
                "bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-500":
                  !isLoading && !methods.formState.isSubmitting,
                "bg-gray-300 text-gray-500 cursor-not-allowed":
                  isLoading || methods.formState.isSubmitting,
              },
              submitButton.className
            )}>
            {isLoading || methods.formState.isSubmitting ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                {submitButton.loadingText}
              </span>
            ) : (
              submitButton.text
            )}
          </button>
        </div>
      )}
    </form>
  );
}
