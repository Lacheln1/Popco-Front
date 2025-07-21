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
      <h3 className="gmarket m-auto xl:w-[1200px]">POP코리즘</h3>
      <section
        className=""
        style={{
          background:
            "linear-gradient(90deg, #25263C 2%, rgba(68,69,90,0.8) 46%)",
        }}
      >
        <div className="m-auto flex items-center gap-8 px-10 py-8 text-white">
          <div className="w-1/3 space-y-6">
            <p className="text-xl font-semibold leading-relaxed">
              고객님을 위한 <br /> 맞춤 추천 작품을 <br /> 확인해 보세요 !
            </p>
            <button className="gmarket rounded-full border border-solid border-white px-6 py-4 font-semibold transition hover:bg-white hover:text-black">
              View all +
            </button>
          </div>
          <div className="w-2/3">
            <div className="mb-3 flex justify-end">
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
        </div>
      </section>
    </div>
  );
};

export default HeroPopcorithm;
