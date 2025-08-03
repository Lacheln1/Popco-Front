import { useInfiniteQuery } from "@tanstack/react-query";
import { SearchContentsParams } from "@/types/Search.types";
import { fetchSearchContents } from "@/apis/searchApi";

export const useSearchContents = ({
  keyword,
  actors,
  size,
}: SearchContentsParams) => {
  return useInfiniteQuery({
    queryKey: ["searchContents", keyword, actors],
    queryFn: ({ pageParam = 0 }: { pageParam?: number }) =>
      fetchSearchContents({
        keyword,
        actors,
        page: pageParam,
        size,
      }),
    getNextPageParam: (lastPage, allPages) =>
      (lastPage as { last: boolean }).last ? undefined : allPages.length,
    initialPageParam: 0,
    enabled: !!(keyword?.trim() || (actors?.length ?? 0) > 0),
  });
};
