import { FetchQuizResponse } from "@/types/Quiz.types";
import axiosInstance from "./axiosInstance";

export const fetchQuizInfo = async (
  token: string,
): Promise<FetchQuizResponse> => {
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  const { data } = await axiosInstance.get(`/quizzes`, {
    headers,
  });
  return data.data;
};
