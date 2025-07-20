import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { TbHandClick } from "react-icons/tb";
import { GoArrowUpRight } from "react-icons/go";
import { useState } from "react";

const banners = [
  { src: "/images/main/banner-popco.png", link: "/" },
  { src: "/images/main/banner-event.png", link: "/event" },
  { src: "/images/main/banner-chat.png", link: "/chat" }, // 챗봇 연결은 추후 수정
  { src: "/images/main/banner-popco.png", link: "/" },
  { src: "/images/main/banner-event.png", link: "/event" },
  { src: "/images/main/banner-chat.png", link: "/chat" },
];

const HeroCarousel = () => {
  const prevRef = useRef<HTMLDivElement>(null);
  const nextRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="relative w-screen">
      <Swiper
        modules={[Navigation, Autoplay]}
        className="mainSwiper overflow-hidden"
        slidesPerView={1.7}
        spaceBetween={20}
        centeredSlides
        loop
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        onBeforeInit={(swiper: SwiperType) => {
          if (
            swiper.params.navigation &&
            typeof swiper.params.navigation !== "boolean"
          ) {
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
          }
        }}
        breakpoints={{
          0: {
            slidesPerView: 1,
            spaceBetween: 0,
            centeredSlides: false,
          },
          768: {
            slidesPerView: 1.3,
            spaceBetween: 0,
            centeredSlides: true,
          },
          1200: {
            slidesPerView: 1.6,
            spaceBetween: 10,
            centeredSlides: true,
          },
          2560: {
            slidesPerView: 3,
            spaceBetween: 10,
            centeredSlides: true,
          },
        }}
      >
        {banners.map(({ src }, idx) => (
          <SwiperSlide key={idx}>
            <img
              src={src}
              alt={`banner-${idx}`}
              className="aspect-video rounded-2xl object-cover md:aspect-auto"
            />
          </SwiperSlide>
        ))}
        <NavigationButton ref={prevRef} position="left" />
        <NavigationButton ref={nextRef} position="right" />
      </Swiper>
      <button
        className="absolute -bottom-7 left-1/2 z-[1] flex -translate-x-1/2 items-center gap-2 rounded-full bg-white/40 px-4 py-2 text-sm shadow-[0px_4px_15px_rgba(0,0,0,0.1)] backdrop-blur-md sm:h-14 sm:gap-3 sm:px-6 sm:py-3 sm:text-base"
        onClick={() => (window.location.href = banners[activeIndex].link)}
      >
        <div className="rounded-full bg-white p-1.5 shadow-md sm:p-2">
          <TbHandClick className="text-lg text-red-600 sm:text-xl" />
        </div>
        <div className="gmarket-medium whitespace-nowrap text-sm sm:text-base">
          See More
        </div>
        <GoArrowUpRight className="text-xl sm:text-2xl" />
      </button>
      <style>
        {`
          .swiper-slide {
            transition: transform 0.3s ease, opacity 0.3s ease;
          }
          .swiper-slide.swiper-slide-active {
            transform: scale(1);
            opacity: 1;
          }
          .swiper-slide:not(.swiper-slide-active) {
            transform: scale(0.8);
            opacity: 0.6;
          }
          @media (max-width: 786px) {
            .swiper-slide {
              transform: scale(1);
              opacity: 1;
            }
        `}
      </style>
    </div>
  );
};

type NavigationButtonProps = {
  position: "left" | "right";
};

// Swiper 네비게이션 버튼 컴포넌트
const NavigationButton = React.forwardRef<
  HTMLDivElement,
  NavigationButtonProps
>(({ position }, ref) => {
  const baseClass =
    "absolute text-center content-center top-1/2 z-10 h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/20 text-white sm:flex";
  const mobilePosition =
    position === "left" ? "left-2 md:left-[22%]" : "right-2 md:right-[22%]";
  const symbol = position === "left" ? "◀" : "▶";

  return (
    <div ref={ref} className={`${baseClass} ${mobilePosition}`}>
      {symbol}
    </div>
  );
});
NavigationButton.displayName = "NavigationButton";

export default HeroCarousel;
