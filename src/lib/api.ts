import axios from "axios";
import { Admin, Category, Question, User } from "../types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// API Functions (to be implemented with real endpoints)
export const usersAPI = {
  getAll: () => api.get("/users"),
  getById: (id: string) => api.get(`/users/${id}`),
  create: (data: Partial<User>) => api.post("/users", data),
  update: (id: string, data: Partial<User>) => api.put(`/users/${id}`, data),
  delete: (id: string) => api.delete(`/users/${id}`),
};

export const questionsAPI = {
  getAll: () => api.get("/questions"),
  getById: (id: string) => api.get(`/questions/${id}`),
  create: (data: Partial<Question>) => api.post("/questions", data),
  update: (id: string, data: Partial<Question>) =>
    api.put(`/questions/${id}`, data),
  delete: (id: string) => api.delete(`/questions/${id}`),
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
  getById: (id: string) => api.get(`/admin/${id}`),
  create: (data: Partial<Admin>) => api.post("/admin", data),
  update: (id: string, data: Partial<Admin>) => api.put(`/admin/${id}`, data),
  delete: (id: string) => api.delete(`/admin/${id}`),
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
