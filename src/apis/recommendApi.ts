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
  user_id: number; // 추가: user_id도 포함
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
    console.log("🔍 온보딩 요청 디버그:", {
      url: "/client/recommends/personas/onboard", 
      params,
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    const response = await recommendInstance.post<OnboardingResponse>(
      "/recommends/personas/onboard",
      params,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json", 
        },
        withCredentials: true,
      },
    );

    console.log("✅ 온보딩 응답:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("❌ 페르소나 온보딩 실패 상세:", {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: error.config?.url,
      baseURL: error.config?.baseURL,
      headers: error.config?.headers,
    });
    throw error;
  }
};

export const getOnboardingPersonaAlternative = async (
  params: OnboardingRequest,
  accessToken: string,
): Promise<OnboardingResponse> => {
  try {
    // 환경변수에서 API Base URL을 가져옵니다
    const baseURL = import.meta.env.VITE_API_BASE_URL || process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';
    
    console.log("🔍 온보딩 요청 (대안) 디버그:", {
      baseURL,
      url: `${baseURL}/api/client/recommends/personas/onboard`,
      params,
    });

    const response = await axios.post<OnboardingResponse>(
      `${baseURL}/api/client/recommends/personas/onboard`, 
      params,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      },
    );

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