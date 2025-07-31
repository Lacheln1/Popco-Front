import React from "react";
import Countdown from "react-countdown";
import clsx from "clsx";

interface Props {
  isButtonActive: boolean;
  onCountdownEnd: () => void;
  renderCount: (props: any) => React.ReactNode;
}

export const EventInfoCard = ({
  isButtonActive,
  onCountdownEnd,
  renderCount,
}: Props) => (
  <aside className="absolute left-1/2 top-[31%] z-10 flex w-[85%] -translate-x-1/2 -translate-y-1/3 flex-col items-center justify-center break-keep rounded-xl bg-white/80 px-4 py-8 shadow-xl backdrop-blur-md md:w-[800px] md:px-8">
    <h3 className="gmarket md: mb-1 text-center text-xl font-medium tracking-tight text-gray-900 md:text-[1.75rem]">
      {isButtonActive
        ? "퀴즈 이벤트가 시작되었습니다!"
        : "퀴즈 이벤트가 곧 시작됩니다!"}
    </h3>
    <Countdown
      key={isButtonActive ? "started" : "waiting"}
      date={new Date("2025-08-12T15:00:00")}
      renderer={renderCount}
      onComplete={onCountdownEnd}
    />
    <div className="flex flex-col gap-2">
      <div className="pretendard flex flex-row items-center gap-3">
        <span className="bg-footerBlue w-[90px] rounded-full py-1 text-center text-white">
          이번주 작품
        </span>
        <span className="text-sm md:text-base">F1 더 무비</span>
      </div>
      <div className="pretendard flex items-center gap-3">
        <span className="bg-footerBlue w-[90px] rounded-full py-1 text-center text-white">
          시작 시간
        </span>
        <span className="text-sm md:text-base">2025.08.12(화) 13:00</span>
      </div>
      <div className="pretendard flex items-center gap-3">
        <span className="bg-footerBlue w-[90px] rounded-full py-1 text-center text-white">
          대상
        </span>
        <span className="text-sm md:text-base">F1 더 무비를 본 모든 대상</span>
      </div>
      <div className="pretendard flex items-center gap-3">
        <span className="bg-footerBlue w-[90px] rounded-full py-1 text-center text-white">
          경품안내
        </span>
        <span className="text-sm md:text-base">CGV 5만원 상품권(1인)</span>
      </div>
      <div className="pretendard flex flex-col items-baseline gap-3 md:flex-row">
        <span className="bg-footerBlue hidden w-[90px] rounded-full py-1 text-center text-white md:block">
          참여방법
        </span>
        <span className="mt-3 text-center text-sm md:mt-0 md:text-left md:text-base">
          이 페이지에서 대기해 주세요.
          <br />
          이벤트 시간이 되면 자동으로 버튼이 활성화됩니다!
          <br />
          문제를 가장 빠르게 맞히면 선착순으로 다음 라운드에 진출할 수 있어요!
        </span>
      </div>
      <button
        disabled={!isButtonActive}
        className={clsx(
          "mt-4 w-fit self-center rounded-full px-14 py-3 shadow-md transition",
          isButtonActive
            ? "cursor-pointer bg-[#222] text-white hover:bg-black"
            : "cursor-not-allowed bg-gray-200 text-gray-400",
        )}
      >
        {isButtonActive ? "퀴즈 풀기 시작!" : "아직 이벤트가 준비중입니다"}
      </button>
    </div>
  </aside>
);
