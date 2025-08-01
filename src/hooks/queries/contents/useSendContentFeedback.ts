import { useMutation } from "@tanstack/react-query";
import { fetchLikedFeedback } from "@/apis/recommendApi";

interface ContentFeedbackParams {
  user_id: number;
  content_id: number;
  content_type: string;
  reaction_type: string;
  score?: number | null;
  token?: string;
}

export const useSendContentFeedback = () => {
  return useMutation({
    mutationFn: ({
      user_id,
      content_id,
      content_type,
      reaction_type,
      score,
      token,
    }: ContentFeedbackParams) =>
      fetchLikedFeedback(
        user_id,
        content_id,
        content_type,
        reaction_type,
        score,
        token,
      ),
  });
};
