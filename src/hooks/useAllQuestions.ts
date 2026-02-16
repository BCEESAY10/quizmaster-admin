import { useQuery } from "@tanstack/react-query";
import { questionsAPI } from "../lib/api";
import { SearchQuestionsResponse, Question } from "../types";

interface UseAllQuestionsOptions {
  page?: number;
  limit?: number;
}

export function useAllQuestions({
  page = 1,
  limit = 10,
}: UseAllQuestionsOptions = {}) {
  return useQuery({
    queryKey: ["questions", "all", page, limit],
    queryFn: async () => {
      const response = await questionsAPI.getAll();

      // Handle grouped response format (e.g., { "Science": [...], "Math": [...] })
      let allQuestions: Question[] = [];

      if (Array.isArray(response.data)) {
        // If it's already an array, use it
        allQuestions = response.data;
      } else if (response.data && typeof response.data === "object") {
        // If it's an object with category keys, flatten all values
        Object.values(response.data).forEach((value: unknown) => {
          if (Array.isArray(value)) {
            allQuestions.push(...(value as Question[]));
          }
        });
      }

      // Convert flat array to paginated response
      const total = allQuestions.length;
      const totalPages = Math.ceil(total / limit);
      const startIndex = (page - 1) * limit;
      const paginatedData = allQuestions.slice(startIndex, startIndex + limit);

      return {
        data: paginatedData,
        pagination: {
          page,
          limit,
          total,
          totalPages,
        },
      } as SearchQuestionsResponse;
    },
  });
}
