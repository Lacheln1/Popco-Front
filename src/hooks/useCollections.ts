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
  createCollection,
  addContentToCollection,
  removeContentFromCollection,
  fetchCollectionContentsAll,
  fetchCollectionContentCount,
} from "@/apis/collectionApi";
import { useNavigate } from "react-router-dom";
import { App } from "antd";

// 전체 컬렉션 목록 조회 (무한 스크롤)
export const useFetchCollections = (
  pageSize: number = 10,
  accessToken?: string | null,
) => {
  return useInfiniteQuery({
    queryKey: ["collections", "list", accessToken],
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

// 주간 인기 컬렉션 조회를 위한 훅
export const useFetchCollectionsWeekly = (
  limit: number,
  accessToken?: string | null,
) => {
  return useQuery({
    queryKey: ["collections", "weekly", limit, accessToken],
    queryFn: () => fetchCollectionsWeekly(limit, accessToken),
    staleTime: 1000 * 60 * 60 * 12,
  });
};

// 특정 컬렉션 기본 정보 조회
export const useFetchCollectionById = (
  collectionId: string | undefined,
  accessToken?: string | null,
) => {
  return useQuery({
    queryKey: ["collections", "detail", collectionId],
    queryFn: () =>
      fetchCollectionById({ collectionId: collectionId!, accessToken }),
    enabled: !!collectionId,
  });
};

// 특정 컬렉션의 모든 콘텐츠 목록 조회
export const useFetchCollectionContents = (
  collectionId: string | undefined,
) => {
  return useQuery({
    queryKey: ["collections", "detail", collectionId, "contents"],
    queryFn: () => fetchCollectionContentsAll(collectionId!),
    enabled: !!collectionId,
  });
};

// 특정 컬렉션의 콘텐츠 개수 조회
export const useFetchCollectionContentCount = (
  collectionId: string | undefined,
) => {
  return useQuery({
    queryKey: ["collections", "detail", collectionId, "count"],
    queryFn: () => fetchCollectionContentCount(collectionId!),
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
      if (data?.data === true) {
        message.success("컬렉션이 저장되었습니다.");
      } else {
        message.success("컬렉션 저장이 취소되었습니다.");
      }
      // 목록과 상세 페이지의 모든 관련 쿼리를 무효화
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
      // 해당 컬렉션의 상세 정보 캐시만 무효화
      return queryClient.invalidateQueries({
        queryKey: ["collections", "detail", collectionId],
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
      // 전체 목록 캐시를 무효화
      queryClient.invalidateQueries({ queryKey: ["collections", "list"] });
      navigate("/");
    },
    onError: () => {
      message.error("삭제에 실패했습니다. 다시 시도해주세요.");
    },
  });
};

// 컬렉션 생성을 위한 훅
export const useCreateCollection = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { message } = App.useApp();

  const { mutate: addContent } = useMutation({
    mutationFn: addContentToCollection,
    onError: (error, variables) => {
      // 개별 콘텐츠 추가 실패 시 에러 메시지를 보여줄 수 있습니다.
      console.error(`콘텐츠(ID: ${variables.contentId}) 추가 실패:`, error);
      message.error("일부 작품 추가에 실패했습니다.");
    },
  });

  return useMutation({
    // 1단계: 껍데기 만들기
    mutationFn: createCollection,
    // 2단계: 껍데기 만들기가 성공하면, 콘텐츠를 하나씩 추가
    onSuccess: (data, variables) => {
      const newCollectionId = data?.collectionId;
      if (!newCollectionId) {
        message.error("컬렉션 생성에 실패했습니다.");
        return;
      }

      const { contents, accessToken } = variables;

      // 각 콘텐츠에 대해 '콘텐츠 추가' API를 순차적으로 호출합니다.
      if (contents && contents.length > 0) {
        contents.forEach((content: any) => {
          addContent({
            collectionId: String(newCollectionId),
            contentId: content.id,
            contentType: content.type,
            accessToken: accessToken,
          });
        });
      }

      message.success("컬렉션이 성공적으로 생성되었습니다!");
      queryClient.invalidateQueries({ queryKey: ["collections", "list"] });

      // 모든 콘텐츠 추가 요청을 보낸 후, 상세 페이지로 즉시 이동합니다.
      navigate(`/collections/${newCollectionId}`);
    },
    onError: () => {
      message.error("컬렉션 생성에 실패했습니다. 다시 시도해주세요.");
    },
  });
};

// 컬렉션 콘텐츠 추가/제거를 위한 훅
export const useManageCollectionContents = (collectionId: string) => {
  const queryClient = useQueryClient();
  const { message } = App.useApp();

  const addContent = useMutation({
    mutationFn: addContentToCollection,
    onSuccess: () => {
      message.success("작품이 추가되었습니다.");
      // 상세 페이지의 콘텐츠 목록과 개수 캐시를 무효화
      queryClient.invalidateQueries({
        queryKey: ["collections", "detail", collectionId, "contents"],
      });
      queryClient.invalidateQueries({
        queryKey: ["collections", "detail", collectionId, "count"],
      });
    },
    onError: () => {
      message.error("작품 추가에 실패했습니다.");
    },
  });

  const removeContent = useMutation({
    mutationFn: removeContentFromCollection,
    onSuccess: () => {
      message.success("작품이 삭제되었습니다.");
      // 상세 페이지의 콘텐츠 목록과 개수 캐시를 무효화
      queryClient.invalidateQueries({
        queryKey: ["collections", "detail", collectionId, "contents"],
      });
      queryClient.invalidateQueries({
        queryKey: ["collections", "detail", collectionId, "count"],
      });
    },
    onError: () => {
      message.error("작품 삭제에 실패했습니다.");
    },
  });

  return {
    addContent: addContent.mutate,
    isAdding: addContent.isPending,
    removeContent: removeContent.mutate,
    isRemoving: removeContent.isPending,
  };
};
