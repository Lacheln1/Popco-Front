import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/swiper-bundle.css";
import Poster from "../common/Poster";
import { LuEye } from "react-icons/lu";
import { SwiperNavigation } from "../common/SwiperButton";
import { Swiper as SwiperType } from "swiper";

const HeroRanking = () => {
  const [viewMode, setViewMode] = useState<"mobile" | "swiper" | "desktop">(
    "desktop",
  );
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | undefined>(
    undefined,
  );
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  const handleSwiperInit = (swiper: SwiperType) => {
    setSwiperInstance(swiper);
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  };

  const handleSlideChange = (swiper: SwiperType) => {
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  };

  useEffect(() => {
    const checkView = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setViewMode("mobile");
      } else if (width >= 640 && width <= 1080) {
        setViewMode("swiper");
      } else {
        setViewMode("desktop");
      }
    };

    checkView(); // 초기 확인
    window.addEventListener("resize", checkView);
    return () => window.removeEventListener("resize", checkView);
  }, []);

  const posterData = [
    { rank: 2, id: "2", title: "2위 포스터" },
    { rank: 3, id: "3", title: "3위 포스터" },
    { rank: 4, id: "4", title: "4위 포스터" },
    { rank: 5, id: "5", title: "5위 포스터" },
  ];

  return (
    <div className="mx-auto w-full max-w-[1200px] px-4 md:px-6 lg:px-8">
      <h3 className="gmarket text-xl sm:text-2xl md:text-3xl">
        POPCO의 주간 <strong className="text-popcorn-box">TOP 5</strong>
      </h3>

      <section>
        <div className="relative mt-6 text-white">
          <img
            src="images/main/ticket.svg"
            alt="티켓 이미지"
            className="w-full object-cover opacity-0 sm:opacity-100"
          />
          <div className="absolute inset-0 flex items-center justify-center gap-4 sm:gap-6 sm:pl-[7%] sm:pr-[17%] md:gap-14 md:py-10">
            <img
              className="h-full rounded-md shadow-lg sm:h-[85%] md:h-[90%]"
              src="https://image.tmdb.org/t/p/original/bvVoP1t2gNvmE9ccSrqR1zcGHGM.jpg"
              alt="1위 포스터"
            />
            <div className="max-w-full md:max-w-[510px]">
              <div className="flex items-center gap-3 border-b border-white pb-2">
                <span className="text-5xl font-bold text-transparent drop-shadow-lg [-webkit-text-stroke:3px_#fdedae] sm:text-7xl lg:text-8xl">
                  1
                </span>
                <span className="gmarket text-lg text-white sm:text-3xl lg:text-4xl">
                  F1 더 무비
                </span>
              </div>

              <div className="sm:flex-column flex flex-col justify-between border-b p-2 text-base sm:border-none sm:py-4 md:flex-row md:border-solid lg:text-xl">
                <div className="flex gap-2 sm:gap-6">
                  <div className="text-popco-main font-semibold">POPCORN</div>
                  <div>3.5</div>
                </div>
                <div className="flex gap-2 sm:gap-6">
                  <div className="text-popco-main font-semibold">GENRE</div>
                  <div>액션, 서사/드라마</div>
                </div>
              </div>

              <p className="my-4 hidden text-sm leading-relaxed text-gray-200 sm:text-base md:overflow-hidden md:[-webkit-box-orient:vertical] md:[-webkit-line-clamp:2] md:[display:-webkit-box] xl:[-webkit-line-clamp:4]">
                한때 주목받는 유망주였지만 끔찍한 사고로 F1®에서 우승하지
                못하고 한순간에 추락한 드라이버 소니 헤이스. 그의 오랜 동료인
                루벤 세르반테스에게 레이싱 복귀를 제안받으며 최하위 팀인 APXGP에
                합류한다. 그러나 팀 내 떠오르는 천재 드라이버 조슈아 피어스와 소
                ...
              </p>

              <button className="bg-popco-hair hover:bg-popco-main mt-2 flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-black sm:text-base">
                <LuEye className="text-base sm:text-lg" />
                <span>view more</span>
              </button>
            </div>
          </div>
        </div>

        <>
          {viewMode === "swiper" ? (
            <>
              <div className="mb-4 flex justify-end">
                <SwiperNavigation
                  swiper={swiperInstance}
                  isBeginning={isBeginning}
                  isEnd={isEnd}
                />
              </div>
              <Swiper
                modules={[Navigation]}
                slidesPerView={3}
                onSwiper={handleSwiperInit}
                onSlideChange={handleSlideChange}
                className="px-2"
              >
                {posterData.map(({ rank, id, title }) => (
                  <SwiperSlide key={id} className="relative mx-4 my-2">
                    <span className="absolute -left-4 -top-4 z-10 text-[50px] font-bold text-transparent drop-shadow-lg [-webkit-text-stroke:2px_#0f1525]">
                      {rank}
                    </span>
                    <Poster
                      title={title}
                      posterUrl="https://image.tmdb.org/t/p/original/bvVoP1t2gNvmE9ccSrqR1zcGHGM.jpg"
                      id={id}
                      likeState="neutral"
                      onLikeChange={() => {}}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </>
          ) : (
            <ul className="mt-12 grid grid-cols-2 justify-items-center gap-4 sm:mt-6 sm:flex sm:justify-between sm:gap-6">
              {posterData.map(({ rank, id, title }) => (
                <li key={id} className="relative flex-col items-center *:flex">
                  <span className="absolute -left-6 -top-6 z-10 text-[60px] font-bold text-transparent drop-shadow-lg [-webkit-text-stroke:3px_#0f1525] sm:text-[80px] md:text-[100px]">
                    {rank}
                  </span>
                  <Poster
                    title={title}
                    posterUrl="https://image.tmdb.org/t/p/original/bvVoP1t2gNvmE9ccSrqR1zcGHGM.jpg"
                    id={id}
                    likeState="neutral"
                    onLikeChange={() => {}}
                  />
                </li>
              ))}
            </ul>
          )}
        </>
      </section>
    </div>
  );
};

export default HeroRanking;
