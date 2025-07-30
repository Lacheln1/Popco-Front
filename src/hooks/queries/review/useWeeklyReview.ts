import { useQuery } from "@tanstack/react-query";
import { fetchReviewWeekly } from "@/apis/reviewApi";
import { ReviewProps } from "@/types/Reviews.types";

export const useWeeklyReview = () => {
  return useQuery<ReviewProps[]>({
    queryKey: ["weeklyReview"],
    queryFn: fetchReviewWeekly,
    staleTime: 1000 * 60 * 60 * 12,
    gcTime: 1000 * 60 * 60 * 13,
    retry: 1,
  });
};
