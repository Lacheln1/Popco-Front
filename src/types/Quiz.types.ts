export interface QuizOption {
  id: number;
  content: string;
}

export interface QuestionData {
  questionId: number;
  content: string;
  firstCapacity: number;
  options: QuizOption[];
}

export interface ServerBroadcast {
  type?: "QUESTION_START" | "QUESTION_TIMEOUT";
  remainingTime?: number;
  currentSurvivors?: number;
  maxSurvivors?: number;
}

// 퀴즈 정보
export interface QuizDetail {
  quizId: number;
  quizName: string;
  quizContentPosterUrl: string;
  quizReward: string;
  quizRoundCount: number;
  quizStartTime: string;
  serverTime: string;
}

export interface FetchQuizResponse {
  quizDetail: QuizDetail;
  quizPageAccess: boolean;
}
