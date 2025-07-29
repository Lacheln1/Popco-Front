import { ReviewProps } from "@/types/Reviews.types";
import axiosInstance from "./axiosInstance";

// 주간 리뷰
export const fetchReviewWeekly = async (): Promise<ReviewProps[]> => {
  const { data } = await axiosInstance.get(`/reviews/weekly-trend`);
  return data.data;
};
