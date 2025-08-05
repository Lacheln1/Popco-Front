import { postFilteredContents } from "@/apis/searchApi";
import { PostFilterRequest } from "@/types/Search.types";
import { useQuery } from "@tanstack/react-query";
import { useFilterStore } from "@/store/useFilterStore";

export const useFilteredContents = ({
  enabled = true,
  page = 0,
  size = 28,
}: {
  enabled?: boolean;
  page?: number;
  size?: number;
} = {}) => {
  const { filter } = useFilterStore();
  return useQuery({
    queryKey: ["filteredContents", filter, page, size],
    queryFn: () => {
      return postFilteredContents(filter, page, size);
    },
    enabled: enabled && hasValidFilter(filter),
    staleTime: 1000 * 60 * 5,
  });
};

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
