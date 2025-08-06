import { create } from "zustand";
import { fetchLikedFeedback } from "@/apis/recommendApi";

type LikeState = "LIKE" | "DISLIKE" | "NEUTRAL";

interface LikeStore {
  // 상태: contentId별로 좋아요/싫어요 상태 저장
  reactions: Record<string, LikeState>;

  // 액션들
  setReaction: (
    contentId: number,
    contentType: string,
    state: LikeState,
  ) => void;
  updateReaction: (
    contentId: number,
    contentType: string,
    newState: LikeState,
    userId: number,
    accessToken: string,
  ) => Promise<void>;
  getReaction: (contentId: number, contentType: string) => LikeState;
}

// 컨텐츠 고유키 생성 (contentId와 contentType 조합)
const getContentKey = (contentId: number, contentType: string) =>
  `${contentType}-${contentId}`;

export const useLikeStore = create<LikeStore>((set, get) => ({
  reactions: {},

  // 상태 직접 설정
  setReaction: (contentId, contentType, state) => {
    const key = getContentKey(contentId, contentType);
    set((store) => ({
      reactions: { ...store.reactions, [key]: state },
    }));
  },

  // 상태 업데이트 + API 호출
  updateReaction: async (
    contentId,
    contentType,
    newState,
    userId,
    accessToken,
  ) => {
    const key = getContentKey(contentId, contentType);
    const currentState = get().reactions[key] || "NEUTRAL";

    // 같은 상태면 NEUTRAL로, 다른 상태면 새로운 상태로
    const finalState = currentState === newState ? "NEUTRAL" : newState;

    try {
      // API 호출을 위한 reaction_type 매핑
      let reactionType: string;
      switch (finalState) {
        case "LIKE":
          reactionType = "좋아요";
          break;
        case "DISLIKE":
          reactionType = "싫어요";
          break;
        case "NEUTRAL":
          reactionType = "중립";
          break;
        default:
          reactionType = "중립";
      }

      // API 호출
      await fetchLikedFeedback(
        userId,
        contentId,
        contentType,
        reactionType,
        undefined,
        accessToken,
      );

      // 성공 시 상태 업데이트
      set((store) => ({
        reactions: { ...store.reactions, [key]: finalState },
      }));
    } catch (error) {
      console.error("좋아요/싫어요 처리 실패:", error);
      throw error; // 컴포넌트에서 에러 처리하도록
    }
  },

  // 상태 조회
  getReaction: (contentId, contentType) => {
    const key = getContentKey(contentId, contentType);
    return get().reactions[key] || "NEUTRAL";
  },
}));
