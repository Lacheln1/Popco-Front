// src/apis/collectionApi.ts

import axiosInstance from "./axiosInstance";
import { type Collection } from "@/types/collection";

// API 응답 원본 데이터 타입
interface RawCollection extends Omit<Collection, 'posters'> {
  // UI에서 직접 사용하지 않을 수 있지만, 원본 타입을 정의
}

// UI 컴포넌트에서 사용하기 편하게 가공된 데이터 타입
export interface ProcessedCollection {
  collectionId: number;
  title: string;
  description: string;
  posters: string[]; // ✅ string 배열로 가공
  userNickname: string;
  contentCount: number;
  saveCount: number;
  isSaved: boolean; // ❗️ 백엔드 응답에 이 값이 포함되어야 합니다.
}

/**
 * 서버에서 받은 데이터를 UI에서 사용하기 좋은 형태로 가공하는 함수
 */
const processCollectionData = (data: Collection[]): ProcessedCollection[] => {
  return data.map(collection => ({
    collectionId: collection.collectionId,
    title: collection.title,
    description: collection.description,
    // contentPosters 배열에서 posterPath만 추출하여 새로운 배열 생성
    posters: collection.contentPosters.map(p => p.posterPath),
    userNickname: collection.userNickname,
    contentCount: collection.contentCount,
    saveCount: collection.saveCount,
    isSaved: collection.isSaved || false, // ❗️ isSaved가 없으면 기본값 false 처리
  }));
};

/**
 * HOT 컬렉션 (인기 컬렉션) 목록을 가져오는 API
 */
export const getHotCollections = async (): Promise<ProcessedCollection[]> => {
  const response = await axiosInstance.get<{ data: Collection[] }>("/collections/popular");
  return processCollectionData(response.data.data);
};

/**
 * NEW 컬렉션 (전체 최신순) 목록을 가져오는 API
 */
export const getNewCollections = async (): Promise<ProcessedCollection[]> => {
  const response = await axiosInstance.get<{ data: Collection[] }>("/collections");
  return processCollectionData(response.data.data);
};

/**
 * 컬렉션을 저장(찜)하거나 취소하는 API (가상)
 * ❗️ 이 API는 명세 확인 후 수정이 필요합니다.
 */
export const toggleSaveCollection = async (collectionId: number, isSaved: boolean) => {
  const endpoint = `/collections/${collectionId}/save`;

  if (isSaved) {
    await axiosInstance.delete(endpoint);
  } else {
    await axiosInstance.post(endpoint);
  }
};
