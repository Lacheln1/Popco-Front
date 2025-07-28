import { ContentCategory, ContentItem } from "@/types/Contents.types";
import axiosInstance from "./axiosInstance";

// 주간 랭킹
export const fetchContentsRanking = async (
  type: ContentCategory,
): Promise<ContentItem[]> => {
  const { data } = await axiosInstance.get(`/contents/popular/types/${type}`);
  return data;
};
