import { useInfiniteQuery } from "@tanstack/react-query";
import { SearchContentsParams } from "@/types/Search.types";
import { fetchSearchContents } from "@/apis/searchApi";

export const useSearchContents = ({
  keyword,
  actors,
  size,
}: Omit<SearchContentsParams, "pageNumber">) => {
  return useInfiniteQuery({
    queryKey: ["searchContents", keyword, actors],
    queryFn: ({ pageParam = 0 }) =>
      fetchSearchContents({
        keyword,
        actors,
        page: pageParam,
        size,
      }),
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.last ? undefined : allPages.length;
    },
    initialPageParam: 0,
    enabled: !!(keyword?.trim() || (actors?.length ?? 0) > 0),
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 60 * 2,
    retry: 1,
  });
};
