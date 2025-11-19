import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { reviewsAPI } from "@/src/lib/api";
import { mockReviews } from "@/src/mocks/reviews";
import { ReviewsResponse } from "@/src/types";

const USE_MOCK = true;

export function useReviews(params?: {
  page?: number;
  limit?: number;
  rating?: number;
  dateFilter?: string;
}) {
  return useQuery({
    queryKey: ["reviews", params],
    queryFn: async (): Promise<ReviewsResponse> => {
      if (USE_MOCK) {
        // Filter mock data based on params
        let filteredReviews = [...mockReviews];

        // Filter by rating
        if (params?.rating) {
          filteredReviews = filteredReviews.filter(
            (r) => r.rating === params.rating
          );
        }

        // Filter by date
        if (params?.dateFilter) {
          const now = new Date();
          const filterDate = new Date();

          if (params.dateFilter === "today") {
            filterDate.setHours(0, 0, 0, 0);
          } else if (params.dateFilter === "last7days") {
            filterDate.setDate(now.getDate() - 7);
          }

          filteredReviews = filteredReviews.filter(
            (r) => new Date(r.createdAt) >= filterDate
          );
        }

        // Pagination
        const page = params?.page ?? 1;
        const limit = params?.limit ?? 9;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedReviews = filteredReviews.slice(startIndex, endIndex);

        return Promise.resolve({
          reviews: paginatedReviews,
          total: filteredReviews.length,
          page,
          totalPages: Math.ceil(filteredReviews.length / limit),
        });
      }

      const response = await reviewsAPI.getAll(params);
      return response.data;
    },
  });
}

export function useDeleteReview() {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean }, Error, string>({
    mutationFn: async (id: string) => {
      if (USE_MOCK) {
        return { success: true };
      }
      const response = await reviewsAPI.delete(id);
      return { success: response.status === 200 };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
  });
}
