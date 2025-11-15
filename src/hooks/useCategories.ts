import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { categories } from "../mocks/categories";
import { categoriesAPI } from "../lib/api";
import { Category } from "../types";

const USE_MOCK = true;

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      if (USE_MOCK) {
        return Promise.resolve(categories);
      }
      const response = await categoriesAPI.getAll();
      return response.data;
    },
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<Category>) => {
      if (USE_MOCK) {
        return Promise.resolve({ id: Date.now().toString(), ...data });
      }
      const response = await categoriesAPI.create(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<Category>;
    }) => {
      if (USE_MOCK) {
        return Promise.resolve({ ...categories[0], ...data });
      }
      const response = await categoriesAPI.update(id, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}
