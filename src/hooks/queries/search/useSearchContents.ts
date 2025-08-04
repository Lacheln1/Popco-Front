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
    getNextPageParam: (lastPage) => {
      // lastPage가 undefined이거나 null인 경우 처리
      if (!lastPage) {
        console.warn("lastPage is undefined in getNextPageParam");
        return undefined;
      }
      // last 속성이 없는 경우도 처리
      if (typeof lastPage.last !== "boolean") {
        console.warn("lastPage.last is not a boolean:", lastPage);
        return undefined;
      }
      return lastPage.last ? undefined : lastPage.number + 1;
    },
    initialPageParam: 0,
    enabled: !!(
      (keyword && keyword.trim().length > 0) ||
      (actors && actors.some((a) => a.trim().length > 0))
    ),
    // 에러 발생 시 재시도 설정
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};
