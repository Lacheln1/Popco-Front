import { fetchAllContents } from "@/apis/contentsApi";
import { AllContentItem, FetchAllContentsParams } from "@/types/Contents.types";
import { useQuery } from "@tanstack/react-query";

export const useAllContents = ({
  pageNumber,
  pageSize,
  sort,
}: FetchAllContentsParams) => {
  return useQuery({
    queryKey: ["allContents", sort, pageNumber],
    queryFn: () =>
      fetchAllContents({
        pageNumber,
        pageSize,
        sort,
      }),
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 60 * 1,
    gcTime: 1000 * 60 * 60 * 2,
    retry: 1,
  });
};
