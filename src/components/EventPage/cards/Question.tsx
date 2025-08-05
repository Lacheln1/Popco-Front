import { useEffect } from "react";
import { useQuizStore } from "@/stores/useQuizStore";
import axiosInstance from "@/apis/axiosInstance";
import { subscribeToQuestion } from "@/utils/socket";
import useAuthCheck from "@/hooks/useAuthCheck";
import { RawQuestionResponse } from "@/types/Quiz.types";
import { mapRawQuestionToClientFormat } from "@/utils/mapper";

interface ApiResponse<T> {
  code: number;
  result: string;
  message: string;
  data: T;
}

export const Question = () => {
  const {
    quizId,
    questionId,
    questionData,
    hasSubmitted,
    setHasSubmitted,
    setQuestionData,
    updateTimer,
    updateSurvivors,
    setStep,
  } = useQuizStore();

  const { accessToken } = useAuthCheck();
  console.log("📋 Question component:", {
    quizId,
    questionId,
    accessToken: !!accessToken,
    questionData: !!questionData,
    hasSubmitted,
  });

  // 1. 문제 데이터 불러오기
  const loadQuestionData = async () => {
    if (!quizId || !accessToken) {
      console.log("❌ loadQuestionData 조건 미충족:", {
        quizId,
        accessToken: !!accessToken,
      });
      return;
    }

    console.log("🚀 API 호출 시작:", { quizId, questionId });

    try {
      const res = await axiosInstance.get<ApiResponse<RawQuestionResponse>>(
        `/quizzes/${quizId}/questions/${questionId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      const formatted = mapRawQuestionToClientFormat(res.data.data);
      setQuestionData(formatted);
    } catch (err) {
      console.error("문제 불러오기 실패", err);
    }
  };

  // 2. 서버 브로드캐스트 수신 처리
  const handleServerMessage = (data: any) => {
    if (data.remainingTime !== undefined) {
      updateTimer(data.remainingTime);
    }
    if (
      data.currentSurvivors !== undefined &&
      data.maxSurvivors !== undefined
    ) {
      updateSurvivors(data.currentSurvivors, data.maxSurvivors);
    }
    if (data.type === "QUESTION_TIMEOUT") {
      setStep("eliminated");
    }
    if (data.type === "NEXT_QUESTION") {
      const { setQuestionId, setStep, setHasSubmitted } =
        useQuizStore.getState();
      console.log("📢 다음 문제로 이동:", data.questionId);

      setHasSubmitted(false);
      setQuestionId(data.questionId);
      setStep("question");
    }
  };

  // 3. 초기 로드 및 소켓 구독
  useEffect(() => {
    if (!quizId || !questionId || !accessToken) {
      console.log("❌ Missing dependencies:", {
        quizId,
        questionId,
        accessToken: !!accessToken,
      });
      return;
    }
    loadQuestionData();

    // 소켓 메시지 수신 설정
    const unsubscribe = subscribeToQuestion(
      quizId,
      questionId,
      handleServerMessage,
    );
    return () => {
      unsubscribe?.();
    };
  }, [quizId, questionId, accessToken]);

  // 4. 정답 제출
  const submitAnswer = async (optionId: number) => {
    if (hasSubmitted || !quizId || !accessToken) return;
    setHasSubmitted(true);
    try {
      const res = await axiosInstance.post(
        `/quizzes/${quizId}/questions/${questionId}`,
        { optionId },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      const { survived } = res.data.data;
      setStep(survived ? "waiting" : "eliminated");
    } catch (err) {
      console.error("답안 제출 실패", err);
      setHasSubmitted(false);
    }
  };

  if (!questionData) {
    console.log("No questionData - showing loading");
    return <div>문제 불러오는 중...</div>;
  }
  console.log("Rendering question:", questionData.content);

  return (
    <div className="flex flex-col items-center justify-center px-4 pt-12 text-center">
      <h2 className="mb-4 text-lg font-semibold">
        문제 {questionData.questionId}
      </h2>
      <p className="mb-6 text-xl">{questionData.content}</p>

      <div className="flex flex-col gap-3">
        {questionData?.options?.map((opt) => (
          <button
            key={opt.id}
            disabled={hasSubmitted}
            className="rounded-md bg-black px-8 py-2 text-white hover:bg-gray-800 disabled:bg-gray-300"
            onClick={() => submitAnswer(opt.id + 1)}
          >
            {opt.content}
          </button>
        ))}
      </div>
    </div>
  );
};
