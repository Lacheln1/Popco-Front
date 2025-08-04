import {
  ContentCategory,
  ContentItem,
  FetchAllContentsParams,
  FetchAllContentsResponse,
  ContentsDetail,
} from "@/types/Contents.types";
import axiosInstance from "./axiosInstance";
import axios from "axios";

const RECOMMEND_URL = import.meta.env.VITE_RECOMMEND_URL;
const API_URL = "/api/client";
interface LikeContentsResponse {
  code: number;
  result: string;
  message: string;
  data: LikeContent[];
}

interface LikeContent {
  contentId: number;
  contentType: string;
  title: string;
  overview: string;
  ratingAverage: number;
  releaseDate: string;
  ratingCount: number;
  backdropPath: string;
  posterPath: string;
  runtime: number;
  genreIds: number[];
  likedAt: string;
}

interface WishlistItem {
  wishlistId: number;
  userId: number;
  contentId: number;
  contentType: string;
  contentTitle: string;
  contentPosterUrl: string;
  createdAt: string;
}

interface WishlistResponse {
  code: number;
  result: string;
  message: string;
  data: WishlistItem[];
}

interface RecommendationItem {
  contentId: number;
  title: string;
  genres: string[];
  type: string;
  poster_path: string;
  predicted_rating: number;
  persona_genre_match: boolean | null;
}

// API 응답 타입
interface RecommendationResponse {
  message: string;
  recommendations: RecommendationItem[];
  main_persona: string;
  sub_persona: string;
  all_personas_scores: Record<string, number>;
}

// 주간 랭킹
export const fetchContentsRanking = async (
  type: ContentCategory,
  token?: string,
): Promise<ContentItem[]> => {
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  const { data } = await axiosInstance.get(`/contents/popular/types/${type}`, {
    headers,
  });
  return data.data;
};

// 마이페이지  내가 좋아요한 컨텐츠
export const fetchLikeContents = async (
  accessToken: string,
): Promise<LikeContentsResponse> => {
  try {
    const response = await axios.get<LikeContentsResponse>(
      `${API_URL}/contents/liked`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      },
    );
    console.log("좋아요한 컨텐츠 api 성공", response.data);
    return response.data; // 응답 데이터를 반환
  } catch (error) {
    console.error("contents/liked실패", error);
    throw error; // 에러를 다시 던져서 컴포넌트에서 처리할 수 있도록 함
  }
};

//마이페이지 내가 보고싶어해요
export const fetchWishlist = async (
  userId: number,
): Promise<WishlistResponse> => {
  try {
    const response = await axios.get<WishlistResponse>(
      `${API_URL}/wishlists/users/${userId}`,
    );
    console.log("위시리스트 api 성공", response.data);
    return response.data;
  } catch (error) {
    console.error("위시리스트 조회 실패", error);
    throw error;
  }
};

// 위시리스트에 추가 (POST /wishlists/users/{userId})
export const addToWishlist = async (params: {
  userId: number;
  contentId: number;
  contentType: string;
  accessToken: string;
}) => {
  const { userId, contentId, contentType, accessToken } = params;
  const { data } = await axiosInstance.post(
    `/wishlists/users/${userId}`,
    { contentId, contentType },
    { headers: { Authorization: `Bearer ${accessToken}` } },
  );
  return data;
};

// 위시리스트에서 삭제 (DELETE /wishlists/users/{userId})
export const removeFromWishlist = async (params: {
  userId: number;
  contentId: number;
  contentType: string;
  accessToken: string;
}) => {
  const { userId, contentId, contentType, accessToken } = params;
  const { data } = await axiosInstance.delete(`/wishlists/users/${userId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    data: { contentId, contentType },
  });
  return data;
};

// 전체 컨텐츠 조회
export const fetchAllContents = async ({
  pageNumber = 0,
  pageSize,
  sort = "recent",
}: FetchAllContentsParams): Promise<FetchAllContentsResponse> => {
  const { data } = await axiosInstance.get(`/contents`, {
    params: {
      pageNumber: pageNumber,
      pageSize: pageSize,
      sort,
    },
  });
  return data.data;
};

// 콘텐츠 상세 정보 조회
export const getContentsDetail = async (
  id: string,
  type: string,
): Promise<ContentsDetail> => {
  const { data } = await axiosInstance.get(`/contents/ids/${id}/types/${type}`);
  return data.data;
};

// 영화 추천 가져오기
export const getMovieRecommendations = async (
  userId: number,
): Promise<RecommendationResponse> => {
  try {
    const response = await axios.get<RecommendationResponse>(
      `${RECOMMEND_URL}/recommends/personas/users/${userId}/recommendations`,
      {
        params: {
          content_type: "movie",
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error("영화 추천 데이터 가져오기 실패:", error);
    throw error;
  }
};

// TV 시리즈 추천 가져오기
export const getTvRecommendations = async (
  userId: number,
): Promise<RecommendationResponse> => {
  try {
    const response = await axios.get<RecommendationResponse>(
      `${RECOMMEND_URL}/recommends/personas/users/${userId}/recommendations`,
      {
        params: {
          content_type: "tv",
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error("TV 시리즈 추천 데이터 가져오기 실패:", error);
    throw error;
  }
};
