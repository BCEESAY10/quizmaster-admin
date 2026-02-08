import { useQuery } from "@tanstack/react-query";
import { analyticsAPI } from "../lib/api";

export function useAnalytics() {
  return useQuery({
    queryKey: ["analytics", "dashboard"],
    queryFn: async () => {
      const response = await analyticsAPI.getDashboard();
      return response.data;
    },
  });
}
