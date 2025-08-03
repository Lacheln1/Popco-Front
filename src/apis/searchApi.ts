import { SearchResult } from "@/types/Search.types";
import axiosInstance from "./axiosInstance";

export const fetchSearchContents = async (
  keyword: string,
  page: number = 0,
  size: number = 20,
): Promise<SearchResult[]> => {
  if (!keyword.trim()) return [];

  try {
    const response = await axiosInstance.get(`/search/contents/advanced`, {
      params: {
        keyword,
        page,
        size,
      },
    });

    // 응답 구조가 data.data.content 형태인 경우
    return response.data?.data?.content ?? [];
  } catch (error) {
    console.error("검색 API 오류:", error);
    return [];
  }
};
