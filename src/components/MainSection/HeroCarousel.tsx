import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";

const banners = [
  "/images/main/banner-popco.png",
  "/images/main/banner-event.png",
  "/images/main/banner-chat.png",
  "/images/main/banner-popco.png",
  "/images/main/banner-event.png",
  "/images/main/banner-chat.png",
];

const HeroCarousel = () => {
  return (
    <div className="relative w-screen overflow-hidden">
      <Swiper
        slidesPerView={1.7}
        spaceBetween={40}
        centeredSlides={true}
        loop={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        navigation={true}
        modules={[Navigation, Autoplay]}
        className="mySwiper"
      >
        {banners.map((src, idx) => (
          <SwiperSlide key={idx}>
            <img
              src={src}
              alt="banner"
              className="w-full rounded-2xl object-cover"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* 커스텀 스타일 적용 */}
      <style>
        {`
          .swiper-button-disabled {
            opacity: 1 !important;
            pointer-events: auto !important;
            cursor: pointer !important;
          }

          .swiper-button-prev,
          .swiper-button-next {
            top: 50%;
            transform: translateY(-50%);
            width: 36px;
            height: 36px;
            color: white;
            z-index: 10;
            background: rgba(0, 0, 0, 0.2);
            border-radius: 9999px;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .swiper-button-prev:after,
          .swiper-button-next:after {
          font-size: 20px
        }

          .swiper-button-prev {
            left: 22%;
          }

          .swiper-button-next {
            right: 22%;
          }

          .swiper-slide {
            display: flex;
            justify-content: center;
            align-items: center;
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

          .swiper-slide img {
            width: 100%;
            height: auto;
            max-width: 100%;
            object-fit: cover;
            transition: all 0.3s ease;
          }

          @media (max-width: 768px) {
            .swiper-slide {
              transform: scale(1) !important;
              opacity: 1 !important;
            }

            .swiper-slide img {
              border-radius: 1rem;
            }
          }
        `}
      </style>
    </div>
  );
};

export default HeroCarousel;
