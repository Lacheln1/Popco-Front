import { CollectionProps, CollectionResponse } from "@/types/Collection.types";
import axiosInstance from "./axiosInstance";
import axios from "axios";

const API_URL = "/api/client";

// 전체 컬렉션 목록 조회
export const fetchCollections = async (
  accessToken?: string | null,
): Promise<CollectionProps[]> => {
  const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
  const { data } = await axiosInstance.get<CollectionResponse>("/collections", {
    params: {
      pageNumber: 0,
      pageSize: 100, // 모달에 표시할 최대 컬렉션 개수
    },
    headers,
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

// 주간 인기 컬렉션
export const fetchCollectionsWeekly = async (
  limit: number,
  accessToken?: string | null, // accessToken 파라미터 추가
): Promise<CollectionProps[]> => {
  const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
  const { data } = await axiosInstance.get<CollectionResponse>(
    `/collections/popular/weekly?limit=${limit}`,
    { headers }, // 헤더 추가
  );
  return data.data;
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

// 컨텐츠 검색 (GET /search/contents/advanced)
export const searchContents = async (keyword: string, page: number = 0) => {
  if (!keyword.trim()) {
    return null;
  }
  try {
    // axios.get()의 응답 전체를 response 변수에 받도록 수정합니다.
    const response = await axiosInstance.get(`/search/contents/advanced`, {
      params: {
        keyword,
        page,
        size: 20,
      },
    });

    // response.data 안에 또 다른 data 필드가 있는지 확인하고 반환합니다.
    return response.data.data;
  } catch (error) {
    return null; // 에러 발생 시 null 반환
  }
};

// 컬렉션에 콘텐츠 추가 (POST /collections/{collectionId}/contents)
export const addContentToCollection = async (params: {
  collectionId: string;
  contentId: number;
  contentType: string; // contentType 추가
  accessToken: string;
}) => {
  const { collectionId, contentId, contentType, accessToken } = params;
  const { data } = await axiosInstance.post(
    `/collections/${collectionId}/contents`,
    { contentId, contentType }, // 요청 본문에 contentType 추가
    { headers: { Authorization: `Bearer ${accessToken}` } },
  );
  return data;
};

// 컬렉션에서 콘텐츠 제거 (DELETE /collections/{collectionId}/contents/{contentId})
export const removeContentFromCollection = async (params: {
  collectionId: string;
  contentId: number;
  contentType: string; // contentType 추가
  accessToken: string;
}) => {
  const { collectionId, contentId, contentType, accessToken } = params;
  await axiosInstance.delete(
    `/collections/${collectionId}/contents/${contentId}`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
      params: { contentType }, // contentType을 쿼리 파라미터로 전달
    },
  );
};

// 컬렉션의 모든 컨텐츠 조회 (GET /collections/{collectionId}/contents/all)
export const fetchCollectionContentsAll = async (collectionId: string) => {
  const { data } = await axiosInstance.get(
    `/collections/${collectionId}/contents/all`,
  );
  return data.data; // data: [...] 배열 반환
};

// 컬렉션의 컨텐츠 개수 조회 (GET /collections/{collectionId}/contents/count)
export const fetchCollectionContentCount = async (collectionId: string) => {
  const { data } = await axiosInstance.get(
    `/collections/${collectionId}/contents/count`,
  );
  return data.data; // data: number 반환
};

// 컬렉션 생성 (POST /collections) - title, description만 전송
export const createCollection = async (params: {
  title: string;
  description: string;
  accessToken: string;
}) => {
  const { title, description, accessToken } = params;
  // 서버의 전체 응답을 반환하여 훅에서 처리하도록 함
  const { data } = await axiosInstance.post(
    `/collections`,
    { title, description },
    { headers: { Authorization: `Bearer ${accessToken}` } },
  );
  return data;
};

// 컬렉션에 배치 콘텐츠 추가 (POST /collections/{collectionId}/contents/batch)
export const addContentToCollectionBatch = async (params: {
  collectionId: string;
  contents: Array<{ contentId: number; contentType: string }>;
  accessToken: string;
}) => {
  const { collectionId, contents, accessToken } = params;
  const { data } = await axiosInstance.post(
    `/collections/${collectionId}/contents/batch`,
    { contents },
    { headers: { Authorization: `Bearer ${accessToken}` } },
  );
  return data;
};

/**
 * 특정 콘텐츠가 포함된 컬렉션 목록을 조회
 * @param params contentId, contentType, sortType 등
 */
export const fetchRelatedCollections = async (params: {
  contentId: number;
  contentType: string;
  sortType: "popular" | "latest";
  pageNumber?: number;
  pageSize?: number;
  accessToken?: string | null;
}) => {
  const {
    contentId,
    contentType,
    sortType,
    pageNumber = 0,
    pageSize = 20,
    accessToken,
  } = params;

  const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};

  const { data } = await axiosInstance.get(
    `/collections/content/${contentId}`,
    {
      params: {
        contentType,
        sortType,
        pageNumber,
        pageSize,
      },
      headers,
    },
  );

  return data.data;
};

// 내 컬렉션 목록 조회 (GET /collections/my)
export const fetchMyCollections = async (
  accessToken: string,
  page: number,
  pageSize: number,
) => {
  const { data } = await axiosInstance.get(`/collections/my`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    params: {
      pageNumber: page,
      pageSize: pageSize,
    },
  });
  return data.data;
};
