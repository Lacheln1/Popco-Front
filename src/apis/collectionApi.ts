import { CollectionProps, CollectionResponse } from "@/types/Collection.types";
import axiosInstance from "./axiosInstance";

// 주간 리뷰
export const fetchCollectionsWeekly = async (
  limit: number,
): Promise<CollectionProps[]> => {
  const { data } = await axiosInstance.get<CollectionResponse>(
    `/collections/popular/weekly?limit=${limit}`,
  );
  return data.data;
};
