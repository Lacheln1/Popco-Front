import { MyReview, MyReviewResponse, ReviewProps } from "@/types/Reviews.types";
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

// 내 리뷰
export const fetchMyReview = async (
  contentId: number | undefined,
  type: string,
  token: string | undefined,
): Promise<{
  existUserReview: boolean;
  myReview: MyReview | null;
  login: boolean;
}> => {
  const { data } = await axiosInstance.get<MyReviewResponse>(
    `/reviews/contents/${contentId}/types/${type}/my`,
    {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    },
  );
  return {
    existUserReview: data.data.existUserReview,
    myReview: data.data.myReview,
    login: data.data.login,
  };
};

interface PostReviewRequest {
  score: number;
  text: string;
  status: "COMMON" | "SPOILER" | "BLIND";
}

export const postReview = async (
  contentId: number,
  type: string,
  body: PostReviewRequest,
  token?: string,
) => {
  const response = await axiosInstance.post(
    `/reviews/contents/${contentId}/types/${type}`,
    body,
    {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    },
  );
  return response.data;
};

export const deleteReview = async (reviewId: number, token?: string) => {
  const res = await axiosInstance.delete(`/reviews/${reviewId}`, {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });
  return res.data;
};

export const putReview = async (
  reviewId: number,
  data: {
    score: number;
    text: string;
    status: "COMMON" | "SPOILER" | "BLIND";
  },
  token: string,
) => {
  const res = await axiosInstance.put(`/reviews/${reviewId}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};
