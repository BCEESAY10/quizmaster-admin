"use client";

import React from "react";
import { UseFormRegister, FieldError } from "react-hook-form";
import { clsx } from "clsx";

interface FormTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  name: string;
  register: UseFormRegister<any>;
  error?: FieldError;
  required?: boolean;
}

export function FormTextarea({
  label,
  name,
  register,
  error,
  required = false,
  className,
  ...props
}: FormTextareaProps) {
  return (
    <div className="w-full">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <textarea
        id={name}
        {...register(name)}
        {...props}
        className={clsx(
          "block w-full rounded-lg border px-4 py-2.5",
          "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent",
          "transition-colors resize-none",
          {
            "border-gray-300": !error,
            "border-red-500 focus:ring-red-500": error,
          },
          className
        )}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error.message}</p>}
    </div>
  );
}
