import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usersAPI } from "../lib/api";
import { mockUsers } from "../mocks/users";
import { User } from "../types";

const USE_MOCK = true;

export function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      if (USE_MOCK) {
        return Promise.resolve(mockUsers);
      }
      const response = await usersAPI.getAll();
      return response.data;
    },
  });
}

export function useUser(id: string) {
  return useQuery({
    queryKey: ["users", id],
    queryFn: async () => {
      if (USE_MOCK) {
        return mockUsers.find((u) => u.id === id);
      }
      const response = await usersAPI.getById(id);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<User> }) => {
      if (USE_MOCK) {
        return Promise.resolve({ ...mockUsers[0], ...data });
      }
      const response = await usersAPI.update(id, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (USE_MOCK) {
        return Promise.resolve({ success: true });
      }
      const response = await usersAPI.delete(id);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}
