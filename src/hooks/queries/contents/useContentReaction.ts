import { useEffect, useState } from "react";
import { useSendContentFeedback } from "@/hooks/queries/contents/useSendContentFeedback";
import { ReactionType } from "@/types/Contents.types";

interface UseContentReactionOptions {
  userId: number;
  accessToken: string;
  contentList: { id: number; reaction?: ReactionType }[];
}

export const useContentReaction = ({
  userId,
  accessToken,
  contentList,
}: UseContentReactionOptions) => {
  const { mutate: sendFeedback } = useSendContentFeedback();
  const [reactionMap, setReactionMap] = useState<Record<number, ReactionType>>(
    {},
  );

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
