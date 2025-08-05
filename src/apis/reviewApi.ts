import {
  MyReview,
  MyReviewResponse,
  ReviewProps,
  DeclarationType,
  DeclarationPostRequest,
  PaginatedReviewsResponse,
  ReviewSummary,
  ReviewSummaryResponse,
} from "@/types/Reviews.types";
import axiosInstance from "./axiosInstance";
import axios from "axios";

const API_URL = "/api/client";

interface PostReviewRequest {
  score: number;
  text: string;
  status: "COMMON" | "SPOILER" | "BLIND";
}

// 주간 리뷰
export const fetchReviewWeekly = async (): Promise<ReviewProps[]> => {
  const { data } = await axiosInstance.get(`/reviews/weekly-trend`);
  return data.data;
};

//내 리뷰 별점 분포
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

// 콘텐츠에 작성된 내 리뷰
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

// 특정 콘텐츠에 리뷰 작성하기
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

//리뷰 삭제
export const deleteReview = async (reviewId: number, token?: string) => {
  const res = await axiosInstance.delete(`/reviews/${reviewId}`, {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });
  return res.data;
};

//리뷰 수정
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

//리뷰 신고 유형 목록 조회 API
export const fetchDeclarationTypes = async (): Promise<DeclarationType[]> => {
  // 스웨거 명세에 따라 파라미터가 없으므로 token 관련 로직을 제거합니다.
  const { data } = await axiosInstance.get("/declarations/type");
  return data.data;
};

/**
 * 리뷰 신고 등록 API
 * @param reviewId - 신고할 리뷰의 ID (URL 경로에 포함)
 * @param body - 신고 내용 (요청 본문에 포함)
 * @param token - 사용자 인증 토큰
 * @returns 신고 처리 결과
 */
export const postReviewDeclaration = async (
  reviewId: number,
  body: DeclarationPostRequest,
  token?: string,
) => {
  const response = await axiosInstance.post(
    `/declarations/reviews/${reviewId}`,
    body,
    {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    },
  );
  return response.data;
};

/**
 * 특정 콘텐츠의 리뷰 목록을 조회하는 API
 * @param params - 콘텐츠 ID, 타입, 페이지네이션, 정렬 옵션
 * @param token - 사용자 인증 토큰 (로그인 상태에 따라 isLiked 등을 받아오기 위함)
 * @returns 페이지네이션 정보와 리뷰 목록이 포함된 객체
 */
export const fetchContentReviews = async (
  params: {
    contentId: number;
    contentType: string;
    page: number;
    size: number;
    sort: "recent" | "popular"; // 'latest' -> 'recent'로 변경
  },
  token?: string,
): Promise<PaginatedReviewsResponse> => {
  const { contentId, contentType, page, size, sort } = params;
  const { data } = await axiosInstance.get(
    `/reviews/contents/${contentId}/types/${contentType}`,
    {
      params: {
        pageNumber: page, // 'page' -> 'pageNumber'로 변경
        pageSize: size, // 'size' -> 'pageSize'로 변경
        sort,
      },
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    },
  );
  return data; // data.data가 아닌 data 전체를 반환
};

/**
 * 리뷰에 좋아요 반응을 하거나 취소하는 API
 * @param reviewId - 반응을 남길 리뷰 ID
 * @param token - 사용자 인증 토큰
 * @returns API 응답 (isLiked 포함)
 */
export const toggleReviewReaction = async (reviewId: number, token: string) => {
  const { data } = await axiosInstance.post(
    `/reviews/${reviewId}/reaction`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return data;
};

/**
 * 콘텐츠 AI 리뷰 요약을 조회하는 API
 * @param contentId - 콘텐츠 ID
 * @param type - 콘텐츠 타입 ('movie' 또는 'tv')
 * @returns 리뷰 요약 정보
 */
export const fetchReviewSummary = async (
  contentId: number,
  type: string,
): Promise<ReviewSummary> => {
  const { data } = await axiosInstance.get<ReviewSummaryResponse>(
    `/reviews/summary/contents/${contentId}/types/${type}`,
  );
  return data.data;
};
