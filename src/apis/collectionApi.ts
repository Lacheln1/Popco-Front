import { CollectionProps, CollectionResponse } from "@/types/Collection.types";
import axiosInstance from "./axiosInstance";
import axios from "axios";

const API_URL = "/api/client";

// 주간 리뷰
export const fetchCollectionsWeekly = async (
  limit: number,
): Promise<CollectionProps[]> => {
  const { data } = await axiosInstance.get<CollectionResponse>(
    `/collections/popular/weekly?limit=${limit}`,
  );
  return data.data;
};

// 내 컬렉션 목록 조회
export const fetchMyCollections = async (
  accessToken: string,
  pageNumber: number = 0,
  pageSize: number = 20,
) => {
  const response = await axios.get(`${API_URL}/collections/my`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    params: {
      pageNumber,
      pageSize,
    },
  });
  return response.data;
};

// 내가 마크한 컬렉션 목록
export const fetchMyMarkedCollections = async (
  accessToken: string,
  pageNumber: number = 0,
  pageSize: number = 20,
) => {
  const response = await axios.get(`${API_URL}/collections/marked`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    params: {
      pageNumber,
      pageSize,
    },
  });
  return response.data;
};
