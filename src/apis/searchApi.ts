import { SearchResult } from "@/types/Search.types";
import axiosInstance from "./axiosInstance";

interface SearchResponse {
  content: SearchResult[];
  last: boolean;
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
}

export const fetchSearchContents = async ({
  keyword = "",
  actors = [],
  page = 0,
  size,
}: {
  keyword?: string;
  actors?: string[];
  page?: number;
  size: number;
}): Promise<SearchResponse> => {
  const hasKeyword = keyword.trim().length > 0;
  const hasActors = Array.isArray(actors) && actors.length > 0;

  if (!hasKeyword && !hasActors) {
    return {
      content: [],
      last: true,
      totalPages: 0,
      totalElements: 0,
      number: page,
      size,
    };
  }

  const params: Record<string, string | string[]> = {
    page: String(page),
    size: String(size),
  };

  if (hasKeyword) params.keyword = keyword;
  if (hasActors) params.actors = actors;

  try {
    const response = await axiosInstance.get(`/search/contents/advanced`, {
      params,
    });

    return response.data?.data as SearchResponse;
  } catch (error) {
    console.error("검색 API 오류:", error);
    return {
      content: [],
      last: true,
      totalPages: 0,
      totalElements: 0,
      number: page,
      size,
    };
  }
};
