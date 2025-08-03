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
    staleTime: 0, // 항상 stale 처리
    refetchOnMount: true, // 컴포넌트가 다시 마운트될 때 refetch
    refetchOnWindowFocus: false,
    retry: 1,
  });
};
