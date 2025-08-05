import { useEffect, useState } from "react";
import { useQuizStore } from "@/stores/useQuizStore";
import axiosInstance from "@/apis/axiosInstance";
import { subscribeToQuestion } from "@/utils/socket";
import useAuthCheck from "@/hooks/useAuthCheck";
import { RawQuestionResponse } from "@/types/Quiz.types";
import { mapRawQuestionToClientFormat } from "@/utils/mapper";
import { IoTimeOutline } from "react-icons/io5";
import { FiUsers } from "react-icons/fi";

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
    remainingTime,
    currentSurvivors,
    maxSurvivors,
    currentQuestionIndex,
    totalQuestions,
  } = useQuizStore();

  const { accessToken } = useAuthCheck();
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. 문제 데이터 불러오기
  const loadQuestionData = async () => {
    if (!quizId || !accessToken) {
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
      setTimeout(() => {
        const { step, setQuestionId, setStep, setHasSubmitted } =
          useQuizStore.getState();
        if (step !== "waiting") return;
        console.log("📢 다음 문제로 이동:", data.questionId);
        setHasSubmitted(false);
        setSelectedAnswer(null); // 선택 초기화
        setQuestionId(data.questionId);
        setStep("question");
      }, 50);
    }
  };

  // 3. 초기 로드 및 소켓 구독
  useEffect(() => {
    if (!quizId || !questionId || !accessToken) {
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

  // 4. 답안 선택
  const selectAnswer = (optionId: number) => {
    if (!hasSubmitted && !isSubmitting) {
      setSelectedAnswer(optionId);
    }
  };

  // 5. 정답 제출
  const submitAnswer = async () => {
    if (
      hasSubmitted ||
      selectedAnswer === null ||
      !quizId ||
      !accessToken ||
      isSubmitting
    )
      return;

    setIsSubmitting(true);
    setHasSubmitted(true);

    try {
      const res = await axiosInstance.post(
        `/quizzes/${quizId}/questions/${questionId}`,
        { optionId: selectedAnswer },
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
      setSelectedAnswer(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 로딩 상태
  if (!questionData) {
    return (
      <aside className="absolute left-1/2 top-[31%] z-10 flex w-[85%] -translate-x-1/2 -translate-y-1/3 flex-col items-center justify-center break-keep rounded-xl bg-white/90 px-4 py-8 shadow-xl backdrop-blur-md md:h-[520px] md:w-[800px] md:px-8">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600"></div>
          <p className="text-base text-gray-600">문제 불러오는 중...</p>
        </div>
      </aside>
    );
  }

  const survivorPercentage =
    maxSurvivors > 0 ? (currentSurvivors / maxSurvivors) * 100 : 0;
  const eliminationRate =
    maxSurvivors > 0
      ? Math.round(((maxSurvivors - currentSurvivors) / maxSurvivors) * 100)
      : 0;

  return (
    <aside className="absolute left-1/2 top-[31%] z-10 flex w-[85%] -translate-x-1/2 -translate-y-1/3 flex-col items-center justify-center break-keep rounded-2xl bg-white/95 px-4 py-8 shadow-2xl backdrop-blur-lg md:h-[520px] md:w-[800px] md:px-8">
      <div className="flex h-full w-full flex-col items-center justify-center p-4 text-center">
        <div className="flex w-full items-center justify-between">
          {/* 왼쪽 - 타이머 */}
          <div className="flex w-1/3 flex-1 justify-start">
            <div
              className={`flex items-center gap-3 rounded-full px-4 py-2 shadow-lg transition-all duration-300 ${
                remainingTime <= 5
                  ? "animate-pulse bg-gradient-to-r from-red-500 to-red-600"
                  : remainingTime <= 10
                    ? "bg-gradient-to-r from-orange-500 to-red-500"
                    : "bg-gradient-to-r from-blue-500 to-purple-500"
              }`}
            >
              <IoTimeOutline className="h-6 w-6 text-white" />
              <span className="text-lg text-white">{remainingTime}초</span>
            </div>
          </div>

          {/* 가운데 - 퀴즈 진행상황 */}
          <div className="flex w-1/3 flex-1 justify-center text-2xl font-bold text-gray-800">
            Quiz {questionId} / {totalQuestions}
          </div>

          {/* 오른쪽 - 생존자 정보 */}
          <div className="flex w-1/3 flex-1 justify-end">
            <div className="flex w-full flex-col items-end">
              <div className="mb-2 flex items-center gap-2">
                <FiUsers className="h-5 w-5 text-indigo-600" />
                <span className="text-lg font-semibold text-gray-700">
                  생존자
                </span>
                <span className="text-2xl font-bold text-indigo-600">
                  {currentSurvivors}
                </span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200">
                <div
                  className={`h-full rounded-full transition-all duration-500 ease-out ${
                    survivorPercentage > 70
                      ? "bg-gradient-to-r from-green-400 to-green-600"
                      : survivorPercentage > 40
                        ? "bg-gradient-to-r from-yellow-400 to-orange-500"
                        : "bg-gradient-to-r from-red-400 to-red-600"
                  }`}
                  style={{ width: `${survivorPercentage}%` }}
                />
              </div>
              <div className="mt-1 text-sm text-gray-500">
                {survivorPercentage.toFixed(0)}% 남음
              </div>
            </div>
          </div>
        </div>

        {/* 질문 텍스트 */}
        <h3 className="text-xl leading-snug text-gray-800 lg:text-2xl">
          {questionData.content}
        </h3>

        {/* 답변 선택지 */}
        <div className="mb-8 grid w-full max-w-2xl gap-3">
          {questionData?.options?.map((opt, index) => (
            <button
              key={opt.id}
              disabled={hasSubmitted || isSubmitting}
              onClick={() => selectAnswer(opt.id)}
              className={`group relative transform overflow-hidden rounded-xl p-4 text-left font-medium transition-all duration-300 focus:scale-[1.02] ${
                hasSubmitted || isSubmitting
                  ? "cursor-not-allowed bg-gray-200 text-gray-500"
                  : selectedAnswer === opt.id
                    ? "bg-popco-main text-white shadow-lg"
                    : "bg-gradient-to-r from-gray-800 to-gray-900 text-white shadow-md"
              } ${
                !hasSubmitted &&
                !isSubmitting &&
                selectedAnswer !== opt.id &&
                "hover:from-gray-600"
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-sm font-bold ${
                    hasSubmitted || isSubmitting
                      ? "bg-gray-300"
                      : selectedAnswer === opt.id
                        ? "bg-white/30"
                        : "bg-white/20"
                  }`}
                >
                  {String.fromCharCode(65 + index)}
                </div>
                <span className="text-base">{opt.content}</span>
              </div>
            </button>
          ))}
        </div>

        {/* 정답 제출 버튼 */}
        <button
          onClick={submitAnswer}
          disabled={selectedAnswer === null || hasSubmitted || isSubmitting}
          className={`transform rounded-full px-12 py-4 text-base transition-all duration-300 ${
            selectedAnswer === null || hasSubmitted || isSubmitting
              ? "cursor-not-allowed bg-gray-200 text-gray-400"
              : "bg-footerBlue cursor-pointer text-white hover:bg-black"
          }`}
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              제출 중...
            </div>
          ) : hasSubmitted ? (
            "제출 완료!"
          ) : selectedAnswer === null ? (
            "답 선택 후 제출"
          ) : (
            "정답 제출하기"
          )}
        </button>
      </div>
    </aside>
  );
};
