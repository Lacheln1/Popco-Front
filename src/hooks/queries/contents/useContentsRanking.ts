import { fetchContentsRanking } from "@/apis/contentsApi";
import { ContentCategory, ContentItem } from "@/types/Contents.types";
import { useQuery } from "@tanstack/react-query";

export const useContentsRanking = (type: ContentCategory, token?: string) => {
  return useQuery<ContentItem[]>({
    queryKey: ["contentsRanking", type],
    queryFn: () => fetchContentsRanking(type, token),
    staleTime: 1000 * 60 * 60 * 12,
    gcTime: 1000 * 60 * 60 * 13,
    retry: 1,
  });
};
