import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { Swiper as SwiperType } from "swiper";
import { SwiperNavigation } from "@/components/common/SwiperButton";
import Poster from "../common/Poster";
import "swiper/swiper-bundle.css";

const HeroPersona = () => {
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | undefined>(
    undefined,
  );
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  const posterData = [
    { id: 1, title: "첫번째 포스터" },
    { id: 2, title: "두번째 포스터" },
    { id: 3, title: "세번째 포스터" },
    { id: 4, title: "네번째 포스터" },
    { id: 5, title: "다섯번째 포스터" },
    { id: 6, title: "여섯번째 포스터" },
    { id: 7, title: "일곱번째 포스터" },
    { id: 8, title: "여덟번째 포스터" },
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
    <div className="md:px- m-auto w-full max-w-[1200px] px-3 sm:px-0">
      <div className="relative flex items-center">
        <img
          className="absolute left-0 w-24 translate-x-0 md:w-48"
          src="/images/persona/무비셜록-아기.svg"
          alt="아기 무비셜록"
        />
        <h3 className="gmarket ml-20 flex flex-wrap items-center gap-2 text-xl leading-snug sm:text-2xl md:ml-44 md:text-3xl">
          <span>
            <span className="text-popcorn-box">'무서워도 본다맨'</span>{" "}
            들이{" "}
          </span>
          많이 찾은 작품
        </h3>
      </div>
      <section>
        <div className="mb-4 flex justify-end">
          <SwiperNavigation
            swiper={swiperInstance}
            isBeginning={isBeginning}
            isEnd={isEnd}
          />
        </div>
        <Swiper
          modules={[Navigation]}
          spaceBetween={15}
          onSwiper={handleSwiperInit}
          onSlideChange={handleSlideChange}
          breakpoints={{
            0: {
              slidesPerView: 2.5,
            },
            768: {
              slidesPerView: 3.5,
            },
            1024: {
              slidesPerView: 4.5,
            },
            1200: {
              slidesPerView: 5,
            },
          }}
        >
          {posterData.map(({ id, title }) => (
            <SwiperSlide key={id} className="flex justify-center">
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
      </section>
    </div>
  );
};

export default HeroPersona;
