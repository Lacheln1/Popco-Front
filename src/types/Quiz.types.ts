export interface QuizOption {
  id: number;
  content: string;
}

export interface RawQuestionResponse {
  quizId: number;
  questionId: number;
  content: string;
  quizQuestionId: number;
  firstCapacity: number;
  options: RawOption[];
}

export interface RawOption {
  content: string;
  isCorrect: boolean;
}

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

export type QuizStatus = "WAITING" | "FINISHED" | "ACTIVE";

export interface QuizStatusSocketData {
  quizId: number;
  questionId: number;
  currentSurvivors: number;
  maxSurvivors: number;
  isActive: boolean;
  remainingTime: number;
  isTimerRunning: boolean;
  timerStartedAt: number;
  status: QuizStatus;
}

export interface WinnerInfo {
  type: "WINNER_ANNOUNCED";
  winnerName: string;
  winnerRank: number;
  message: string;
}

export interface WinnerAnnouncedData {
  type: "WINNER_ANNOUNCED";
  winnerName: string;
  winnerRank: number;
  message: string;
  remainingTime?: number;
  currentSurvivors?: number;
  maxSurvivors?: number;
}

// 우승자 정보 (Store용 - type 필드 없음)
export interface WinnerInfo {
  winnerName: string;
  winnerRank: number;
  message: string;
}

// 기존 QuizResponseData 수정 (기본 응답 데이터)
export interface BaseQuizResponseData {
  quizId: number;
  questionId: number;
  type: string;
  message: string;
  remainingTime?: number;
  currentSurvivors?: number;
  maxSurvivors?: number;
}

// Union 타입으로 모든 응답 데이터 통합
export type QuizResponseData = BaseQuizResponseData | WinnerAnnouncedData;
