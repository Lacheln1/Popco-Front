import { fetchQuizInfo } from "@/apis/quizApi";
import { QuizDetail } from "@/types/Quiz.types";
import { useQuery } from "@tanstack/react-query";

interface QuizInfoResponse {
  quizDetail: QuizDetail;
  quizPageAccess: boolean;
}

export const useQuizInfo = (token: string | null | undefined) => {
  return useQuery<QuizInfoResponse>({
    queryKey: ["quizInfo"],
    queryFn: () => fetchQuizInfo(token!),
    staleTime: 1000 * 60 * 30,
    retry: 1,
    enabled: !!token,
  });
};
