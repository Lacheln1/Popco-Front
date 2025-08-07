import {
  AutocompleteItem,
  AutocompleteResponse,
  PostFilterRequest,
  PostFilterResponse,
  SearchContentsParams,
  SearchResponse,
} from "@/types/Search.types";
import axiosInstance from "./axiosInstance";

export const fetchSearchContents = async ({
  keyword = "",
  actors = [],
  page = 0,
  size = 28,
}: SearchContentsParams): Promise<SearchResponse> => {
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
    const res = await axiosInstance.get(`/search/contents/advanced`, {
      params,
    });
    const data = res.data;
    return {
      content: data.content,
      number: data.page?.number ?? 0,
      totalPages: data.page?.totalPages ?? 1,
      totalElements: data.page?.totalElements ?? 0,
      size: data.page?.size ?? 30,
      last: (data.page?.number ?? 0) + 1 >= (data.page?.totalPages ?? 1),
    };
  } catch (error) {
    console.error("검색 API 오류:", error);
    throw error;
  }
};

export const postFilteredContents = async (
  body: PostFilterRequest,
  page = 0,
  size = 20,
) => {
  const response = await axiosInstance.post<{ data: PostFilterResponse }>(
    `/contents/filters?page=${page}&size=${size}`,
    body,
  );
  return response.data.data;
};

// 자동완성 API 함수
export const fetchAutocomplete = async (
  prefix: string,
): Promise<AutocompleteItem[]> => {
  try {
    const response = await axiosInstance.get<AutocompleteResponse>(
      `/search/autocomplete`,
      {
        params: {
          prefix: prefix,
        },
      },
    );
    const data = response.data;
    if (data.code === 200 && data.result === "SUCCESS") {
      return data.data || [];
    } else {
      throw new Error(
        data.message || "자동완성 데이터를 가져오는데 실패했습니다.",
      );
    }
  } catch (error) {
    console.error("자동완성 API 에러:", error);
    return [];
  }
};
