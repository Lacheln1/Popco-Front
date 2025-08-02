// hooks/useCollections.ts (최종 수정본)

import {
  useQuery,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  fetchCollections,
  fetchCollectionById,
  updateCollection,
  deleteCollection,
  toggleCollectionMark,
  fetchCollectionsWeekly,
} from "@/apis/collectionApi";
import { useNavigate } from "react-router-dom";
import { App } from "antd";

// 전체 컬렉션 목록 조회 (무한 스크롤)
export const useFetchCollections = (
  pageSize: number = 10,
  accessToken?: string | null,
) => {
  return useInfiniteQuery({
    queryKey: ["collections", "list", accessToken], // 키를 조금 더 명확하게 변경
    queryFn: ({ pageParam = 0 }) =>
      fetchCollections(pageParam, pageSize, accessToken),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage || lastPage.length < pageSize) {
        return undefined;
      }
      return allPages.length;
    },
  });
};

// 주간 인기 컬렉션 조회를 위한 훅 (기존 useWeeklyCollections 대체)
export const useFetchCollectionsWeekly = (
  limit: number,
  accessToken?: string | null,
) => {
  return useQuery({
    // 키를 ['collections', 'weekly', ...]로 통일하여 invalidate 관리를 쉽게 만듭니다.
    queryKey: ["collections", "weekly", limit, accessToken],
    queryFn: () => fetchCollectionsWeekly(limit, accessToken),
    // staleTime 등 필요한 옵션은 여기에 추가할 수 있습니다.
    staleTime: 1000 * 60 * 60 * 12, // 12시간
  });
};

// 특정 컬렉션 상세 조회
export const useFetchCollectionById = (
  collectionId: string | undefined,
  accessToken?: string | null,
) => {
  return useQuery({
    queryKey: ["collections", "detail", collectionId, accessToken],
    queryFn: () =>
      fetchCollectionById({ collectionId: collectionId!, accessToken }),
    enabled: !!collectionId,
  });
};

// 컬렉션 저장(마크) 상태 변경을 위한 훅
export const useToggleMarkCollection = () => {
  const queryClient = useQueryClient();
  const { message } = App.useApp();

  return useMutation({
    mutationFn: toggleCollectionMark,
    onSuccess: (data) => {
      // 서버 응답 데이터인 data 객체 안의 data 프로퍼티 값을 확인합니다.
      if (data?.data === true) {
        message.success("컬렉션이 저장되었습니다.");
      } else {
        message.success("컬렉션 저장이 취소되었습니다.");
      }

      // 'collections'로 시작하는 모든 쿼리를 무효화합니다.
      return queryClient.invalidateQueries({ queryKey: ["collections"] });
    },
    onError: () => {
      message.error("오류가 발생했습니다. 다시 시도해주세요.");
    },
  });
};

// 컬렉션 수정을 위한 훅
export const useUpdateCollection = (collectionId: string) => {
  const queryClient = useQueryClient();
  const { message } = App.useApp();
  return useMutation({
    mutationFn: updateCollection,
    onSuccess: () => {
      message.success("컬렉션 정보가 수정되었습니다.");
      // 상세 정보와 목록 모두를 무효화
      return queryClient.invalidateQueries({
        queryKey: ["collections"],
      });
    },
    onError: () => {
      message.error("수정에 실패했습니다. 다시 시도해주세요.");
    },
  });
};

// 컬렉션 삭제를 위한 훅
export const useDeleteCollection = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { message } = App.useApp();
  return useMutation({
    mutationFn: deleteCollection,
    onSuccess: () => {
      message.success("컬렉션이 삭제되었습니다.");
      queryClient.invalidateQueries({ queryKey: ["collections"] });
      navigate("/");
    },
    onError: () => {
      message.error("삭제에 실패했습니다. 다시 시도해주세요.");
    },
  });
};
