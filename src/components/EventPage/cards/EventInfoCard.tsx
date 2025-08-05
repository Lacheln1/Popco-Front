import React from "react";
import Countdown from "react-countdown";
import clsx from "clsx";
import useAuthCheck from "@/hooks/useAuthCheck";
import { useQuizStore } from "@/stores/useQuizStore";
import { connectSocket } from "@/utils/socket";
import { App, Spin } from "antd";
import { useQuizInfo } from "@/hooks/queries/quiz/useQuizInfo"; // ← 생성한 훅 import
import dayjs from "dayjs";

interface Props {
  isButtonActive: boolean;
  onCountdownEnd: () => void;
  renderCount: (props: any) => React.ReactNode;
}

export const EventInfoCard = ({
  isButtonActive,
  onCountdownEnd,
  renderCount,
}: Props) => {
  const { accessToken } = useAuthCheck();
  const { setConnected, setStep } = useQuizStore();
  const { message } = App.useApp();
  const { data, isLoading } = useQuizInfo(accessToken);

  const quizDetail = data?.quizDetail;

  const handleEnter = async () => {
    if (!accessToken) {
      message.error("회원만 참여 가능한 이벤트입니다.");
      return;
    }
    try {
      await connectSocket(accessToken);
      setConnected(true);
      console.log("step 상태 변경 전");
      setStep("question");
      console.log("step 상태 변경 완료");
    } catch (err) {
      message.error("소켓 연결에 실패했습니다.");
      console.error(err);
    }
  };

  if (isLoading) {
    return (
      <aside className="flex items-center justify-center py-12">
        <Spin size="large" />
      </aside>
    );
  }

  return (
    <aside className="absolute left-1/2 top-[31%] z-10 flex w-[85%] -translate-x-1/2 -translate-y-1/3 flex-col items-center justify-center break-keep rounded-xl bg-white/80 px-4 py-8 shadow-xl backdrop-blur-md md:w-[800px] md:px-8">
      {quizDetail ? (
        <>
          <h3 className="gmarket md: mb-1 text-center text-xl font-medium tracking-tight text-gray-900 md:text-[1.75rem]">
            {isButtonActive
              ? "퀴즈 이벤트가 시작되었습니다!"
              : "퀴즈 이벤트가 곧 시작됩니다!"}
          </h3>
          <Countdown
            key={isButtonActive ? "started" : "waiting"}
            date={new Date(quizDetail.quizStartTime)}
            renderer={renderCount}
            onComplete={onCountdownEnd}
          />

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
              className={clsx(
                "mt-4 w-fit cursor-pointer self-center rounded-full bg-[#222] px-14 py-3 text-white shadow-md transition hover:bg-black",
              )}
            >
              이벤트 입장하기
            </button>
            {/* <button
              onClick={handleEnter}
              disabled={!isButtonActive}
              className={clsx(
                "mt-4 w-fit self-center rounded-full px-14 py-3 shadow-md transition",
                isButtonActive
                  ? "cursor-pointer bg-[#222] text-white hover:bg-black"
                  : "cursor-not-allowed bg-gray-200 text-gray-400",
              )}
            >
              {isButtonActive
                ? "이벤트 입장하기"
                : "아직 이벤트가 준비중입니다"}
            </button> */}
          </div>
        </>
      ) : (
        <div>웅</div>
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
