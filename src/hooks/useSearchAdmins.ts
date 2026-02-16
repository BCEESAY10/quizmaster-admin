import { useQuery } from "@tanstack/react-query";
import { adminsAPI } from "../lib/api";
import { SearchAdminsResponse } from "../types";

interface UseSearchAdminsOptions {
  search: string;
  page?: number;
  limit?: number;
  enabled?: boolean;
}

export function useSearchAdmins({
  search,
  page = 1,
  limit = 10,
  enabled = true,
}: UseSearchAdminsOptions) {
  return useQuery({
    queryKey: ["admins", "search", search, page, limit],
    queryFn: async () => {
      const response = await adminsAPI.search(search, page, limit);
      return response.data as SearchAdminsResponse;
    },
    enabled: enabled && search.trim().length > 0,
    staleTime: 1000 * 60, // 1 minute
  });
}
