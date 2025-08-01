import { useQuery } from "@tanstack/react-query";
import { fetchMyReview } from "@/apis/reviewApi";

export const useMyReview = (
  contentId: number | undefined,
  type: string,
  token?: string,
) => {
  return useQuery({
    queryKey: ["myReview", contentId, type],
    queryFn: () => fetchMyReview(contentId!, type, token),
    staleTime: 0,
  });
};
