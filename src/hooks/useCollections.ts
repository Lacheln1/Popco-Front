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
export const useFetchCollections = (pageSize: number = 10) => {
  return useInfiniteQuery({
    // useInfiniteQuery도 객체 형태로 사용
    queryKey: ["collections"],
    queryFn: ({ pageParam = 0 }) => fetchCollections(pageParam, pageSize),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage || lastPage.length < pageSize) {
        return undefined;
      }
      return allPages.length;
    },
  });
};

// 특정 컬렉션 상세 조회
export const useFetchCollectionById = (
  collectionId: string | undefined,
  accessToken?: string | null, // accessToken을 인자로 받음
) => {
  return useQuery({
    // queryKey에 accessToken을 추가하여 로그인/비로그인 상태를 구분
    queryKey: ["collection", collectionId, accessToken],
    
    // queryFn에서 accessToken을 함께 전달
    queryFn: () => fetchCollectionById({ collectionId: collectionId!, accessToken }),
    
    enabled: !!collectionId,
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
      return queryClient.invalidateQueries({
        queryKey: ["collection", collectionId],
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

// 컬렉션 저장(마크) 상태 변경을 위한 훅
export const useToggleMarkCollection = (collectionId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: toggleCollectionMark,
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: ["collection", collectionId],
      });
    },
    onError: () => {
      App.useApp().message.error("오류가 발생했습니다. 다시 시도해주세요.");
    },
  });
};

// 주간 인기 컬렉션 조회를 위한 훅
export const useFetchCollectionsWeekly = (limit: number) => {
  return useQuery({
    queryKey: ["collections", "weekly", limit],
    queryFn: () => fetchCollectionsWeekly(limit),
  });
};
