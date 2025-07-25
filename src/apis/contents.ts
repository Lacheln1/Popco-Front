import { ContentCategory, ContentItem } from "@/types/Contents.types";
import axios from "./axiosInstance";

// 주간 랭킹
export const fetchContentsRanking = async (
  type: ContentCategory,
): Promise<ContentItem[]> => {
  const { data } = await axios.get(`/contents/popular/type/${type}`);
  return data;
};
