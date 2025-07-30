import { fetchPopcorithm } from "@/apis/recommendApi";
import { RecommendationItem } from "@/types/Recommend.types";
import { useQuery } from "@tanstack/react-query";

export const usePopcorithm = (
  userId: number,
  limit: number,
  token?: string,
) => {
  return useQuery<RecommendationItem[], Error>({
    queryKey: ["popcorithm", userId, limit, token],
    queryFn: () => fetchPopcorithm(userId, limit),
    staleTime: 1000 * 60 * 60 * 12,
    gcTime: 1000 * 60 * 60 * 13,
    retry: 1,
    enabled: !!userId && !!token,
  });
};
