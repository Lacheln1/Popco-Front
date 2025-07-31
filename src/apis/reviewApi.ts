import { ReviewProps } from "@/types/Reviews.types";
import axiosInstance from "./axiosInstance";
import axios from "axios";

const API_URL = "/api/client";

// 주간 리뷰
export const fetchReviewWeekly = async (): Promise<ReviewProps[]> => {
  const { data } = await axiosInstance.get(`/reviews/weekly-trend`);
  return data.data;
};

export const getMyScoreDistribution = async (accessToken: string) => {
  try {
    const response = await axios.get(
      `${API_URL}/reviews/my/score-distribution`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      },
    );
    console.log("score평균 가져오기 성공", response.data);

    return response.data;
  } catch (error) {
    console.error("score평균 가져오기 실패:", error);
    throw error;
  }
};
