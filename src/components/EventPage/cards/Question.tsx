import { useEffect, useState, useRef } from "react";
import { useQuizStore } from "@/stores/useQuizStore";
import axiosInstance from "@/apis/axiosInstance";
import { connectSocket, subscribeToQuestion } from "@/utils/socket";
import useAuthCheck from "@/hooks/useAuthCheck";
import { QuizStatusSocketData, RawQuestionResponse } from "@/types/Quiz.types";
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
    timer: remainingTime,
    survivors,
    setQuestionId,
  } = useQuizStore();

  const { accessToken } = useAuthCheck();
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 구독 관리를 위한 ref
  const subscriptionRef = useRef<(() => void) | null>(null);

  // 문제 데이터 불러오기
  const loadQuestionData = async () => {
    if (!quizId || !questionId || !accessToken) return;

    try {
      const res = await axiosInstance.get<ApiResponse<RawQuestionResponse>>(
        `/quizzes/${quizId}/questions/${questionId}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );
      const formatted = mapRawQuestionToClientFormat(res.data.data);
      setQuestionData(formatted);
    } catch (err) {
      console.error("문제 불러오기 실패", err);
    }
  };

  // 소켓 메시지 처리
  const handleSocketMessage = (data: QuizStatusSocketData) => {
    console.log("🔄 QuizStatusSocketData 수신:", data);

    // 타이머 업데이트
    if (typeof data.remainingTime === "number") {
      updateTimer(data.remainingTime);
    }

    // 생존자 수 업데이트
    if (
      typeof data.currentSurvivors === "number" &&
      typeof data.maxSurvivors === "number"
    ) {
      updateSurvivors(data.currentSurvivors, data.maxSurvivors);
    }

    // 상태별 처리
    switch (data.status) {
      case "FINISHED":
        console.log("🏁 퀴즈 종료 상태");
        if (!data.isActive) {
          console.log("🏆 퀴즈 완전 종료 - 우승자 화면으로");
          setStep("winner");
        } else {
          console.log("⏰ 라운드 종료 - 탈락 또는 대기");
          setStep(hasSubmitted ? "waiting" : "eliminated");
        }
        break;

      case "ACTIVE":
        console.log("🚀 퀴즈 활성 상태");
        if (data.questionId && data.questionId !== questionId) {
          console.log("📢 다음 문제로 이동:", data.questionId);
          // 새 문제 초기화
          setQuestionId(data.questionId);
          setSelectedAnswer(null);
          setHasSubmitted(false);
          setStep("question");
        }
        break;

      case "WAITING":
        console.log("⏳ 대기 상태");
        break;

      default:
        console.log("❓ 알 수 없는 상태:", data.status);
    }

    // 퀴즈 상태 업데이트
    if (data.status) {
      useQuizStore.getState().setQuizStatus(data.status);
    }
  };

  // 소켓 구독 설정
  const setupSubscription = () => {
    if (!quizId || !questionId || !accessToken) return;

    try {
      // 기존 구독 해제
      if (subscriptionRef.current) {
        subscriptionRef.current();
        subscriptionRef.current = null;
      }

      const unsubscribe = subscribeToQuestion(
        quizId,
        questionId,
        handleSocketMessage,
      );
      if (unsubscribe) {
        subscriptionRef.current = unsubscribe;
        console.log("✅ 소켓 구독 성공");
      } else {
        console.error("❌ 소켓 구독 실패 - unsubscribe 함수가 반환되지 않음");
      }
    } catch (error) {
      console.error("❌ 소켓 구독 중 오류:", error);
    }
  };

  // 초기 로드 및 소켓 구독
  useEffect(() => {
    if (!quizId || !questionId || !accessToken) return;

    const setup = async () => {
      try {
        await connectSocket(accessToken); // 1. 연결
        console.log("✅ 소켓 연결됨");

        setupSubscription(); // 2. 구독 시작
        loadQuestionData(); // 3. 문제 데이터 불러오기
      } catch (e) {
        console.error("❌ 소켓 연결 실패", e);
      }
    };

    setup();

    return () => {
      // cleanup (기존 구독 해제)
      if (subscriptionRef.current) {
        subscriptionRef.current();
        subscriptionRef.current = null;
      }
    };
  }, [quizId, questionId, accessToken]);

  // 새 문제 시작시 상태 초기화
  useEffect(() => {
    setSelectedAnswer(null);
    setIsSubmitting(false);
  }, [questionId]);

  // 답안 선택
  const selectAnswer = (optionId: number) => {
    if (hasSubmitted || isSubmitting) return; // 제출 후에는 선택 불가
    setSelectedAnswer(optionId);
  };

  // 정답 제출
  const submitAnswer = async () => {
    if (selectedAnswer === null || !quizId || !accessToken || hasSubmitted) {
      return;
    }

    setIsSubmitting(true);
    setHasSubmitted(true);

    try {
      const res = await axiosInstance.post(
        `/quizzes/${quizId}/questions/${questionId}`,
        { optionId: selectedAnswer + 1 },
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );

      const { survived } = res.data.data;
      console.log(`📝 답안 제출 결과: ${survived ? "생존" : "탈락"}`);

      // 제출 후 결과에 따라 상태 변경은 소켓 메시지로 처리됨
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

  const currentSurvivors = survivors.current;
  const maxSurvivors = survivors.max;
  const survivorPercentage =
    maxSurvivors > 0 ? (currentSurvivors / maxSurvivors) * 100 : 0;
  const isTimerActive = remainingTime > 0;

  return (
    <aside className="absolute left-1/2 top-[31%] z-10 flex w-[85%] -translate-x-1/2 -translate-y-1/3 flex-col items-center justify-center break-keep rounded-2xl bg-white/95 px-4 py-8 shadow-2xl backdrop-blur-lg md:h-[520px] md:w-[800px] md:px-8">
      <div className="flex h-full w-full flex-col items-center justify-center p-4 text-center">
        {/* 상단 정보바 */}
        <div className="flex w-full items-center justify-between">
          {/* 타이머 */}
          <div className="flex items-center gap-3 rounded-full px-4 py-2 transition-all duration-300">
            <IoTimeOutline className="h-6 w-6" />
            <span className="text-lg font-bold">
              {isTimerActive ? `${remainingTime}초` : "대기 중"}
            </span>
          </div>

          {/* 문제 번호 */}
          <div className="text-2xl font-bold text-gray-800">
            Quiz {questionId} / 3
          </div>

          {/* 생존자 정보 */}
          <div className="flex flex-col items-end">
            <div className="mb-2 flex items-center gap-2">
              <FiUsers className="h-5 w-5 text-indigo-600" />
              <span className="text-lg font-semibold text-gray-700">
                생존자
              </span>
              <span className="text-2xl font-bold text-indigo-600">
                {currentSurvivors.toLocaleString()}
              </span>
              <span className="text-sm text-gray-500">
                / {maxSurvivors.toLocaleString()}
              </span>
            </div>
            <div className="h-3 w-32 overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full rounded-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-1000 ease-out"
                style={{ width: `${survivorPercentage}%` }}
              />
            </div>
            <div className="mt-1 text-sm text-gray-500">
              {survivorPercentage.toFixed(1)}% 남음
            </div>
          </div>
        </div>

        {/* 문제 */}
        <h3 className="mb-6 text-xl leading-snug text-gray-800 lg:text-2xl">
          {questionData.content}
        </h3>

        {/* 선택지 */}
        <div className="mb-8 grid w-full max-w-2xl gap-3 md:w-2/3">
          {questionData?.options?.map((opt, index) => (
            <button
              key={opt.id}
              onClick={() => selectAnswer(opt.id)}
              disabled={hasSubmitted || isSubmitting}
              className={`group relative transform overflow-hidden rounded-xl p-4 text-left font-medium transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100 ${
                selectedAnswer === opt.id
                  ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg"
                  : "bg-gradient-to-r from-gray-800 to-gray-900 text-white shadow-md hover:from-purple-500 hover:to-purple-600 hover:shadow-lg"
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-all ${
                    selectedAnswer === opt.id
                      ? "scale-110 bg-white/30"
                      : "bg-white/20 group-hover:scale-105 group-hover:bg-white/30"
                  }`}
                >
                  {String.fromCharCode(65 + index)}
                </div>
                <span className="text-base font-medium">{opt.content}</span>
              </div>
            </button>
          ))}
        </div>

        {/* 제출 버튼 */}
        <button
          onClick={submitAnswer}
          disabled={selectedAnswer === null || hasSubmitted || isSubmitting}
          className="transform rounded-full bg-gradient-to-r from-blue-600 to-blue-700 px-12 py-4 text-base font-bold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-blue-700 hover:to-blue-800 hover:shadow-xl active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              제출 중...
            </div>
          ) : hasSubmitted ? (
            "제출 완료!"
          ) : selectedAnswer === null ? (
            "답을 선택해주세요"
          ) : (
            "정답 제출하기"
          )}
        </button>
      </div>
    </aside>
  );
};
