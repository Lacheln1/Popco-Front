import { renderCount } from "@/components/EventPage/Countdown";
import { useIsMediumUp } from "@/hooks/useMediaQuery";
import React from "react";
import Countdown from "react-countdown";

const image = {
  src: "https://image.tmdb.org/t/p/original/bvVoP1t2gNvmE9ccSrqR1zcGHGM.jpg",
  alt: "F1 더 무비",
};

const resize = [0.895, 0.925, 0.96, 0.99];
const translate = [
  "scaleY(0.94) translate(-26.6em, -6.2em)",
  "scaleY(0.965) translate(-17em, -4.2em)",
  "scaleY(0.98) translate(-8em, -2.1em)",
  "",
];
const marginLeft = ["35.2em", "10em", "-15.3em", "-40.4em"];
const backgroundPosition = [".8em 0", ".6em 0", ".4em 0", ".1em 0"];

const getShadowStyle = (idx: number): React.CSSProperties => ({
  backgroundRepeat: "no-repeat",
  backgroundImage:
    "linear-gradient(120deg, transparent 42%, rgba(0,0,0,0.15) 45%, rgba(0,0,0,0.35) 65%)," +
    "linear-gradient(20deg, transparent 38%, rgba(0,0,0,0.25) 45%, rgba(0,0,0,0.23) 55%, rgba(0,0,0,0.13) 75%)," +
    "radial-gradient(ellipse at 50% 100%, rgba(0,0,0,0.15) 3%, transparent 40%)",
  transform: "rotate(-8deg)",
  backgroundSize: `100% ${82 + idx}%, 100% ${18 - idx}%, 100% 10%`,
  backgroundPosition: `${backgroundPosition[idx]}, 0 100%, -3em ${80 + idx}%`,
});

const getImageStyle = (idx: number): React.CSSProperties => ({
  borderImage: "linear-gradient(105deg, transparent .5%, #aaa .7%) 1",
  transform: `perspective(20em) rotateY(1deg) rotateZ(-5deg) skewY(-2deg) skewX(-1deg) scaleX(${resize[idx]})`,
});

const getHighlightStyle = (idx: number): React.CSSProperties => ({
  backgroundImage:
    "linear-gradient(45deg, rgba(0,0,0,0.3), transparent 70%)," +
    "linear-gradient(45deg, rgba(255,255,255,0) 60%, rgba(255,255,255,0.3) 80%)",
  transform: `perspective(20em) rotateY(1deg) rotateZ(-5deg) skewY(-2deg) skewX(-1deg) scaleX(${resize[idx]})`,
});

const renderPoster = (idx: number) => (
  <div
    key={idx}
    className="absolute bottom-[4.8em] left-[54%] z-0 flex w-[250px] justify-end"
    style={{
      marginLeft: marginLeft[idx],
      transform: translate[idx] || undefined,
    }}
  >
    {/* Shadow layer */}
    <div
      className="absolute left-0 top-[7%] z-[1] h-full w-[60%]"
      style={getShadowStyle(idx)}
    />
    {/* Image */}
    <img
      src={image.src}
      alt={image.alt}
      className="relative z-[2] block h-full w-[60%] border-l-[0.2em] shadow-[0.1em_0.2em_0_-0.1em_#666] saturate-[90%]"
      style={getImageStyle(idx)}
    />
    {/* Highlight layer */}
    <div
      className="absolute z-[3] h-full w-[60%]"
      style={getHighlightStyle(idx)}
    />
  </div>
);

const EventPage = () => {
  const isMediumUp = useIsMediumUp();
  const postersToRender = isMediumUp ? 4 : 1;

  return (
    <div className="bg-[#eee]">
      {/* 배경 */}
      <div
        className="relative mx-auto min-h-[330px] w-full"
        style={{
          backgroundRepeat: "no-repeat",
          backgroundImage:
            "linear-gradient(352deg, transparent 45.2%, #bbb 45.5%, #bbb 45.6%, #ccc 45.8%, #eee 60%)," +
            "linear-gradient(30deg, #ccc, #eee 90%)",
          backgroundSize: "100% 32.4em",
          backgroundPosition: "50% 108%",
        }}
      >
        {/* 카드 */}
        <div className="relative h-screen pt-20">
          <aside className="absolute left-1/2 top-1/2 z-10 flex w-[85%] -translate-x-1/2 -translate-y-1/3 flex-col items-center justify-center break-keep rounded-xl bg-white/80 px-4 py-8 shadow-xl backdrop-blur-md md:top-1/3 md:h-[450px] md:w-[800px] md:px-8">
            <h3 className="gmarket md: mb-1 text-center text-xl font-medium tracking-tight text-gray-900 md:text-[1.75rem]">
              퀴즈 이벤트가 곧 시작됩니다!
            </h3>
            <Countdown
              date={new Date("2025-08-12T15:00:00")}
              renderer={renderCount}
            />
            <div className="flex flex-col gap-2">
              <div className="pretendard flex items-center gap-3">
                <span className="bg-footerBlue w-[90px] rounded-full py-1 text-center text-white">
                  이번주 작품
                </span>
                <span className="text-sm md:text-base">F1 더 무비</span>
              </div>
              <div className="pretendard flex items-center gap-3">
                <span className="bg-footerBlue w-[90px] rounded-full py-1 text-center text-white">
                  시작 시간
                </span>
                <span className="text-sm md:text-base">
                  2025.08.12(화) 13:00
                </span>
              </div>
              <div className="pretendard flex items-center gap-3">
                <span className="bg-footerBlue w-[90px] rounded-full py-1 text-center text-white">
                  대상
                </span>
                <span className="text-sm md:text-base">
                  F1 더 무비를 본 모든 대상
                </span>
              </div>
              <div className="pretendard flex items-center gap-3">
                <span className="bg-footerBlue w-[90px] rounded-full py-1 text-center text-white">
                  경품안내
                </span>
                <span className="text-sm md:text-base">
                  CGV 5만원 상품권(1인)
                </span>
              </div>
              <div className="pretendard flex items-baseline gap-3 md:flex-row">
                <span className="bg-footerBlue w-[90px] rounded-full py-1 text-center text-white">
                  참여방법
                </span>
                <span className="text-sm md:text-base">
                  이 페이지에서 대기해 주세요.
                  <br />
                  이벤트 시간이 되면 자동으로 버튼이 활성화됩니다!
                  <br /> 문제를 가장 빠르게 맞히면 선착순으로 다음 라운드에
                  진출할 수 있어요!
                </span>
              </div>
            </div>
          </aside>
          <img
            className="absolute left-1/2 top-[15%] w-32 -translate-x-1/2 -translate-y-1/4"
            src="images/popco/time-popco.png"
            alt="popco"
          />
        </div>
        <>
          {/* 모바일 */}
          <div className="block md:hidden">{renderPoster(0)}</div>
          {/* PC */}
          <div className="hidden md:block">
            {Array.from({ length: postersToRender }, (_, idx) =>
              renderPoster(idx),
            )}
          </div>
        </>
      </div>
    </div>
  );
};

export default EventPage;
