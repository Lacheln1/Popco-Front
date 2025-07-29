// src/apis/personaApi.ts

import axiosInstance from "./axiosInstance";

// API 응답 데이터 타입을 정의합니다.
interface QuestionOption {
  optionId: number;
  content: string;
}

export interface QuestionData {
  questionId: number;
  content: string;
  options: QuestionOption[];
}

/**
 * 지정된 번호의 페르소나 질문을 가져오는 API
 * @param questionNumber - 가져올 질문 번호 (1~5)
 */
export const getQuizQuestion = async (questionNumber: number): Promise<QuestionData> => {
  try {
    const response = await axiosInstance.get<{ data: QuestionData }>(
      `/personas/question/${questionNumber}`
    );
    return response.data.data;
  } catch (error) {
    console.error(`Failed to fetch question ${questionNumber}:`, error);
    throw error;
  }
};