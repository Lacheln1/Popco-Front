import { fetchContentsRanking } from "@/apis/contents";
import { ContentCategory, ContentItem } from "@/types/Contents.types";
import { useQuery } from "@tanstack/react-query";

export const useContentsRanking = (type: ContentCategory) => {
  return useQuery<ContentItem[]>({
    queryKey: ["contentsRanking", type],
    queryFn: () => fetchContentsRanking(type),
    staleTime: 1000 * 60 * 10,
    retry: 1,
  });
};
