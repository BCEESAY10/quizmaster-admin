import { useQuery } from "@tanstack/react-query";
import { questionsAPI } from "../lib/api";
import {
  SearchQuestionsResponse,
  QuestionSearchFilters,
  Question,
} from "../types";

interface UseSearchQuestionsOptions extends QuestionSearchFilters {
  enabled?: boolean;
}

export function useSearchQuestions({
  search,
  category,
  author,
  timer,
  page = 1,
  limit = 10,
  enabled = true,
}: UseSearchQuestionsOptions) {
  return useQuery({
    queryKey: [
      "questions",
      "search",
      search,
      category,
      author,
      timer,
      page,
      limit,
    ],
    queryFn: async () => {
      const response = await questionsAPI.search({
        search,
        category,
        author,
        timer,
        page,
        limit,
      });

      const responseData = response.data;

      // Handle grouped response format (when category filter returns { "CategoryName": [questions] })
      if (
        responseData &&
        typeof responseData === "object" &&
        !Array.isArray(responseData)
      ) {
        // If the response is grouped by category, flatten it
        const allQuestions: Question[] = [];
        Object.values(responseData).forEach((value: unknown) => {
          if (Array.isArray(value)) {
            allQuestions.push(...(value as Question[]));
          }
        });

        return {
          data: allQuestions,
          pagination: {
            page: 1,
            limit: allQuestions.length,
            total: allQuestions.length,
            totalPages: 1,
          },
        } as SearchQuestionsResponse;
      }

      // Handle standard response format
      return responseData as SearchQuestionsResponse;
    },
    enabled:
      enabled &&
      ((search ?? "").trim().length > 0 ||
        !!category ||
        !!author ||
        timer !== undefined),
    staleTime: 1000 * 60, // 1 minute
  });
}
