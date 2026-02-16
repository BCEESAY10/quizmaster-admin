import { useQuery } from "@tanstack/react-query";
import { usersAPI } from "../lib/api";
import { SearchUsersResponse } from "../types";

interface UseAllUsersOptions {
  page?: number;
  limit?: number;
}

export function useAllUsers({ page = 1, limit = 10 }: UseAllUsersOptions = {}) {
  return useQuery({
    queryKey: ["users", "all", page, limit],
    queryFn: async () => {
      // When no search query, pass empty string to get all users
      const response = await usersAPI.search("", page, limit);
      return response.data as SearchUsersResponse;
    },
    staleTime: 1000 * 60,
  });
}
