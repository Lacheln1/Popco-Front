import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchSearchContents } from "@/apis/searchApi";
import { SearchContentsParams, SearchResponse } from "@/types/Search.types";

export const useSearchContents = ({
  keyword,
  actors,
  size,
}: SearchContentsParams) => {
  return useInfiniteQuery<SearchResponse, Error>({
    queryKey: ["searchContents", keyword, actors],
    queryFn: ({ pageParam = 0 }) =>
      fetchSearchContents({
        keyword,
        actors,
        page: pageParam as number,
        size,
      }),
    getNextPageParam: (lastPage) =>
      lastPage.last ? undefined : lastPage.number + 1,
    initialPageParam: 0,
    enabled: !!(
      (keyword && keyword.trim().length > 0) ||
      (actors && actors.some((a) => a.trim().length > 0))
    ),
  });
};
