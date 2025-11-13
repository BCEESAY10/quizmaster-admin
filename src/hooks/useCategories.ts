import { useQuery } from "@tanstack/react-query";
import { categories } from "../mocks/categories";
import { categoriesAPI } from "../lib/api";

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
