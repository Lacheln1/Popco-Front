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
    setQuestionData,
    updateTimer,
    updateSurvivors,
    setStep,
    timer: remainingTime,
    survivors,
    setQuestionId,
    step,
    setNickname,
  } = useQuizStore();

  const { accessToken } = useAuthCheck();
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCorrectOverlay, setShowCorrectOverlay] = useState(false);
  const [hasSubmittedAnswer, setHasSubmittedAnswer] = useState(false); // 답안 제출 여부 추가
  const [hasTimerStarted, setHasTimerStarted] = useState(false); // 타이머 시작 여부 추가

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
      }

      const unsubscribe = subscribeToQuestion(
        quizId,
        questionId,
        handleSocketMessage,
      );

      if (unsubscribe) {
        subscriptionRef.current = unsubscribe;
      }
    } catch (error) {
      console.error("소켓 구독 중 오류:", error);
    }
  };

  // 소켓 메시지 처리 - 타이머와 생존자 수만 업데이트
  const handleSocketMessage = (
    data: QuizStatusSocketData | QuizResponseData,
  ) => {
    console.log("소켓 메시지 수신:", data);

    // 타이머 업데이트
    if ("remainingTime" in data && typeof data.remainingTime === "number") {
      updateTimer(data.remainingTime);
      // 타이머가 0보다 크면 시작된 것으로 판단
      if (data.remainingTime > 0) {
        setHasTimerStarted(true);
      }
    }

    // 생존자 수 업데이트
    if (
      "currentSurvivors" in data &&
      typeof data.currentSurvivors === "number" &&
      typeof data.maxSurvivors === "number"
    ) {
      updateSurvivors(data.currentSurvivors, data.maxSurvivors);
    }
  };

  // 소켓 연결 및 문제 데이터 로드
  useEffect(() => {
    if (!quizId || !questionId || !accessToken) return;

    const setup = async () => {
      try {
        await connectSocket(accessToken);
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
    setHasSubmittedAnswer(false); // 답안 제출 여부도 초기화
    setHasTimerStarted(false); // 타이머 시작 여부도 초기화
  }, [questionId]);

  // 타이머 처리 로직 수정
  useEffect(() => {
    // 정답 오버레이가 표시 중이고 remainingTime이 0이 되면 다음 문제로 이동
    if (showCorrectOverlay && remainingTime === 0) {
      const nextQuestionId = questionId + 1;
      setQuestionId(nextQuestionId);
      setShowCorrectOverlay(false);
      return;
    }

    // 타이머가 실제로 시작되었고, 답안을 제출하지 않았는데 remainingTime이 0이 되면 탈락 처리
    if (
      remainingTime === 0 &&
      hasTimerStarted &&
      !hasSubmittedAnswer &&
      !showCorrectOverlay
    ) {
      console.log("시간 초과로 탈락");
      setStep("eliminated");
    }
  }, [
    remainingTime,
    showCorrectOverlay,
    hasSubmittedAnswer,
    questionId,
    setQuestionId,
    setStep,
    hasTimerStarted,
  ]);

  // 답안 선택
  const selectAnswer = (optionId: number) => {
    if (isSubmitting || showCorrectOverlay || remainingTime === 0) return;
    setSelectedAnswer(optionId);
  };

  // 정답 제출
  const submitAnswer = async () => {
    if (
      selectedAnswer === null ||
      !quizId ||
      !accessToken ||
      isSubmitting ||
      remainingTime === 0
    )
      return;

    setIsSubmitting(true);
    setHasSubmittedAnswer(true); // 답안 제출 표시

    try {
      const res = await axiosInstance.post(
        `/quizzes/${quizId}/questions/${questionId}`,
        { optionId: selectedAnswer + 1 },
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );

      const { survived, rank, nickname } = res.data.data;
      setNickname(nickname);

      // 마지막 문제(3번째)인 경우
      if (questionId === 3) {
        if (rank === 1) {
          setStep("winner");
        } else {
          setStep("eliminated");
        }
        return;
      }

      // 일반 문제인 경우
      if (survived) {
        setShowCorrectOverlay(true);
      } else {
        setStep("eliminated");
      }
    } catch (err) {
      console.error("답안 제출 실패", err);
      setIsSubmitting(false);
      setHasSubmittedAnswer(false); // 실패시 제출 상태 되돌리기
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
        <p className="text-xl font-bold text-green-600">정답입니다! 🎉</p>
        <p className="mb-4 text-sm text-gray-600">
          {remainingTime}초 후 다음 문제로 이동합니다...
        </p>
        <div className="flex items-center justify-center gap-2">
          <IoTimeOutline className="h-5 w-5" />
          <span className="text-base font-medium">{remainingTime}초 남음</span>
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

      <div className="flex h-full w-full flex-col items-center justify-center p-4 pt-0 text-center">
        {/* 상단 정보바 */}
        <div className="hidden w-full items-center justify-between md:flex">
          {/* 타이머 - 소켓으로부터 받은 데이터 */}
          <div className="flex items-center gap-1 rounded-full px-4 py-2 transition-all duration-300">
            <IoTimeOutline className={`text-black"} h-6 w-6`} />
            <span className={`text-md text-black"}`}>
              {isTimerActive ? `${remainingTime}초` : "시간 종료"}
            </span>
          </div>

          {/* 문제 번호 */}
          <div className="gmarket text-lg text-gray-800">
            Quiz {questionId} / 3
          </div>

          {/* 생존자 정보 - 소켓으로부터 받은 데이터 */}
          <div className="flex flex-col items-end">
            <div className="mb-1 flex items-center gap-2">
              <FiUsers className="h-5 w-5 text-indigo-600" />
              <span className="text-base text-gray-700">생존자</span>
              <span className="text-xl font-bold text-indigo-600">
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
          </div>
        </div>
        <div className="flex w-full items-center justify-between md:hidden">
          {/* 문제 번호 */}
          <div className="gmarket text-lg text-gray-800">
            Quiz {questionId} / 3
          </div>
          <div>
            <div className="flex items-center gap-1 rounded-full px-4 py-2 transition-all duration-300">
              <IoTimeOutline
                className={`h-6 w-6 ${remainingTime <= 3 ? "text-red-500" : "text-black"}`}
              />
              <span
                className={`text-md ${remainingTime <= 3 ? "font-bold text-red-500" : "text-black"}`}
              >
                {isTimerActive ? `${remainingTime}초` : "시간 종료"}
              </span>
            </div>
            {/* 생존자 정보 - 소켓으로부터 받은 데이터 */}
            <div className="flex flex-col items-end">
              <div className="mb-1 flex items-center gap-2">
                <FiUsers className="h-5 w-5 text-indigo-600" />
                <span className="text-base text-gray-700">생존자</span>
                <span className="text-xl font-bold text-indigo-600">
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
            </div>
          </div>
        </div>
        {/* 문제 */}
        <h3 className="my-5 text-xl text-gray-800 lg:text-2xl">
          {questionData.content}
        </h3>

        {/* 선택지 */}
        <div className="mb-4 grid w-full max-w-2xl gap-3 md:w-2/3">
          {questionData?.options?.map((opt, index) => (
            <button
              key={opt.id}
              onClick={() => selectAnswer(opt.id)}
              disabled={
                isSubmitting || showCorrectOverlay || remainingTime === 0
              }
              className={`hover:border-footerBlue group relative transform overflow-hidden rounded-xl p-3 text-left font-medium transition-all duration-300 hover:scale-[1.02] hover:bg-gray-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100 md:p-4 ${
                selectedAnswer === opt.id
                  ? "bg-footerBlue text-white shadow-lg"
                  : "text-footerBlue shadow-lg hover:shadow-lg"
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-sm transition-all ${
                    selectedAnswer === opt.id
                      ? "scale-110 bg-white/30"
                      : "bg-white/20 group-hover:scale-105 group-hover:bg-white/30"
                  }`}
                >
                  {String.fromCharCode(65 + index)}
                </div>
                <span className="mr-8 w-full text-center text-base font-medium">
                  {opt.content}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* 제출 버튼 */}
        <button
          onClick={submitAnswer}
          disabled={
            selectedAnswer === null ||
            isSubmitting ||
            showCorrectOverlay ||
            remainingTime === 0
          }
          className="bg-footerBlue transform rounded-full bg-gradient-to-r px-12 py-3 text-base text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-slate-900 hover:shadow-xl active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              제출 중...
            </div>
          ) : showCorrectOverlay ? (
            "정답 확인 중..."
          ) : remainingTime === 0 ? (
            "시간 종료"
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
