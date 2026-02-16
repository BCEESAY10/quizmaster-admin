import { useQuery } from "@tanstack/react-query";
import { adminsAPI } from "../lib/api";
import { SearchAdminsResponse, Admin } from "../types";

interface UseAllAdminsOptions {
  page?: number;
  limit?: number;
}

export function useAllAdmins({ page = 1, limit = 10 }: UseAllAdminsOptions = {}) {
  return useQuery({
    queryKey: ["admins", "all", page, limit],
    queryFn: async () => {
      const response = await adminsAPI.getAll();

      // Handle both response formats
      let allAdmins: Admin[] = [];

      if (Array.isArray(response.data)) {
        // If it's already an array, use it
        allAdmins = response.data;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        // If it's wrapped in a data property, extract it
        allAdmins = response.data.data;
      } else if (response.data && typeof response.data === "object") {
        // If it's an object, try to extract data array
        const dataArray = Object.values(response.data).find(
          (val) => Array.isArray(val)
        ) as Admin[] | undefined;
        if (dataArray) {
          allAdmins = dataArray;
        }
      }

      // Convert to paginated response
      const total = allAdmins.length;
      const totalPages = Math.ceil(total / limit);
      const startIndex = (page - 1) * limit;
      const paginatedData = allAdmins.slice(startIndex, startIndex + limit);

      return {
        data: paginatedData,
        pagination: {
          page,
          limit,
          total,
          totalPages,
        },
      } as SearchAdminsResponse;
    },
  });
}
