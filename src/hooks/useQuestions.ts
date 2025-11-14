import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MOCK_QUESTIONS } from "../mocks/questions";
import { questionsAPI } from "../lib/api";
import { Question } from "../types";

const USE_MOCK = true;

export function useQuestions() {
  return useQuery({
    queryKey: ["questions"],
    queryFn: async () => {
      if (USE_MOCK) {
        return Promise.resolve(MOCK_QUESTIONS);
      }
      const response = await questionsAPI.getAll();
      return response.data;
    },
  });
}

export function useQuestion(id: string) {
  return useQuery({
    queryKey: ["questions", id],
    queryFn: async () => {
      if (USE_MOCK) {
        const allowedQuestions = Object.values(MOCK_QUESTIONS).flat();
        return allowedQuestions.find((q) => q.id === Number(id));
      }
      const response = await questionsAPI.getById(id);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useCreateQuestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<Question>) => {
      if (USE_MOCK) {
        return Promise.resolve({ id: Date.now().toString(), ...data });
      }
      const response = await questionsAPI.create(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions"] });
    },
  });
}

export function useUpdateQuestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<Question>;
    }) => {
      if (USE_MOCK) {
        return Promise.resolve({ ...MOCK_QUESTIONS[0], ...data });
      }
      const response = await questionsAPI.update(id, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions"] });
    },
  });
}

export function useDeleteQuestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (USE_MOCK) {
        return Promise.resolve({ success: true });
      }
      const response = await questionsAPI.delete(id);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions"] });
    },
  });
}
