import {
  ContentCategory,
  ContentItem,
  FetchAllContentsParams,
  FetchAllContentsResponse,
} from "@/types/Contents.types";
import axiosInstance from "./axiosInstance";
import axios from "axios";

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

// 주간 랭킹
export const fetchContentsRanking = async (
  type: ContentCategory,
): Promise<ContentItem[]> => {
  const { data } = await axiosInstance.get(`/contents/popular/types/${type}`);
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
