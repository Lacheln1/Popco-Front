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
  addContentToCollectionBatch,
  removeContentFromCollection,
  fetchRelatedCollections,
  fetchCollectionContentsAll,
  fetchCollectionContentCount,
  fetchMyCollections,
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
    queryKey: ["collections", "detail", collectionId, !!accessToken],
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

/**
 * 특정 콘텐츠와 관련된 컬렉션 목록을 조회하는 훅
 */
export const useFetchRelatedCollections = (params: {
  contentId: number | undefined;
  contentType: string | undefined;
  sortType: "popular" | "latest";
  accessToken?: string | null;
}) => {
  const { contentId, contentType, sortType, accessToken } = params;
  return useQuery({
    queryKey: ["collections", "related", contentId, sortType, !!accessToken],
    queryFn: () =>
      fetchRelatedCollections({
        contentId: contentId!,
        contentType: contentType!,
        sortType,
        accessToken,
      }),
    // contentId와 contentType이 모두 있을 때만 쿼리를 실행
    enabled: !!contentId && !!contentType,
  });
};

// 컬렉션 저장(마크) 상태 변경을 위한 훅
export const useToggleMarkCollection = () => {
  const queryClient = useQueryClient();
  const { message } = App.useApp();

  return useMutation({
    mutationFn: toggleCollectionMark,
    onSuccess: (data, variables) => {
      if (data?.data === true) {
        message.success("컬렉션이 저장되었습니다.");
      } else {
        message.success("컬렉션 저장이 취소되었습니다.");
      }
      return queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey[0] === "collections" &&
          (query.queryKey[1] === "list" ||
            query.queryKey[1] === "weekly" ||
            query.queryKey[1] === "related" || // 관련 컬렉션 캐시도 무효화
            (query.queryKey[1] === "detail" &&
              query.queryKey[2] === variables.collectionId)),
      });
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

  // addContent 뮤테이션이 사용되지 않으므로 삭제
  return useMutation({
    mutationFn: async (variables: {
      title: string;
      description: string;
      contents: Array<{ id: number; type: string }>;
      accessToken: string;
    }) => {
      const { title, description, contents, accessToken } = variables;

      const collectionResponse = await createCollection({
        title,
        description,
        accessToken,
      });

      if (
        collectionResponse.result !== "SUCCESS" ||
        !collectionResponse.data?.collectionId
      ) {
        throw new Error(
          collectionResponse.message || "컬렉션 생성에 실패했습니다.",
        );
      }

      const newCollectionId = collectionResponse.data.collectionId;

      if (contents && contents.length > 0) {
        const batchContents = contents.map((content) => ({
          contentId: content.id,
          contentType: content.type,
        }));

        await addContentToCollectionBatch({
          collectionId: String(newCollectionId),
          contents: batchContents,
          accessToken,
        });
      }
      return { collectionId: newCollectionId };
    },
    onSuccess: (data) => {
      const { collectionId } = data;
      message.success("컬렉션이 성공적으로 생성되었습니다!");
      queryClient.invalidateQueries({ queryKey: ["collections"] });
      navigate(`/collections/${collectionId}`);
    },
    onError: (error: Error) => {
      message.error(error.message);
    },
  });
};

// 컬렉션 콘텐츠 추가/제거를 위한 훅
export const useManageCollectionContents = (collectionId: string) => {
  const queryClient = useQueryClient();
  const { message } = App.useApp();

  const handleSuccess = (successMessage: string) => {
    message.success(successMessage);
    return queryClient.invalidateQueries({
      queryKey: ["collections", "detail", collectionId],
    });
  };

  const addContent = useMutation({
    mutationFn: addContentToCollection,
    onSuccess: () => handleSuccess("작품이 추가되었습니다."),
    onError: () => {
      message.error("작품 추가에 실패했습니다.");
    },
  });

  const removeContent = useMutation({
    mutationFn: removeContentFromCollection,
    onSuccess: () => handleSuccess("작품이 삭제되었습니다."),
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

// 내 컬렉션 목록 조회를 위한 훅
export const useFetchMyCollections = (accessToken?: string | null) => {
  return useQuery({
    queryKey: ["collections", "my", accessToken],
    queryFn: () => fetchMyCollections(accessToken!, 0, 100),
    enabled: !!accessToken,
  });
};

// 컬렉션에 콘텐츠 '하나'를 추가하는 뮤테이션 훅
export const useAddContentToCollection = () => {
  const queryClient = useQueryClient();
  const { message } = App.useApp();

  return useMutation({
    mutationFn: addContentToCollection,
    // 사용하지 않는 인자는 _(언더스코어)로 처리
    onSuccess: (_data, _variables) => {
      message.success("컬렉션에 작품을 추가했습니다.");
      queryClient.invalidateQueries({ queryKey: ["collections"] });
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "작품 추가에 실패했습니다.";
      message.error(errorMessage);
    },
  });
};
