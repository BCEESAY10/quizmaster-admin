import { useQuery } from "@tanstack/react-query";
import { mockAnalytics } from "../mocks/analytics";
import { analyticsAPI } from "../lib/api";

const USE_MOCK = true;

export function useAnalytics() {
  return useQuery({
    queryKey: ["analytics", "dashboard"],
    queryFn: async () => {
      if (USE_MOCK) {
        return Promise.resolve(mockAnalytics);
      }
      const response = await analyticsAPI.getDashboard();
      return response.data;
    },
  });
}
