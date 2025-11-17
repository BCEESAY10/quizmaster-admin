import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { mockAdmins } from "../mocks/admins";
import { adminsAPI } from "../lib/api";
import { Admin } from "../types";

const USE_MOCK = true;

export function useAdmins() {
  return useQuery({
    queryKey: ["admins"],
    queryFn: async () => {
      if (USE_MOCK) {
        return Promise.resolve(mockAdmins);
      }
      const response = await adminsAPI.getAll();
      return response.data;
    },
  });
}

export function useAdmin(id: string) {
  return useQuery({
    queryKey: ["admins", id],
    queryFn: async () => {
      if (USE_MOCK) {
        return mockAdmins.find((u) => u.id === id);
      }
      const response = await adminsAPI.getById(id);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useUpdateAdmin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Admin> }) => {
      if (USE_MOCK) {
        return Promise.resolve({ ...mockAdmins[0], ...data });
      }
      const response = await adminsAPI.update(id, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
    },
  });
}

export function useDeleteAdmin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (USE_MOCK) {
        return Promise.resolve({ success: true });
      }
      const response = await adminsAPI.delete(id);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
    },
  });
}
