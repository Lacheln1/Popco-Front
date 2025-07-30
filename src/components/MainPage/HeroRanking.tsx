import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/swiper-bundle.css";
import Poster from "../common/Poster";
import { LuEye } from "react-icons/lu";
import { SwiperNavigation } from "../common/SwiperButton";
import { Swiper as SwiperType } from "swiper";
import type { MenuProps } from "antd";
import { Dropdown } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { useContentsRanking } from "@/hooks/queries/contents/useContentsRanking";
import { ContentCategory } from "@/types/Contents.types";
import { TMDB_IMAGE_BASE_URL } from "@/constants/contents";

interface HeroRankingProps {
  onTop1Change: (type: ContentCategory, title: string) => void;
}

const HeroRanking = ({ onTop1Change }: HeroRankingProps) => {
  const [viewMode, setViewMode] = useState<"swiper" | "desktop">("desktop");
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | undefined>(
    undefined,
  );
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [selected, setSelected] = useState<ContentCategory>("all");

  const categoryMap = {
    all: "전체",
    tv: "시리즈",
    movie: "영화",
  } as const;

  const items: MenuProps["items"] = Object.entries(categoryMap).map(
    ([key, label]) => ({
      key,
      label,
    }),
  );

  useEffect(() => {
    const checkView = () => {
      const width = window.innerWidth;
      if (width <= 1080) {
        setViewMode("swiper");
      } else {
        setViewMode("desktop");
      }
    };
    checkView();
    window.addEventListener("resize", checkView);
    return () => window.removeEventListener("resize", checkView);
  }, []);

  const { data = [], isLoading } = useContentsRanking(selected);

  useEffect(() => {
    if (data && data.length > 0) {
      onTop1Change(selected, data[0].title);
    }
  }, [data, selected, onTop1Change]);

  if (!Array.isArray(data)) {
    console.error("HeroRanking Error: data is not an array", data);
    return <div>데이터가 없습니다.</div>;
  }

  const first = data[0];
  const contentsRank = data.slice(1);
  if (isLoading) <div>Loading</div>;

  const handleSwiperInit = (swiper: SwiperType) => {
    setSwiperInstance(swiper);
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  };

  const handleSlideChange = (swiper: SwiperType) => {
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  };

  return (
    <div className="mx-auto w-full max-w-[1200px] px-3 md:px-6 lg:px-0">
      <h3 className="gmarket flex flex-wrap items-center gap-2 text-xl leading-snug sm:text-2xl md:text-[28px]">
        주간 POPCO의
        <Dropdown
          menu={{
            items,
            onClick: ({ key }) => setSelected(key as ContentCategory),
          }}
          placement="bottomLeft"
          arrow
        >
          <button className="inline-flex items-center rounded-md bg-[#ffffff9c] px-3 py-1 text-sm sm:text-xl">
            {categoryMap[selected]} <DownOutlined className="ml-1 text-lg" />
          </button>
        </Dropdown>
        <span className="text-popcorn-box"> TOP 5</span>
      </h3>

      <section>
        {first && (
          <div className="relative mt-6 text-white">
            <img
              src="images/main/ticket.svg"
              alt="티켓 이미지"
              className="w-full object-cover opacity-0 sm:opacity-100"
            />
            <div className="absolute inset-0 flex items-center justify-center gap-4 sm:gap-6 sm:pl-[7%] sm:pr-[17%] md:gap-14 md:py-10">
              <img
                className="h-full rounded-md shadow-lg sm:h-[85%] md:h-[90%]"
                src={`${TMDB_IMAGE_BASE_URL}${first.posterPath}`}
                alt={first.title ?? "포스터 이미지"}
              />
              <div className="max-w-full md:max-w-[510px]">
                <div className="flex items-center gap-3 border-b border-white pb-2">
                  <span className="text-5xl font-bold text-transparent drop-shadow-lg [-webkit-text-stroke:3px_#fdedae] sm:text-7xl lg:text-8xl">
                    1
                  </span>
                  <span className="gmarket text-lg text-white sm:text-3xl lg:text-4xl">
                    {first.title}
                  </span>
                </div>

                <div className="sm:flex-column flex flex-col justify-between border-b p-2 text-base sm:justify-start sm:border-none sm:py-4 md:flex-row md:gap-8 md:border-solid lg:text-xl">
                  <div className="flex gap-2 sm:gap-5">
                    <div className="text-popco-main font-semibold">POPCORN</div>
                    <div>{first.reviewRatingAvg}</div>
                  </div>
                  <div className="flex gap-2 sm:gap-5">
                    <div className="text-popco-main font-semibold">GENRE</div>
                    <div>{first.genres}</div>
                  </div>
                </div>

                <p className="my-4 hidden text-sm leading-relaxed text-gray-200 sm:text-base md:overflow-hidden md:[-webkit-box-orient:vertical] md:[-webkit-line-clamp:2] md:[display:-webkit-box] xl:[-webkit-line-clamp:4]">
                  {first.overview}
                </p>

                <button className="bg-popco-hair hover:bg-popco-main mt-2 flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-black sm:text-base">
                  <LuEye className="text-base sm:text-lg" />
                  <span>view more</span>
                </button>
              </div>
            </div>
          </div>
        )}
        <>
          {viewMode === "swiper" ? (
            <>
              <div className="my-4 flex justify-end">
                <SwiperNavigation
                  swiper={swiperInstance}
                  isBeginning={isBeginning}
                  isEnd={isEnd}
                />
              </div>
              <Swiper
                modules={[Navigation]}
                onSwiper={handleSwiperInit}
                onSlideChange={handleSlideChange}
                className="px-2"
                breakpoints={{
                  0: {
                    slidesPerView: 2.3,
                  },
                  768: {
                    slidesPerView: 3,
                  },
                }}
              >
                {contentsRank.map(({ contentId, title, rank, posterPath }) => (
                  <SwiperSlide key={contentId} className="relative my-2 ml-7">
                    <span className="absolute -left-7 -top-4 z-10 text-[60px] font-bold text-transparent drop-shadow-lg [-webkit-text-stroke:2px_#0f1525]">
                      {rank}
                    </span>
                    <Poster
                      title={title}
                      posterUrl={`${TMDB_IMAGE_BASE_URL}${posterPath}`}
                      id={contentId}
                      likeState="neutral"
                      onLikeChange={() => {}}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </>
          ) : (
            <ul className="ml-9 mt-12 grid grid-cols-2 justify-items-center gap-4 sm:mt-6 sm:flex sm:justify-between sm:gap-6">
              {contentsRank.map(({ contentId, title, rank, posterPath }) => (
                <li
                  key={contentId}
                  className="relative flex-col items-center *:flex"
                >
                  <span className="absolute -left-11 -top-6 z-10 font-mono text-[60px] font-bold text-transparent drop-shadow-lg [-webkit-text-stroke:3px_#0f1525] sm:text-[80px] md:text-[90px]">
                    {rank}
                  </span>
                  <Poster
                    title={title}
                    posterUrl={`${TMDB_IMAGE_BASE_URL}${posterPath}`}
                    id={contentId}
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
