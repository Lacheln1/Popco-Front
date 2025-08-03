import { fetchContentsRanking } from "@/apis/contentsApi";
import { ContentCategory, ContentItem } from "@/types/Contents.types";
import { useQuery } from "@tanstack/react-query";

export const useContentsRanking = (
  type: ContentCategory,
  token?: string,
  userId?: number,
) => {
  return useQuery<ContentItem[]>({
    queryKey: ["contentsRanking", type, userId],
    queryFn: () => fetchContentsRanking(type, token),
    enabled: userId === 0 || !!token,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    retry: 1,
  });
};
