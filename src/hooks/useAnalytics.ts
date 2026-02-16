import { useQuery } from "@tanstack/react-query";
import { analyticsAPI } from "../lib/api";

export function useAnalytics(timeRange: string = "7days") {
  return useQuery({
    queryKey: ["analytics", timeRange],
    queryFn: async () => {
      const response = await analyticsAPI.getDashboard(timeRange);
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
