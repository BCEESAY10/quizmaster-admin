import axios from "axios";
import { Admin, Category, Question, User } from "../types";

// Use Next.js API proxy route instead of direct backend URL
// This allows us to attach the NextAuth JWT token server-side
const API_BASE_URL = "/api/proxy";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// No need for token in interceptor - the proxy route handles it server-side
api.interceptors.request.use((config) => {
  return config;
});

// API Functions (to be implemented with real endpoints)
export const usersAPI = {
  getAll: () => api.get("/users"),
  getById: (id: string) => api.get(`/users/${id}`),
  create: (data: Partial<User>) => api.post("/users", data),
  update: (id: string, data: Partial<User>) => api.put(`/users/${id}`, data),
  delete: (id: string) => api.delete(`/users/${id}`),
  search: (search: string, page: number = 1, limit: number = 10) =>
    api.get("/users", { params: { search, page, limit } }),
};

export const questionsAPI = {
  getAll: () => api.get("/questions"),
  getById: (id: string) => api.get(`/questions/${id}`),
  create: (data: Partial<Question>) => api.post("/questions", data),
  update: (id: string, data: Partial<Question>) =>
    api.put(`/questions/${id}`, data),
  delete: (id: string) => api.delete(`/questions/${id}`),
  search: (params?: {
    search?: string;
    category?: string;
    author?: string;
    timer?: number;
    page?: number;
    limit?: number;
  }) => api.get("/questions", { params }),
};

export const categoriesAPI = {
  getAll: () => api.get("/categories"),
  create: (data: Partial<Category>) => api.post("/categories", data),
  update: (id: string, data: Partial<Category>) =>
    api.put(`/categories/${id}`, data),
  delete: (id: string) => api.delete(`/categories/${id}`),
};

export const adminsAPI = {
  getAll: () => api.get("/admins"),
  getById: (id: string) => api.get(`/admins/${id}`),
  create: (data: Partial<Admin>) => api.post("/admins", data),
  update: (id: string, data: Partial<Admin>) => api.put(`/admins/${id}`, data),
  delete: (id: string) => api.delete(`/admins/${id}`),
  search: (search: string, page: number = 1, limit: number = 10) =>
    api.get("/admins", { params: { search, page, limit } }),
  bootstrap: (
    adminSetupKey: string,
    data: { fullname: string; email: string; password: string },
  ) =>
    api.post("/admin/bootstrap", data, {
      headers: { "x-admin-setup-key": adminSetupKey },
    }),
};

export const analyticsAPI = {
  getDashboard: () => api.get("/analytics/dashboard"),
};

export const reviewsAPI = {
  getAll: (params?: {
    page?: number;
    limit?: number;
    rating?: number;
    dateFilter?: string;
  }) => api.get("/reviews", { params }),
  getById: (id: string) => api.get(`/reviews/${id}`),
  delete: (id: string) => api.delete(`/reviews/${id}`),
};

export const searchAPI = {
  search: (query: string) => api.post("/search", { query }),
};
