import { fetchBasedContent } from "@/apis/recommendApi";
import { ContentCategory } from "@/types/Contents.types";
import { ContentBasedItem } from "@/types/Recommend.types";
import { useQuery } from "@tanstack/react-query";

export const useStoryBasedRecommendations = (
  userId: number | null,
  type: ContentCategory,
  token?: string,
) => {
  return useQuery<ContentBasedItem[]>({
    queryKey: ["storyBasedRecommendations", userId, type],
    queryFn: () => fetchBasedContent(userId, type, token),
    staleTime: 1000 * 60 * 60 * 12,
    gcTime: 1000 * 60 * 60 * 13,
    retry: 1,
  });
};
