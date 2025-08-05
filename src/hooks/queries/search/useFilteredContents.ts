import { postFilteredContents } from "@/apis/searchApi";
import { PostFilterRequest } from "@/types/Search.types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useFilterStore } from "@/store/useFilterStore";

export const useFilteredContents = ({
  size = 28,
  enabled = true,
}: {
  size?: number;
  enabled?: boolean;
} = {}) => {
  const { filter } = useFilterStore();

  return useInfiniteQuery({
    queryKey: ["filteredContents", filter],
    queryFn: ({ pageParam = 0 }) =>
      postFilteredContents(filter, pageParam, size),
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = lastPage.page + 1;
      const totalPages = lastPage.totalPages;
      return nextPage < totalPages ? nextPage : undefined;
    },
    initialPageParam: 0,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    retry: 1,
    enabled: enabled && hasValidFilter(filter),
  });
};

// 수정된 hasValidFilter 함수
const hasValidFilter = (filter: PostFilterRequest): boolean => {
  if (!filter || typeof filter !== "object") return false;

  return Object.values(filter).some((value) => {
    if (typeof value === "string") return value.trim() !== "";
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === "number") return !isNaN(value);
    if (typeof value === "object" && value !== null)
      return Object.keys(value).length > 0;
    return false;
  });
};
