import {
  ContentCategory,
  ContentItem,
  FetchAllContentsParams,
  FetchAllContentsResponse,
} from "@/types/Contents.types";
import axiosInstance from "./axiosInstance";

// 주간 랭킹
export const fetchContentsRanking = async (
  type: ContentCategory,
): Promise<ContentItem[]> => {
  const { data } = await axiosInstance.get(`/contents/popular/types/${type}`);
  return data.data;
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
