import { useQuery } from "@tanstack/react-query";
import { usersAPI } from "../lib/api";
import { SearchUsersResponse } from "../types";

interface UseSearchUsersOptions {
  search: string;
  page?: number;
  limit?: number;
  enabled?: boolean;
}

export function useSearchUsers({
  search,
  page = 1,
  limit = 10,
  enabled = true,
}: UseSearchUsersOptions) {
  return useQuery({
    queryKey: ["users", "search", search, page, limit],
    queryFn: async () => {
      const response = await usersAPI.search(search, page, limit);
      return response.data as SearchUsersResponse;
    },
    enabled: enabled && search.trim().length > 0,
    staleTime: 1000 * 60,
  });
}
