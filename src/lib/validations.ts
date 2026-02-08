import { z } from "zod";

// Login validation
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginInput = z.infer<typeof loginSchema>;

// Admin validation
export const adminSchema = z.object({
  email: z.string().email("Invalid email address"),
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  role: z
    .enum(["super_admin", "admin"])
    .refine((val) => ["super_admin", "admin"].includes(val), {
      message: "Please select a valid role",
    }),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .optional(),
});

export type AdminInput = z.infer<typeof adminSchema>;

// Create Admin validation (password required)
export const createAdminSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),

  role: z
    .enum(["super_admin", "admin"])
    .refine((val) => ["super_admin", "admin"].includes(val), {
      message: "Please select a valid role",
    }),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type CreateAdminInput = z.infer<typeof createAdminSchema>;

// Bootstrap Admin validation (for initial setup - no role needed)
export const bootstrapAdminSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type BootstrapAdminInput = z.infer<typeof bootstrapAdminSchema>;

// Edit Admin validation (password optional)
export const editAdminSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  role: z
    .enum(["super_admin", "admin"])
    .refine((val) => ["super_admin", "admin"].includes(val), {
      message: "Please select a valid role",
    }),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .optional()
    .or(z.literal("")),
});

export type EditAdminInput = z.infer<typeof editAdminSchema>;

// Category validation
export const categorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50),
  icon: z.string().min(1, "Icon is required"),
  color: z.string().regex(/^#([0-9A-F]{3}){1,2}$/i, "Invalid color format"),
});

export type CategoryInput = z.infer<typeof categorySchema>;

// Question validation
export const questionSchema = z.object({
  question: z.string().min(10, "Question must be at least 10 characters"),
  options: z.array(z.string().min(1, "Option cannot be empty")).min(2).max(6),
  correctAnswer: z.number().min(0),
  category: z.string().min(1, "Category is required"),
  timer: z.number().min(10).max(20),
  point: z.number().min(1).max(5),
});

export type QuestionInput = z.infer<typeof questionSchema>;
