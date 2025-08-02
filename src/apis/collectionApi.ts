import { CollectionProps, CollectionResponse } from "@/types/Collection.types";
import axiosInstance from "./axiosInstance";
import axios from "axios";

const API_URL = "/api/client";

// 전체 컬렉션 목록 조회
export const fetchCollections = async (
  pageNumber: number = 0,
  pageSize: number = 10,
): Promise<CollectionProps[]> => {
  const { data } = await axiosInstance.get<CollectionResponse>("/collections", {
    params: {
      pageNumber,
      pageSize,
    },
  });
  return data.data;
};

// 특정 id 컬렉션 조회
export const fetchCollectionById = async (params: {
  collectionId: string;
  accessToken?: string | null; // accessToken을 옵셔널 파라미터로 받음
}) => {
  const { collectionId, accessToken } = params;

  // 토큰이 있을 경우에만 헤더를 추가
  const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};

  const { data: response } = await axiosInstance.get<{ data: any }>(
    `/collections/${collectionId}`,
    { headers }, // 여기에 헤더를 추가
  );
  return response.data;
};

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

// 컬렉션 저장(마크) 토글 (POST /collections/{collectionId}/mark)
export const toggleCollectionMark = async (params: {
  collectionId: string;
  accessToken: string;
}) => {
  const { collectionId, accessToken } = params;
  const { data } = await axiosInstance.post(
    `/collections/${collectionId}/mark`,
    null,
    { headers: { Authorization: `Bearer ${accessToken}` } },
  );
  return data;
};

// 특정 컬렉션 수정 (PUT /collections/{collectionId})
export const updateCollection = async (params: {
  collectionId: string;
  title: string;
  description: string;
  accessToken: string;
}) => {
  const { collectionId, title, description, accessToken } = params;
  const { data } = await axiosInstance.put(
    `/collections/${collectionId}`,
    { title, description },
    { headers: { Authorization: `Bearer ${accessToken}` } },
  );
  return data;
};

// 특정 컬렉션 삭제 (DELETE /collections/{collectionId})
export const deleteCollection = async (params: {
  collectionId: string;
  accessToken: string;
}) => {
  const { collectionId, accessToken } = params;
  await axiosInstance.delete(`/collections/${collectionId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
};
