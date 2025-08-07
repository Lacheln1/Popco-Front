import { useEffect, useState, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSendContentFeedback } from "@/hooks/queries/contents/useSendContentFeedback";
import { deleteContentReaction } from "@/apis/recommendApi";
import { ReactionType } from "@/types/Contents.types";

interface UseContentReactionOptions {
  userId: number;
  accessToken: string;
  contentList: { id: number; reaction?: ReactionType }[];
}

interface UseContentReactionReturn {
  reactionMap: Record<number, ReactionType>;
  handleReaction: (
    contentId: number,
    newState: ReactionType,
    contentType: string,
  ) => void;
  isLoading: boolean;
}

export const useContentReaction = ({
  userId,
  accessToken,
  contentList,
}: UseContentReactionOptions): UseContentReactionReturn => {
  const queryClient = useQueryClient(); // 추가
  const { mutate: sendFeedback } = useSendContentFeedback();
  const [reactionMap, setReactionMap] = useState<Record<number, ReactionType>>(
    {},
  );
  const [isLoading, setIsLoading] = useState(false);

  // 이전 contentList를 저장하기 위한 ref
  const prevContentListRef = useRef<string>("");

  // 초기 상태 설정 - contentList가 실제로 변경된 경우에만 실행
  useEffect(() => {
    // contentList를 문자열로 변환해서 실제 변경사항 확인
    const currentContentListStr = JSON.stringify(
      contentList
        .map((item) => ({ id: item.id, reaction: item.reaction }))
        .sort((a, b) => a.id - b.id),
    );

    // 이전과 같으면 아무것도 하지 않음
    if (prevContentListRef.current === currentContentListStr) {
      return;
    }

    // 이전 값 업데이트
    prevContentListRef.current = currentContentListStr;

    if (contentList.length > 0) {
      const initialMap = contentList.reduce(
        (acc, cur) => {
          acc[cur.id] = cur.reaction ?? "NEUTRAL";
          return acc;
        },
        {} as Record<number, ReactionType>,
      );

      setReactionMap(initialMap);
    } else {
      setReactionMap({});
    }
  }, [contentList, userId]);

  const handleReaction = async (
    contentId: number,
    newState: ReactionType,
    contentType: string,
  ) => {
    const currentState = reactionMap[contentId] || "NEUTRAL";

    // 같은 상태를 다시 클릭하면 취소 (NEUTRAL로 변경)
    const targetState = currentState === newState ? "NEUTRAL" : newState;

    // 즉시 UI 업데이트 (낙관적 업데이트)
    setReactionMap((prev) => ({
      ...prev,
      [contentId]: targetState,
    }));

    setIsLoading(true);

    try {
      if (targetState === "NEUTRAL") {
        // 반응 취소 - DELETE API 호출
        await deleteContentReaction(
          userId,
          contentId,
          contentType,
          accessToken,
        );
      } else {
        // 새로운 반응 추가/변경 - POST API 호출
        const reactionKor = targetState === "LIKE" ? "좋아요" : "싫어요";

        sendFeedback({
          user_id: userId,
          content_id: contentId,
          content_type: contentType,
          reaction_type: reactionKor,
          score: null,
          token: accessToken,
        });
      }

      // 리스트페이지 캐시 무효화 (모든 정렬 옵션 포함)
      queryClient.invalidateQueries({
        queryKey: ["allContents"],
      });

      // 상세페이지 캐시 무효화
      queryClient.invalidateQueries({
        queryKey: ["contentsDetail", contentId.toString(), contentType],
      });

      // 랭킹 캐시 무효화
      queryClient.invalidateQueries({
        queryKey: ["contentsRanking"],
      });

      // 검색 결과 캐시 무효화
      queryClient.invalidateQueries({
        queryKey: ["searchContents"],
      });

      // 필터 결과 캐시 무효화
      queryClient.invalidateQueries({
        queryKey: ["filteredContents"],
      });
    } catch (error) {
      console.error("반응 처리 실패:", error);

      // 에러 발생시 이전 상태로 롤백
      setReactionMap((prev) => ({
        ...prev,
        [contentId]: currentState,
      }));

      // 에러 처리 (toast 등으로 사용자에게 알림)
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    reactionMap,
    handleReaction,
    isLoading,
  };
};
