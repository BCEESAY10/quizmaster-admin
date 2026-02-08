import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { reviewsAPI } from "@/src/lib/api";
import { ReviewsResponse } from "@/src/types";

export function useReviews(params?: {
  page?: number;
  limit?: number;
  rating?: number;
  dateFilter?: string;
}) {
  return useQuery({
    queryKey: ["reviews", params],
    queryFn: async (): Promise<ReviewsResponse> => {
      const response = await reviewsAPI.getAll(params);
      return response.data;
    },
  });
}

export function useDeleteReview() {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean }, Error, string>({
    mutationFn: async (id: string) => {
      const response = await reviewsAPI.delete(id);
      return { success: response.status === 200 };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
  });
}
