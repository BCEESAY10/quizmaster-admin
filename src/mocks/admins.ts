import { Admin } from "../types";

export const mockAdmins: Admin[] = [
  {
    id: "1",
    email: "superadmin@quizmaster.com",
    fullName: "Super Admin",
    password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi",
    role: "super_admin" as const,
    createdAt: "2023-04-12T10:15:00Z",
    updatedAt: "2024-02-18T09:20:00Z",
  },
  {
    id: "2",
    email: "admin@quizmaster.com",
    fullName: "Admin User",
    password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi",
    role: "admin" as const,
    createdAt: "2023-04-12T10:15:00Z",
    updatedAt: "2024-02-18T09:20:00Z",
  },
];
