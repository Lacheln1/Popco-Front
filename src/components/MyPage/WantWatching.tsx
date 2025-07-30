import React, { useEffect, useState } from "react";
import { SwiperNavigation } from "../common/SwiperButton";
import { Swiper as SwiperType } from "swiper";
import "swiper/swiper-bundle.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { fetchWishlist } from "@/apis/contentsApi";
import MyPageChart from "./MyPageChart";

interface WishlistItem {
  wishlistId: number;
  userId: number;
  contentId: number;
  contentType: string;
  contentTitle: string;
  contentPosterUrl: string;
  createdAt: string;
}

interface WantWatchingProps {
  userId: number;
}

const WantWatching: React.FC<WantWatchingProps> = ({ userId }) => {
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | undefined>(
    undefined,
  );
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSwiperInit = (swiper: SwiperType) => {
    setSwiperInstance(swiper);
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  };

  const handleSlideChange = (swiper: SwiperType) => {
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  };

  // 위시리스트 데이터 가져오기 함수를 제거하고 외부 API 사용
  useEffect(() => {
    const fetchData = async () => {
      if (!userId) {
        console.log("userId가 없습니다");
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await fetchWishlist(userId);

        // API 응답 구조에 맞게 데이터 추출
        if (response && response.code === 200 && response.data) {
          setWishlistItems(response.data);
        } else {
          setError("위시리스트를 불러올 수 없습니다.");
        }
      } catch (err) {
        console.error("위시리스트 조회 실패:", err);
        setError("위시리스트를 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  return (
    <div>
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h1 className="gmarket-bold py-2 text-base md:text-2xl">
            내가 보고 싶어 해요
          </h1>
          <SwiperNavigation
            swiper={swiperInstance}
            isBeginning={isBeginning}
            isEnd={isEnd}
          />
        </div>

        {/* 로딩 상태 */}
        {loading && (
          <div className="flex h-32 items-center justify-center text-gray-500">
            위시리스트를 불러오는 중...
          </div>
        )}

        {/* 에러 상태 */}
        {error && (
          <div className="flex h-32 items-center justify-center text-red-500">
            {error}
          </div>
        )}

        {/* 데이터가 없는 경우 */}
        {!loading && !error && wishlistItems.length === 0 && (
          <div className="flex h-32 items-center justify-center text-gray-500">
            아직 보고 싶은 컨텐츠가 없습니다.
          </div>
        )}

        {/* 스와이퍼 컨테이너 */}
        {!loading && !error && wishlistItems.length > 0 && (
          <div className="relative -mx-6 px-6 md:mx-0 md:px-0">
            <Swiper
              modules={[Navigation]}
              spaceBetween={16}
              slidesPerView={5.5}
              onSwiper={handleSwiperInit}
              onSlideChange={handleSlideChange}
              navigation={{
                prevEl: ".swiper-button-prev",
                nextEl: ".swiper-button-next",
              }}
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
              className="w-full overflow-hidden"
            >
              {wishlistItems.map((item) => (
                <SwiperSlide key={item.wishlistId} className="!h-auto">
                  <div className="group cursor-pointer overflow-hidden rounded-lg bg-white shadow-sm transition-shadow hover:shadow-md">
                    <div className="aspect-[3/4] overflow-hidden">
                      <img
                        src={item.contentPosterUrl || "/default-poster.jpg"}
                        alt={item.contentTitle}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/default-poster.jpg";
                        }}
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="truncate text-sm font-medium text-gray-800">
                        {item.contentTitle}
                      </h3>
                      <p className="mt-1 text-xs text-gray-500">
                        {item.contentType === "movie" ? "영화" : "TV 시리즈"}
                      </p>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}
      </div>
    </div>
  );
};

export default WantWatching;
