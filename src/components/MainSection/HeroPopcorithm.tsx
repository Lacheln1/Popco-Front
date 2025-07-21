import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { Swiper as SwiperType } from "swiper";
import { SwiperNavigation } from "@/components/common/SwiperButton";
import Poster from "../common/Poster";
import "swiper/swiper-bundle.css";

const HeroPopcorithm = () => {
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | undefined>(
    undefined,
  );
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  const posterData = [
    { id: "1", title: "케이팝 데몬 헌터스" },
    { id: "2", title: "서초동" },
    { id: "3", title: "쥬라기 월드 : 새로운 시작" },
    { id: "4", title: "서초동" },
    { id: "5", title: "다섯번째 포스터" },
    { id: "6", title: "여섯번째 포스터" },
  ];

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
        className="relative"
        style={{
          background:
            "linear-gradient(90deg, #25263C 2%, rgba(68,69,90,0.8) 46%)",
        }}
      >
        <div className="relative m-auto flex items-center py-8 text-white">
          <div className="w-2/5 justify-items-center space-y-6 text-center">
            <p className="text-left text-xl font-semibold">
              고객님을 위한 <br /> 맞춤 추천 작품을 <br /> 확인해 보세요 !
            </p>
            <button className="gmarket rounded-full border border-solid border-white px-6 py-4 font-semibold transition hover:bg-white hover:text-black">
              View all +
            </button>
          </div>
          <div className="w-3/5">
            <div className="mb-3 flex justify-end px-8">
              <SwiperNavigation
                swiper={swiperInstance}
                isBeginning={isBeginning}
                isEnd={isEnd}
              />
            </div>
            <Swiper
              modules={[Navigation]}
              spaceBetween={20}
              slidesPerView={5}
              onSwiper={handleSwiperInit}
              onSlideChange={handleSlideChange}
              className="pb-6"
            >
              {posterData.map(({ id, title }) => (
                <SwiperSlide key={id} className="flex flex-col items-center">
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
          </div>

          <img
            className="absolute bottom-4 left-32 w-[80px] mix-blend-screen sm:w-[100px] md:w-[120px] lg:w-[150px]"
            src="/images/components/glossy_popcorn.png"
            alt="popcorn"
          />
          <img
            className="absolute left-32 top-4 mix-blend-screen sm:w-[100px] md:w-[130px] lg:w-[160px]"
            src="/images/components/glossy_glass.png"
            alt="glass"
          />
          <img
            className="absolute left-1/4 top-[12%] w-[70px] mix-blend-screen sm:w-[70px] md:w-[100px] lg:w-[120px]"
            src="/images/components/glossy_slate.png"
            alt="slate"
          />
          <img
            className="absolute bottom-4 left-1/4 w-[80px] mix-blend-screen sm:w-[100px] md:w-[130px] lg:w-[160px]"
            src="/images/components/glossy_tv.png"
            alt="tv"
          />
        </div>
      </section>
    </div>
  );
};

export default HeroPopcorithm;
