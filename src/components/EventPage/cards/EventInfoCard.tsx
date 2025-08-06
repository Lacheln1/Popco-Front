import { useEffect, useState, useCallback } from "react";
import useAuthCheck from "@/hooks/useAuthCheck";
import { useQuizStore } from "@/stores/useQuizStore";
import {
  connectSocket,
  disconnectSocket,
  subscribeToWaiting,
} from "@/utils/socket";
import { App, Spin } from "antd";
import { useQuizInfo } from "@/hooks/queries/quiz/useQuizInfo";
import dayjs from "dayjs";
import axiosInstance from "@/apis/axiosInstance";
import TimeBlock from "../TimeBlock";

// 소켓 타이머 데이터 타입 정의
interface SocketTimerData {
  remainingTime?: number;
  remainingHour?: number;
  remainingMin?: number;
  remainingSec?: number;
  type?: string;
}

interface Props {
  isButtonActive: boolean;
  onCountdownEnd: () => void;
}

export const EventInfoCard = ({ isButtonActive, onCountdownEnd }: Props) => {
  const { accessToken } = useAuthCheck();
  const { setConnected, setStep, quizId } = useQuizStore();
  const { message } = App.useApp();
  const { data, isLoading } = useQuizInfo(accessToken);

  // 소켓으로 받을 실시간 데이터
  const [socketTimer, setSocketTimer] = useState<{
    remainingTime: number;
    remainingHour: number;
    remainingMin: number;
    remainingSec: number;
  } | null>(null);

  // 초기화 상태 관리 (중복 실행 방지)
  const [isInitialized, setIsInitialized] = useState(false);

  // 퀴즈 시작 버튼 로딩 상태
  const [isStarting, setIsStarting] = useState(false);

  const quizDetail = data?.quizDetail;

  // 소켓 데이터 핸들러를 useCallback으로 메모이제이션
  const handleSocketData = useCallback(
    (data: SocketTimerData) => {
      console.log("🔄 소켓 타이머 데이터 수신:", data);

      // 백엔드에서 계산해준 시간 데이터 저장
      if (typeof data.remainingTime === "number") {
        const newTimerData = {
          remainingTime: data.remainingTime,
          remainingHour: data.remainingHour || 0,
          remainingMin: data.remainingMin || 0,
          remainingSec: data.remainingSec || 0,
        };

        setSocketTimer((prev) => {
          // 모든 값이 동일한지 확인하여 불필요한 업데이트 방지
          if (
            prev &&
            prev.remainingTime === newTimerData.remainingTime &&
            prev.remainingHour === newTimerData.remainingHour &&
            prev.remainingMin === newTimerData.remainingMin &&
            prev.remainingSec === newTimerData.remainingSec
          ) {
            return prev;
          }
          return newTimerData;
        });
      }

      // 퀴즈 시작 신호
      if (data.type === "quiz-start" || data.remainingTime === 0) {
        onCountdownEnd();
      }
    },
    [onCountdownEnd],
  );

  useEffect(() => {
    // accessToken이나 quizId가 없거나 이미 초기화되었으면 실행하지 않음
    if (!accessToken || !quizDetail?.quizId || isInitialized) return;

    let isCancelled = false; // 클린업을 위한 플래그

    const initializeQuiz = async () => {
      if (isCancelled) return; // 이미 취소되었으면 실행하지 않음

      try {
        // 1. 소켓 연결 (페이지 진입 시)
        await connectSocket(accessToken);
        if (isCancelled) return;

        // 2. 대기 채널 구독 - 실시간 타이머 수신
        const subscription = subscribeToWaiting(
          quizDetail.quizId,
          handleSocketData,
        );

        if (!subscription) throw new Error("대기 채널 구독에 실패했습니다");
        if (isCancelled) return;

        // 3. 브로드캐스트 트리거
        await axiosInstance.post(
          `/quizzes/${quizDetail.quizId}/waiting`,
          {},
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          },
        );
        if (isCancelled) return;
        setConnected(true);
        setIsInitialized(true);
      } catch (error) {
        if (!isCancelled) {
          message.error("퀴즈 초기화에 실패했습니다.");
        }
      }
    };

    initializeQuiz();

    // 클린업 함수
    return () => {
      isCancelled = true;
    };
  }, [
    accessToken,
    quizDetail?.quizId,
    isInitialized,
    handleSocketData,
    setConnected,
    message,
  ]);

  // 퀴즈 시작 API 호출
  const startQuiz = async () => {
    if (!accessToken) {
      message.error("로그인이 필요합니다.");
      return;
    }

    if (!quizId) {
      message.error("퀴즈 정보를 찾을 수 없습니다.");
      return;
    }

    setIsStarting(true);

    try {
      const response = await axiosInstance.post(
        `/quizzes/${quizId}/start`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (response.data.code === 200) {
        message.success("퀴즈가 시작되었습니다!");
        setStep("question");
      } else {
        throw new Error(response.data.message || "퀴즈 시작에 실패했습니다.");
      }
    } catch (error) {
      console.error("퀴즈 시작 실패:", error);
    }
  };

  const handleEnter = useCallback(() => {
    if (!accessToken) {
      message.error("회원만 참여 가능한 이벤트입니다.");
      return;
    }
    disconnectSocket();
    startQuiz();
  }, [accessToken, isButtonActive, message, quizId]);

  if (isLoading) {
    return (
      <aside className="flex items-center justify-center py-12">
        <Spin size="large" />
      </aside>
    );
  }

  return (
    <aside className="absolute left-1/2 top-[31%] z-10 flex w-[85%] -translate-x-1/2 -translate-y-1/3 flex-col items-center justify-center break-keep rounded-xl bg-white/80 px-4 py-8 shadow-xl backdrop-blur-md md:h-[520px] md:w-[800px] md:px-8">
      {quizDetail ? (
        <>
          <h3 className="gmarket text-center text-xl font-medium tracking-tight text-gray-900 md:text-[1.75rem]">
            {isButtonActive
              ? "퀴즈 이벤트가 시작되었습니다!"
              : "퀴즈 이벤트가 곧 시작됩니다!"}
          </h3>

          {/* 소켓 연결 상태에 따라 다른 카운트다운 표시 */}
          {socketTimer ? (
            // 실시간 소켓 타이머
            <div className="mb-8 flex gap-2">
              <TimeBlock
                label="HOURS"
                value={String(socketTimer.remainingHour).padStart(2, "0")}
              />
              <TimeBlock
                label="MINUTES"
                value={String(socketTimer.remainingMin).padStart(2, "0")}
              />
              <TimeBlock
                label="SECONDS"
                value={String(socketTimer.remainingSec).padStart(2, "0")}
              />
            </div>
          ) : (
            <div className="mb-8 flex gap-2">
              <TimeBlock label="HOURS" value="--" />
              <TimeBlock label="MINUTES" value="--" />
              <TimeBlock label="SECONDS" value="--" />
            </div>
          )}

          {/* 퀴즈 정보 및 안내 */}
          <div className="flex flex-col gap-2">
            <InfoRow label="이번주 작품" value={quizDetail.quizName} />
            <InfoRow
              label="시작 시간"
              value={dayjs(quizDetail.quizStartTime).format(
                "YYYY.MM.DD(ddd) HH:mm",
              )}
            />
            <InfoRow
              label="대상"
              value={`${quizDetail.quizName}를 본 모든 대상`}
            />
            <InfoRow label="경품안내" value={quizDetail.quizReward} />

            <div className="pretendard flex flex-col items-baseline gap-3 md:flex-row">
              <span className="bg-footerBlue hidden w-[90px] rounded-full py-1 text-center text-white md:block">
                참여방법
              </span>
              <span className="mt-3 text-center text-sm md:mt-0 md:text-left md:text-base">
                이 페이지에서 대기해 주세요.
                <br />
                이벤트 시간이 되면 자동으로 버튼이 활성화됩니다!
                <br />
                문제를 가장 빠르게 맞히면 선착순으로 다음 라운드에 진출할 수
                있어요!
              </span>
            </div>
            <button
              onClick={handleEnter}
              className="mt-4 w-fit cursor-pointer self-center rounded-full bg-[#222] px-14 py-3 text-white shadow-md transition hover:bg-black"
            >
              이벤트 입장하기
            </button>

            {/* <button
              onClick={handleEnter}
              disabled={!isButtonActive || isStarting}
              className={`mt-4 w-fit self-center rounded-full px-14 py-3 text-white shadow-md transition ${
                isButtonActive || isStarting
                  ? "cursor-not-allowed bg-gray-400"
                  : "cursor-pointer bg-[#222] hover:bg-black"
              }`}
            >
              {isStarting ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  퀴즈 시작 중...
                </div>
              ) : !isButtonActive ? (
                "이벤트 입장하기"
              ) : (
                "시작 시간을 기다려주세요"
              )}
            </button> */}
          </div>
        </>
      ) : (
        <div>퀴즈 정보를 불러올 수 없습니다.</div>
      )}
    </aside>
  );
};

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div className="pretendard flex items-center gap-3">
    <span className="bg-footerBlue w-[90px] rounded-full py-1 text-center text-white">
      {label}
    </span>
    <span className="text-sm md:text-base">{value}</span>
  </div>
);
