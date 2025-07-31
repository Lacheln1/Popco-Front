import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchAllContents } from "@/apis/contentsApi";
import { FetchAllContentsParams } from "@/types/Contents.types";

export const useAllContents = ({
  pageSize,
  sort,
}: Omit<FetchAllContentsParams, "pageNumber">) => {
  return useInfiniteQuery({
    queryKey: ["allContents", sort],
    queryFn: ({ pageParam = 0 }) =>
      fetchAllContents({
        pageNumber: pageParam,
        pageSize,
        sort,
      }),
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.last ? undefined : allPages.length;
    },
    initialPageParam: 0,
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 2,
    retry: 1,
  });
};
