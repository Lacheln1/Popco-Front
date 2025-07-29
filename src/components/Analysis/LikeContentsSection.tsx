import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { Swiper as SwiperType } from "swiper";
import { SwiperNavigation } from "@/components/common/SwiperButton";
import { Dropdown } from "antd";
import { DownOutlined } from "@ant-design/icons";
import "swiper/swiper-bundle.css";

const LikeContentSection: React.FC = () => {
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | undefined>(
    undefined,
  );
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [selected, setSelected] = useState<"movie" | "series">("movie");

  const categoryMap = {
    movie: "영화",
    series: "시리즈",
  };

  // 드롭다운 메뉴 항목
  const items = [
    {
      key: "movie",
      label: "영화",
    },
    {
      key: "series",
      label: "시리즈",
    },
  ];

  // 카테고리 변경 핸들러
  const handleCategoryChange = (key: string) => {
    const category = key as "movie" | "series";
    setSelected(category);

    // 여기서 백엔드 API 호출
    console.log("API 호출:", category);
  };

  const handleSwiperInit = (swiper: SwiperType) => {
    console.log("초기화됨:", swiper);
    setSwiperInstance(swiper);
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  };

  const handleSlideChange = (swiper: SwiperType) => {
    console.log("슬라이드 변경:", swiper.activeIndex);
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  };

  const slidesData = [
    {
      id: 1,
      title: "굿보이",
      image: "https://image.tmdb.org/t/p/w500/hPea3Qy5Gd6z4kJLUruBbwAH8Rm.jpg",
    },
    {
      id: 2,
      title: "견우와 선녀",
      image: "https://image.tmdb.org/t/p/w500/hPea3Qy5Gd6z4kJLUruBbwAH8Rm.jpg",
    },
    {
      id: 3,
      title: "서초동",
      image: "https://image.tmdb.org/t/p/w500/hPea3Qy5Gd6z4kJLUruBbwAH8Rm.jpg",
    },
    {
      id: 4,
      title: "F1 더 무비",
      image: "https://image.tmdb.org/t/p/w500/hPea3Qy5Gd6z4kJLUruBbwAH8Rm.jpg",
    },
    {
      id: 5,
      title: "싸이버 펑크 2077 엣지러너",
      image: "https://image.tmdb.org/t/p/w500/hPea3Qy5Gd6z4kJLUruBbwAH8Rm.jpg",
    },
    {
      id: 6,
      title: "싸이버 펑크 2077 엣지러너",
      image: "https://image.tmdb.org/t/p/w500/hPea3Qy5Gd6z4kJLUruBbwAH8Rm.jpg",
    },
    {
      id: 7,
      title: "싸이버 펑크 2077 엣지러너",
      image: "https://image.tmdb.org/t/p/w500/hPea3Qy5Gd6z4kJLUruBbwAH8Rm.jpg",
    },
  ];

  return (
    <div className="pretendard flex justify-center px-3 py-8 md:px-8">
      <div className="flex w-full max-w-[1200px] flex-col bg-slate-50 px-4 py-5">
        {/* 헤더 섹션 */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="gmarket text-lg text-gray-800">
              <span className="gmarket-bold">'액션 헌터'</span>
              <span className="ml-1">들이 장르불문 좋아하는</span>

              <Dropdown
                menu={{
                  items,
                  onClick: ({ key }) => handleCategoryChange(key),
                }}
                placement="bottomLeft"
                arrow
              >
                <button className="ml-2 inline-flex items-center rounded-md bg-white py-1 text-sm sm:text-xl">
                  {categoryMap[selected]} <DownOutlined className="ml-1" />
                </button>
              </Dropdown>
            </div>
          </div>

          <SwiperNavigation
            swiper={swiperInstance}
            isBeginning={isBeginning}
            isEnd={isEnd}
          />
        </div>

        <div className="relative">
          <Swiper
            modules={[Navigation]}
            spaceBetween={16}
            slidesPerView={5.5}
            onSwiper={handleSwiperInit}
            onSlideChange={handleSlideChange}
            breakpoints={{
              320: {
                slidesPerView: 2.5,
                spaceBetween: 12,
              },
              640: {
                slidesPerView: 3.5,
                spaceBetween: 14,
              },
              768: {
                slidesPerView: 4.5,
                spaceBetween: 16,
              },
              1024: {
                slidesPerView: 5.5,
                spaceBetween: 16,
              },
            }}
            className="w-full"
          >
            {slidesData.map((slide) => (
              <SwiperSlide key={slide.id}>
                <div className="group cursor-pointer overflow-hidden rounded-lg bg-white shadow-sm transition-shadow hover:shadow-md">
                  <div className="aspect-[3/4] overflow-hidden">
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="truncate text-sm font-medium text-gray-800">
                      {slide.title}
                    </h3>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default LikeContentSection;
