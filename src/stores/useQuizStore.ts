import { QuestionData } from "@/types/Quiz.types";
import { create } from "zustand";

type QuizStep = "entry" | "question" | "waiting" | "eliminated" | "winner";

interface QuizStore {
  step: QuizStep;
  setStep: (step: QuizStep) => void;
  quizId: number | null;
  questionId: number;
  questionData: QuestionData | null;
  isConnected: boolean;
  isSubscribed: boolean;
  hasSubmitted: boolean;
  timer: number;
  survivors: {
    current: number;
    max: number;
  };

  setQuizId: (id: number) => void;
  nextQuestion: () => void;
  setQuestionData: (data: QuestionData) => void;
  setConnected: (flag: boolean) => void;
  setSubscribed: (flag: boolean) => void;
  setHasSubmitted: (flag: boolean) => void;
  updateTimer: (time: number) => void;
  updateSurvivors: (current: number, max: number) => void;
  reset: () => void;
}

export const useQuizStore = create<QuizStore>((set) => ({
  quizId: 1,
  questionId: 1,
  step: "entry",
  questionData: null,
  isConnected: false,
  isSubscribed: false,
  hasSubmitted: false,
  timer: 0,
  survivors: {
    current: 0,
    max: 0,
  },

  setStep: (step) => set({ step }),
  setQuizId: (id) => set({ quizId: id }),
  nextQuestion: () =>
    set((state) => {
      const nextId = state.questionId + 1;
      if (nextId > 3) {
        return {
          questionId: state.questionId,
          step: "winner", // 🎯 최종 우승 상태
          hasSubmitted: false,
          timer: 0,
        };
      } else {
        return {
          questionId: nextId,
          step: "question",
          hasSubmitted: false,
          timer: 0,
        };
      }
    }),
  setQuestionData: (data) => set({ questionData: data }),
  setConnected: (flag) => set({ isConnected: flag }),
  setSubscribed: (flag) => set({ isSubscribed: flag }),
  setHasSubmitted: (flag) => set({ hasSubmitted: flag }),
  updateTimer: (time) => set({ timer: time }),
  updateSurvivors: (current, max) => set({ survivors: { current, max } }),
  reset: () =>
    set({
      quizId: null,
      questionId: 1,
      step: "entry", // 초기화 시 step도 되돌리기
      questionData: null,
      isConnected: false,
      isSubscribed: false,
      hasSubmitted: false,
      timer: 0,
      survivors: { current: 0, max: 0 },
    }),
}));
