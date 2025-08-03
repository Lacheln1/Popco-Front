import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSendContentFeedback } from "@/hooks/queries/contents/useSendContentFeedback";
import { ReactionType } from "@/types/Contents.types";

interface UseContentReactionOptions {
  userId: number;
  accessToken: string;
  contentList: { id: number; reaction?: ReactionType }[];
  invalidateQueryKey?: unknown[];
}

export const useContentReaction = ({
  userId,
  accessToken,
  contentList,
  invalidateQueryKey,
}: UseContentReactionOptions) => {
  const queryClient = useQueryClient();
  const { mutate: sendFeedback } = useSendContentFeedback();

  const [reactionMap, setReactionMap] = useState<Record<number, ReactionType>>(
    {},
  );
  const initializedRef = useRef(false);

  useEffect(() => {
    if (contentList.length > 0) {
      const initialMap = contentList.reduce(
        (acc, cur) => {
          acc[cur.id] = cur.reaction ?? "NEUTRAL";
          return acc;
        },
        {} as Record<number, ReactionType>,
      );
      setReactionMap(initialMap);
    }
  }, [contentList]);

  const handleReaction = (
    contentId: number,
    newState: ReactionType,
    contentType: string,
  ) => {
    setReactionMap((prev) => ({
      ...prev,
      [contentId]: newState,
    }));

    const reactionKor =
      newState === "LIKE" ? "좋아요" : newState === "DISLIKE" ? "싫어요" : null;

    if (reactionKor) {
      sendFeedback({
        user_id: userId,
        content_id: contentId,
        content_type: contentType,
        reaction_type: reactionKor,
        score: null,
        token: accessToken,
      });
    }
  };

  return {
    reactionMap,
    handleReaction,
  };
};
