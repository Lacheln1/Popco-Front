import axios from "axios";

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
