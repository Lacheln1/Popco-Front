import axiosInstance from "./axiosInstance";
import axios from "axios";

interface FeedbackItem {
  content_id: number;
  content_type: string;
}

interface InitialAnswers {
  [key: string]: string; // 예: { "1": "3", "2": "1" } (질문ID: 답변ID)
}

interface OnboardingRequest {
  feedback_items: FeedbackItem[];
  reaction_type: "좋아요"; // 선호도 조사에서는 '좋아요'로 고정
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
    const response = await axios.post<{ data: OnboardingResponse }>(
      "/api/client/recommend/persona/onboard",
      params,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      },
    );
    return response.data.data;
  } catch (error) {
    console.error("페르소나 온보딩 실패:", error);
    throw error;
  }
};
