import { useEffect, useState, useRef } from "react";
import { useQuizStore } from "@/stores/useQuizStore";
import axiosInstance from "@/apis/axiosInstance";
import { connectSocket, subscribeToQuestion } from "@/utils/socket";
import useAuthCheck from "@/hooks/useAuthCheck";
import {
  QuizResponseData,
  QuizStatusSocketData,
  RawQuestionResponse,
} from "@/types/Quiz.types";
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
    setWinnerInfo,
    step,
  } = useQuizStore();

  const { accessToken } = useAuthCheck();
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCorrectOverlay, setShowCorrectOverlay] = useState(false);
  const [isSurvived, setIsSurvived] = useState(false);
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

  // 소켓 구독 설정
  const setupSubscription = () => {
    if (!quizId || !questionId || !accessToken) return;

    try {
      // 기존 구독 해제
      if (subscriptionRef.current) {
        subscriptionRef.current();
        subscriptionRef.current = null;
        console.log(`🔄 기존 구독 해제`);
      }

      console.log(`🔗 새 구독 시작: question/${questionId}`);
      const unsubscribe = subscribeToQuestion(
        quizId,
        questionId,
        handleSocketMessage,
      );

      if (unsubscribe) {
        subscriptionRef.current = unsubscribe;
        console.log(
          `✅ 구독 성공: /topic/quiz/${quizId}/question/${questionId}`,
        );
      }
    } catch (error) {
      console.error("소켓 구독 중 오류:", error);
    }
  };

  // 소켓 메시지 처리 (개선된 버전)
  const handleSocketMessage = (
    data: QuizStatusSocketData | QuizResponseData,
  ) => {
    console.log("소켓 메시지 수신:", data);

    // 공통 처리: 타이머/생존자
    if ("remainingTime" in data && typeof data.remainingTime === "number") {
      updateTimer(data.remainingTime);
    }

    if (
      "currentSurvivors" in data &&
      typeof data.currentSurvivors === "number" &&
      typeof data.maxSurvivors === "number"
    ) {
      updateSurvivors(data.currentSurvivors, data.maxSurvivors);
    }

    const status = "status" in data ? data.status : data.type;
    console.log(
      "처리할 상태:",
      status,
      "isSurvived:",
      isSurvived,
      "hasSubmitted:",
      hasSubmitted,
    );

    switch (status) {
      case "ACTIVE":
        if ("questionId" in data && data.questionId !== questionId) {
          console.log(`🔄 문제 변경: ${questionId} → ${data.questionId + 1}`);
          const newQuestionId = data.questionId + 1;

          // 상태 초기화
          setSelectedAnswer(null);
          setHasSubmitted(false);
          setShowCorrectOverlay(false);
          setIsSubmitting(false);
          setIsSurvived(false); // 생존 상태도 초기화

          // 새 문제 ID 설정
          setQuestionId(newQuestionId);
          setStep("question");
        } else {
          // 현재 문제가 활성화된 경우
          setStep("question");
        }
        break;

      case "QUESTION_START":
        console.log("📢 문제 시작");
        // socket.ts에서 이미 처리되므로 추가 로직 없음
        break;

      case "FINISHED":
        console.log("🎉 퀴즈 완료");
        if (questionId === 3) {
          // 마지막 문제 완료
          setStep("winner");
        } else {
          // 다음 문제 대기
          console.log("다음 문제 대기 상태로 전환");
          setStep("waiting");
        }
        break;

      case "WAITING":
        console.log("⏳ 대기 상태");
        setStep("waiting");
        break;

      case "QUESTION_TIMEOUT":
        if (isSurvived) {
          // 정답자는 상태 변경 없음 - 오버레이가 자동으로 사라지고 다음 단계를 기다림
          console.log("✅ 정답자 - 현재 상태 유지, 오버레이는 타이머로 제어됨");
          // setStep을 건드리지 않음
        } else if (!hasSubmitted) {
          // 답 안낸 사람은 탈락
          console.log("❌ 미제출자 - 탈락 처리");
          setStep("eliminated");
        } else {
          // 답은 냈지만 틀린 사람은 이미 eliminated 상태일 것
          console.log("❌ 오답자 - 이미 탈락 처리됨");
          // 이미 submitAnswer에서 eliminated로 처리되었을 것
        }
        break;

      case "WINNER_ANNOUNCED":
        console.log("🏆 우승자 발표");
        if ("winnerName" in data && "winnerRank" in data) {
          setWinnerInfo({
            type: "WINNER_ANNOUNCED",
            winnerName: data.winnerName,
            winnerRank: data.winnerRank,
            message: data.message ?? "우승자가 결정되었습니다!",
          });
          setStep("winner");
        }
        break;

      default:
        console.warn("알 수 없는 상태:", status);
    }
    // 상태 저장
    if ("status" in data && data.status) {
      useQuizStore.getState().setQuizStatus(data.status);
    }
  };

  // 🔥 중복 제거: 하나의 useEffect만 사용
  useEffect(() => {
    if (!quizId || !questionId || !accessToken) return;

    const setup = async () => {
      try {
        await connectSocket(accessToken);
        console.log("소켓 연결됨");

        setupSubscription();
        loadQuestionData();
      } catch (e) {
        console.error("소켓 연결 실패", e);
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
    console.log(`문제 ${questionId} 시작 - 상태 초기화`);
    setSelectedAnswer(null);
    setIsSubmitting(false);
    setShowCorrectOverlay(false);
    setIsSurvived(false); // 생존 상태도 초기화
  }, [questionId]);

  // 타이머가 0이 되면 오버레이 숨김
  useEffect(() => {
    if (remainingTime === 0 && showCorrectOverlay) {
      console.log("⏰ 타이머 종료 - 정답 오버레이 숨김");
      setShowCorrectOverlay(false);
    }
  }, [remainingTime, showCorrectOverlay]);

  // 답안 선택
  const selectAnswer = (optionId: number) => {
    if (hasSubmitted || isSubmitting) return;
    setSelectedAnswer(optionId);
  };

  // 정답 제출
  const submitAnswer = async () => {
    if (selectedAnswer === null || !quizId || !accessToken || hasSubmitted)
      return;

    setIsSubmitting(true);
    setHasSubmitted(true);

    try {
      const res = await axiosInstance.post(
        `/quizzes/${quizId}/questions/${questionId}`,
        { optionId: selectedAnswer + 1 },
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );

      const { survived } = res.data.data;
      setIsSurvived(survived);

      if (survived) {
        const nextQuestionId = questionId + 1;
        setSelectedAnswer(null);
        setHasSubmitted(false);
        setShowCorrectOverlay(false);
        setIsSubmitting(false);
        setIsSurvived(false);

        setQuestionId(nextQuestionId);
        setStep("question");
      } else {
        setStep("eliminated");
      }
    } catch (err) {
      console.error("답안 제출 실패", err);
      setHasSubmitted(false);
      setSelectedAnswer(null);
      setIsSurvived(false);
    }
  };

  const CorrectOverlay = () => (
    <div className="absolute inset-0 z-20 flex items-center justify-center rounded-2xl bg-black/50 backdrop-blur-sm">
      <div className="rounded-xl bg-white/95 p-8 text-center shadow-xl">
        <img
          src="/images/popco/correct.svg"
          alt="correct"
          className="mx-auto mb-4 h-32 w-32"
        />
        <p className="mb-2 text-xl font-bold text-green-600">정답입니다! 🎉</p>
        <p className="mb-4 text-sm text-gray-600">
          다른 참가자들을 기다리는 중입니다...
        </p>
        <div className="flex items-center justify-center gap-2">
          <IoTimeOutline className="h-5 w-5" />
          <span className="text-base font-medium">
            {remainingTime > 0 ? `${remainingTime}초 남음` : "대기 중"}
          </span>
        </div>
      </div>
    </div>
  );

  if (step === "waiting") {
    return (
      <aside className="absolute left-1/2 top-[31%] z-10 flex w-[85%] -translate-x-1/2 -translate-y-1/3 flex-col items-center justify-center break-keep rounded-xl bg-white/90 px-4 py-8 shadow-xl backdrop-blur-md md:h-[520px] md:w-[800px] md:px-8">
        <div className="flex flex-col items-center gap-4">
          <img
            src="/images/popco/next_waiting.svg"
            alt="waiting"
            className="h-40 w-40"
          />
          <p className="text-lg font-semibold text-gray-700">
            다음 문제를 준비 중입니다...
          </p>
          <p className="text-sm text-gray-500">잠시만 기다려 주세요.</p>
        </div>
      </aside>
    );
  }

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
      {showCorrectOverlay && <CorrectOverlay />}

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
