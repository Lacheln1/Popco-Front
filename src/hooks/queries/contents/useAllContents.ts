import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchAllContents } from "@/apis/contentsApi";
import { FetchAllContentsParams } from "@/types/Contents.types";

// FetchAllContentsParams를 그대로 사용하고 enabled만 추가
interface UseAllContentsOptions extends FetchAllContentsParams {
  enabled?: boolean;
}

export const useAllContents = ({
  size,
  sort,
  enabled = true,
  userId,
  accessToken,
}: UseAllContentsOptions) => {
  return useInfiniteQuery({
    queryKey: ["allContents", sort, userId], // userId도 쿼리키에 추가 (로그인 상태별로 캐시 분리)
    queryFn: ({ pageParam = 0 }) =>
      fetchAllContents({
        page: pageParam,
        size,
        sort,
        userId, // userId 전달
        accessToken, // accessToken 전달
      }),
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.last ? undefined : allPages.length;
    },
    initialPageParam: 0,
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 60 * 2,
    retry: 1,
    enabled,
  });
};
