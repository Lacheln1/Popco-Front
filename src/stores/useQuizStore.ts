import { QuestionData, QuizStatus, WinnerInfo } from "@/types/Quiz.types";
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
  quizStatus: QuizStatus | null;
  winnerInfo: WinnerInfo | null;

  // Actions
  setQuizStatus: (status: QuizStatus) => void;
  setQuizId: (id: number) => void;
  nextQuestion: () => void;
  setQuestionId: (id: number) => void;
  setQuestionData: (data: QuestionData) => void;
  setConnected: (flag: boolean) => void;
  setSubscribed: (flag: boolean) => void;
  setHasSubmitted: (flag: boolean) => void;
  updateTimer: (time: number) => void;
  updateSurvivors: (current: number, max: number) => void;
  setWinnerInfo: (info: WinnerInfo) => void;
  reset: () => void;
}

export const useQuizStore = create<QuizStore>((set) => ({
  // Initial state
  quizId: 1,
  questionId: 2,
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
  quizStatus: null,
  winnerInfo: null,

  // Actions
  setStep: (step) => set({ step }),
  setQuizId: (id) => set({ quizId: id }),
  setQuestionId: (id: number) => set({ questionId: id }),
  nextQuestion: () =>
    set((state) => {
      const nextId = state.questionId + 1;
      const totalQuestions = 3;

      if (nextId > totalQuestions) {
        return {
          questionId: state.questionId,
          step: "winner", // 최종 우승 상태
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
  setQuizStatus: (status) => set({ quizStatus: status }),
  setWinnerInfo: (info) => set({ winnerInfo: info }),
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
      quizStatus: null,
      winnerInfo: null,
    }),
}));
