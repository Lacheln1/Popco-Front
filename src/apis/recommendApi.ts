import axios from "axios";
import recommendInstance from "./recommendInstance";
import {
  ContentBasedItem,
  ContentBasedResponse,
  PopcorithmResponse,
  RecommendationItem,
} from "@/types/Recommend.types";

// --- API 요청(Request)을 위한 타입 정의 ---
interface FeedbackItem {
  content_id: number;
  content_type: string;
}

interface InitialAnswers {
  [key: string]: string;
}

interface OnboardingRequest {
  feedback_items: FeedbackItem[];
  reaction_type: "좋아요";
  initial_answers: InitialAnswers;
}

// --- API 응답(Response)을 위한 타입 정의 ---
export interface OnboardingResponse {
  message: string;
  recommendations: Recommendation[];
  main_persona: string;
  sub_persona: string;
  all_personas_scores: { [key: string]: number };
}

interface Recommendation {
  contentId: number;
  title: string;
  genres: string[];
  type: string;
  poster_path: string;
  predicted_rating: number;
  persona_genre_match: boolean;
}

/**
 * 선호도 진단 결과를 제출하고 최종 페르소나를 받아오는 API
 */
export const getOnboardingPersona = async (
  params: OnboardingRequest,
  accessToken: string,
): Promise<OnboardingResponse> => {
  try {
    const response = await axios.post<OnboardingResponse>( // ✅ 타입 추론을 위해 제네릭 위치 변경
      "/api/client/recommends/personas/onboard",
      params,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      },
    );

    // ✅ [핵심 수정] response.data.data가 아닌 response.data를 반환합니다.
    return response.data;
  } catch (error) {
    console.error("페르소나 온보딩 실패:", error);
    throw error;
  }
};

export const fetchPopcorithm = async (
  userId: number,
  limit: number,
  token?: string,
): Promise<RecommendationItem[]> => {
  if (limit <= 0 || userId <= 0) {
    throw new Error("유효하지 않은 userId|limit 입니다.");
  }
  try {
    const endpoint = `/recommends/popcorithms/users/${userId}/limits/${limit}?user_id=${userId}`;
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const { data } = await recommendInstance.get<PopcorithmResponse>(endpoint, {
      headers,
    });
    return data.recommendations;
  } catch (error) {
    console.error("fetchPopcorithm 실패:", error);
    throw new Error("팝코리즘을 불러오는 데 실패했습니다.");
  }
};

export const fetchBasedContent = async (
  userId: number | null,
  type: string,
  token?: string,
): Promise<ContentBasedItem[]> => {
  try {
    const endpoint = `/recommends/contents`;
    const headers = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
    const body = {
      user_id: userId,
      type,
    };
    const { data } = await recommendInstance.post<ContentBasedResponse>(
      endpoint,
      body,
      { headers },
    );
    return data.recommendations;
  } catch (error) {
    console.error("fetchBasedContent 실패:", error);
    throw new Error("연관 작품을 불러오는 데 실패했습니다.");
  }
};
