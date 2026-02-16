import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminsAPI } from "../lib/api";
import { Admin } from "../types";

export function useAdmins() {
  return useQuery({
    queryKey: ["admins"],
    queryFn: async () => {
      const response = await adminsAPI.getAll();
      // Extract the data array from the response
      return response.data.data ?? response.data;
    },
  });
}

export function useAdmin(id: string) {
  return useQuery({
    queryKey: ["admins", id],
    queryFn: async () => {
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
      const response = await adminsAPI.update(id, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
    },
  });
}

export function useCreateAdmin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<Admin>) => {
      const response = await adminsAPI.create(data);
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
      const response = await adminsAPI.delete(id);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
    },
  });
}
