import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
  useQuery,
} from "@tanstack/react-query";
import {
  fetchContentReviews,
  toggleReviewReaction,
  postReview,
  putReview,
  deleteReview,
  fetchReviewSummary,
  fetchDeclarationTypes,
  postReviewDeclaration,
  fetchMyReview,
} from "@/apis/reviewApi";
import {
  PaginatedReviewsResponse,
  ContentReview,
  PostReviewRequest,
  DeclarationType,
  DeclarationPostRequest,
} from "@/types/Reviews.types";

// 공통으로 사용할 쿼리 무효화 함수
const invalidateReviewQueries = (
  queryClient: any,
  contentId: number,
  contentType: string,
) => {
  console.log(
    `[Query Invalidate] key: ['reviews', ${contentId}, ${contentType}]`,
  );
  // ReviewSection이 사용하는 리뷰 목록 쿼리를 모두 무효화 (최신순, 인기순 포함)
  queryClient.invalidateQueries({
    queryKey: ["reviews", contentId, contentType],
    refetchType: "all",
  });
  // DetailPage 상단 등에서 사용할 수 있는 '내 리뷰' 쿼리 무효화
  queryClient.invalidateQueries({
    queryKey: ["myReview", contentId, contentType],
    refetchType: "all",
  });
};

// --- 리뷰 목록 조회 훅 ---
export const useFetchInfiniteReviews = (
  contentId: number,
  contentType: string,
  sort: "recent" | "popular",
  token?: string,
) => {
  return useInfiniteQuery<PaginatedReviewsResponse, Error>({
    queryKey: ["reviews", contentId, contentType, sort, token],
    initialPageParam: 0,
    queryFn: ({ pageParam }) =>
      fetchContentReviews(
        { contentId, contentType, page: pageParam, size: 10, sort },
        token,
      ),
    getNextPageParam: (lastPage: PaginatedReviewsResponse) => {
      const currentPage = lastPage.data.page as number;
      const totalPages = lastPage.data.totalPages as number;
      if (currentPage < totalPages - 1) {
        return currentPage + 1;
      }
      return undefined;
    },
    enabled: !!contentId && !!contentType,
  });
};

// --- 리뷰 생성 훅 (수정) ---
export const usePostReview = (contentId: number, contentType: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      body,
      token,
    }: {
      body: PostReviewRequest;
      token: string;
    }) => {
      const response = await postReview(contentId, contentType, body, token);

      // ★★★ 서버 응답 결과 확인 로직 추가 ★★★
      if (response.result !== "SUCCESS") {
        throw new Error(response.message || "리뷰 등록에 실패했습니다.");
      }
      return response;
    },
    onSuccess: () => {
      invalidateReviewQueries(queryClient, contentId, contentType);
    },
    onError: (error) => console.error("[API Error] postReview:", error.message),
  });
};

// --- 리뷰 수정 훅  ---
export const usePutReview = (contentId: number, contentType: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      reviewId,
      body,
      token,
    }: {
      reviewId: number;
      body: PostReviewRequest;
      token: string;
    }) => {
      const response = await putReview(reviewId, body, token);

      if (response.result !== "SUCCESS") {
        throw new Error(response.message || "리뷰 수정에 실패했습니다.");
      }
      return response;
    },
    onSuccess: () => {
      invalidateReviewQueries(queryClient, contentId, contentType);
    },
    onError: (error) => console.error("[API Error] putReview:", error.message),
  });
};

// --- 리뷰 삭제 훅 ---
export const useDeleteReview = (contentId: number, contentType: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ reviewId, token }: { reviewId: number; token: string }) => {
      return deleteReview(reviewId, token);
    },
    onSuccess: () => {
      invalidateReviewQueries(queryClient, contentId, contentType);
    },
    onError: (error) => console.error("[API Error] deleteReview:", error),
  });
};

// --- 리뷰 좋아요 훅 ---
export const useToggleReviewReaction = (
  contentId: number,
  contentType: string,
  sort: "recent" | "popular",
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ reviewId, token }: { reviewId: number; token: string }) =>
      toggleReviewReaction(reviewId, token),
    onMutate: async ({ reviewId }) => {
      const queryKey = ["reviews", contentId, contentType, sort];
      await queryClient.cancelQueries({ queryKey });
      const previousData = queryClient.getQueryData<any>(queryKey);
      if (previousData) {
        const updatedData = {
          ...previousData,
          pages: previousData.pages.map((page: PaginatedReviewsResponse) => ({
            ...page,
            data: {
              ...page.data,
              reviewList: page.data.reviewList.map((review: ContentReview) => {
                if (review.reviewId === reviewId) {
                  return {
                    ...review,
                    isLiked: !review.isLiked,
                    likeCount: review.isLiked
                      ? review.likeCount - 1
                      : review.likeCount + 1,
                  };
                }
                return review;
              }),
            },
          })),
        };
        queryClient.setQueryData(queryKey, updatedData);
      }
      return { previousData };
    },
    onError: (_err, _variables, context) => {
      const queryKey = ["reviews", contentId, contentType, sort];
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData);
      }
    },
    onSettled: () => {
      const queryKey = ["reviews", contentId, contentType, sort];
      queryClient.invalidateQueries({ queryKey });
    },
  });
};

/**
 * 콘텐츠의 AI 리뷰 요약 데이터를 불러오는 커스텀 훅
 * @param contentId 콘텐츠 ID
 * @param contentType 콘텐츠 타입 ('movie' or 'tv')
 * @returns React Query의 useQuery 결과 (data, isLoading, error 등)
 */
export const useFetchReviewSummary = (
  contentId: number,
  contentType: string,
) => {
  return useQuery({
    queryKey: ["reviewSummary", contentId, contentType],
    queryFn: () => fetchReviewSummary(contentId, contentType),
    staleTime: 1000 * 60 * 5, // 5분 동안은 캐시된 데이터 사용
    enabled: !!contentId && !!contentType, // ID와 타입이 있을 때만 쿼리 실행
  });
};

// 특정 콘텐츠에 대한 내 리뷰 조회 훅
export const useMyReview = (
  contentId: number,
  contentType: string,
  token?: string,
) => {
  return useQuery({
    queryKey: ["myReview", contentId, contentType],
    queryFn: () => fetchMyReview(contentId, contentType, token),
    enabled: !!contentId && !!contentType && !!token,
  });
};

// --- 신고 관련 훅들 ---

/**
 * 신고 유형 목록을 조회하는 훅
 */
export const useFetchDeclarationTypes = () => {
  return useQuery<DeclarationType[], Error>({
    queryKey: ["declarationTypes"],
    queryFn: fetchDeclarationTypes,
    staleTime: 1000 * 60 * 10, // 10분 동안 캐시 유지
  });
};

// --- 리뷰 신고 훅 ---
export const usePostReviewDeclaration = (
  contentId: number,
  contentType: string,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      reviewId,
      body,
      token,
    }: {
      reviewId: number;
      body: DeclarationPostRequest;
      token: string;
    }) => {
      const response = await postReviewDeclaration(reviewId, body, token);

      if (response.result !== "SUCCESS") {
        throw new Error(response.message || "신고 등록에 실패했습니다.");
      }
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["reviews", contentId, contentType],
      });
    },
    onError: (error) => {
      console.error("[API Error] postReviewDeclaration:", error.message);
    },
  });
};
