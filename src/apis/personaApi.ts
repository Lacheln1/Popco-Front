import { PersonaRecommendation, PersonaResponse } from "@/types/Persona.types";
import axios from "axios";
import recommendInstance from "./recommendInstance";

const API_URL = "/api/client";
interface QuestionOption {
  optionId: number;
  content: string;
}

export interface QuestionData {
  questionId: number;
  content: string;
  options: QuestionOption[];
}

export const getQuizQuestion = async (
  questionNumber: number,
  accessToken: string,
): Promise<QuestionData> => {
  try {
    const response = await axios.get<{ data: QuestionData }>(
      `/api/client/personas/question/${questionNumber}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`, // 헤더에 토큰 직접 추가
        },
        withCredentials: true,
      },
    );
    return response.data.data;
  } catch (error) {
    console.error(`Failed to fetch question ${questionNumber}:`, error);
    throw error;
  }
};

export const fetchHeroPersona = async (
  userId: number,
  token?: string,
  contentType?: "movie" | "tv" | "all",
): Promise<{
  main_persona: string;
  recommendations: PersonaRecommendation[];
}> => {
  const queryParam =
    contentType && contentType !== "all" ? `?content_type=${contentType}` : "";
  const { data } = await recommendInstance.get<PersonaResponse>(
    `/recommends/personas/users/${userId}/recommendations${queryParam}?user_id=${userId}`,
    {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    },
  );
  return {
    main_persona: data.main_persona,
    recommendations: data.recommendations,
  };
};

export const getPersonaText = async (accessToken: string) => {
  try {
    const response = await axios.get(`${API_URL}/personas/texts`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("getPersonaText 실패:", error);
    throw error;
  }
};
