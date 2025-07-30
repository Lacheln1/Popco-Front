import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { Swiper as SwiperType } from "swiper";
import { SwiperNavigation } from "@/components/common/SwiperButton";
import Poster from "../common/Poster";
import "swiper/swiper-bundle.css";
import { usePopcorithm } from "@/hooks/queries/contents/usePopcorithm";
import { RecommendationItem } from "@/types/Recommend.types";

interface Props {
  accessToken: string;
  userId: number;
}
const HeroPopcorithm = ({ accessToken, userId }: Props) => {
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | undefined>(
    undefined,
  );
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  const HERO_POPCORITHM_LIMIT = 10;
  const { data, isLoading, isError, isSuccess } = usePopcorithm(
    userId,
    HERO_POPCORITHM_LIMIT,
    accessToken,
  );
  if (isLoading) {
    return (
      <div className="py-20 text-center text-white">
        <p>추천 콘텐츠를 불러오는 중입니다...</p>
      </div>
    );
  }
  if (isError) {
    return (
      <div className="py-20 text-center text-red-600">
        <p>추천 콘텐츠를 불러오는 데 실패했습니다.</p>
      </div>
    );
  }
  if (isSuccess && (!data || data.length === 0)) {
    return (
      <div className="py-20 text-center text-gray-400">
        <p>😶 추천 콘텐츠가 아직 없습니다.</p>
      </div>
    );
  }

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
    <div>
      <h3 className="gmarket m-auto px-3 text-xl leading-snug sm:text-2xl md:px-6 md:text-[28px] lg:px-0 xl:w-[1200px]">
        POP코리즘
      </h3>
      <section
        className="relative overflow-hidden"
        style={{
          background:
            "linear-gradient(90deg, #25263C 2%, rgba(68,69,90,0.8) 46%)",
        }}
      >
        <div className="relative m-auto flex flex-col items-center gap-8 py-16 text-white sm:gap-0 md:flex-row md:py-8">
          <div className="w-2/5 justify-items-center space-y-6 text-center">
            <p className="text-left text-xl font-semibold">
              고객님을 위한 <br /> 맞춤 추천 작품을 <br /> 확인해 보세요 !
            </p>
            <button className="gmarket rounded-full border border-solid border-white px-7 py-3 font-semibold transition hover:bg-white hover:text-black">
              View all +
            </button>
          </div>
          <div className="w-full md:w-3/5">
            <div className="mb-3 flex justify-end px-8">
              <SwiperNavigation
                swiper={swiperInstance}
                isBeginning={isBeginning}
                isEnd={isEnd}
              />
            </div>
            <Swiper
              modules={[Navigation]}
              slidesPerView={2}
              onSwiper={handleSwiperInit}
              onSlideChange={handleSlideChange}
              className="pb-6"
              breakpoints={{
                0: { slidesPerView: 2.3 },
                638: { slidesPerView: 3 },
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 2.5 },
                1280: { slidesPerView: 3.5 },
                1440: { slidesPerView: 4 },
                1920: { slidesPerView: 5 },
              }}
            >
              {data?.map(
                ({ content_id, title, poster_path }: RecommendationItem) => (
                  <SwiperSlide
                    key={content_id}
                    className="flex flex-col items-center justify-items-center"
                  >
                    <Poster
                      title={title}
                      posterUrl={`https://image.tmdb.org/t/p/original${poster_path}`}
                      id={content_id}
                      likeState="neutral"
                      onLikeChange={() => {}}
                    />
                  </SwiperSlide>
                ),
              )}
            </Swiper>
          </div>

          <img
            className="absolute left-[5%] w-[80px] mix-blend-screen sm:bottom-[8%] sm:left-[3%] sm:w-[100px] md:w-[120px] lg:left-[5%] lg:w-[150px]"
            src="/images/components/glossy_popcorn.png"
            alt="popcorn"
          />
          <img
            className="width-[120px] absolute left-2/3 top-[3%] mix-blend-screen md:left-[7%] md:w-[130px] lg:w-[160px]"
            src="/images/components/glossy_glass.png"
            alt="glass"
          />
          <img
            className="absolute left-[10%] top-[25%] w-[70px] mix-blend-screen sm:left-1/4 sm:top-[4%] sm:w-[90px] md:w-[100px] lg:w-[120px]"
            src="/images/components/glossy_slate.png"
            alt="slate"
          />
          <img
            className="absolute left-[10%] top-[20%] hidden mix-blend-screen sm:bottom-[65%] sm:left-[15%] sm:top-auto sm:block sm:w-[100px] md:bottom-[10%] md:left-1/4 md:w-[130px] lg:bottom-[12%] lg:w-[160px]"
            src="/images/components/glossy_tv.png"
            alt="tv"
          />
        </div>
      </section>
    </div>
  );
};

export default HeroPopcorithm;
