import React, { useEffect, useState } from "react";
import { SwiperNavigation } from "../common/SwiperButton";
import { Swiper as SwiperType } from "swiper";
import "swiper/swiper-bundle.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { fetchLikeContents } from "@/apis/contentsApi";
import Spinner from "./../common/Spinner";
import { useNavigate } from "react-router-dom";

interface LikeContent {
  contentId: number;
  contentType: string;
  title: string;
  overview: string;
  ratingAverage: number;
  releaseDate: string;
  ratingCount: number;
  backdropPath: string;
  posterPath: string;
  runtime: number;
  genreIds: number[];
  likedAt: string;
}

interface LikeContentsProps {
  accessToken: string | null;
}

const LikeContents: React.FC<LikeContentsProps> = ({ accessToken }) => {
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | undefined>(
    undefined,
  );
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [likeContents, setLikeContents] = useState<LikeContent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

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
    const fetchData = async () => {
      if (!accessToken) {
        console.log("accessToken이 없습니다");
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await fetchLikeContents(accessToken);

        // API 응답 구조에 맞게 데이터 추출 (code: 200)
        if (response && response.code === 200 && response.data) {
          setLikeContents(response.data);
        } else {
          setError("좋아요한 컨텐츠를 불러올 수 없습니다.");
        }
      } catch (err) {
        console.error("좋아요한 컨텐츠 조회 실패:", err);
        setError("좋아요한 컨텐츠를 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [accessToken]);

  return (
    <div>
      <div className="pb-5">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="gmarket-bold py-2 text-base md:text-2xl">
            내가 좋아해요
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
            <Spinner />
            좋아요한 컨텐츠를 불러오는 중...
          </div>
        )}

        {/* 에러 상태 */}
        {error && (
          <div className="flex h-32 items-center justify-center text-red-500">
            {error}
          </div>
        )}

        {/* 데이터가 없는 경우 */}
        {!loading && !error && likeContents.length === 0 && (
          <div className="flex h-32 items-center justify-center text-gray-500">
            아직 좋아요한 컨텐츠가 없습니다.
          </div>
        )}

        {/* 스와이퍼 컨테이너 */}
        {!loading && !error && likeContents.length > 0 && (
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
              {likeContents.map((content) => (
                <SwiperSlide key={content.contentId} className="!h-auto">
                  <div
                    className="group cursor-pointer overflow-hidden rounded-lg bg-white shadow-sm transition-shadow hover:shadow-md"
                    onClick={() =>
                      navigate(
                        `/detail/${content.contentType}/${content.contentId}`,
                      )
                    }
                  >
                    <div className="aspect-[3/4] overflow-hidden">
                      <img
                        src={`https://image.tmdb.org/t/p/original/${content.posterPath}`}
                        alt={content.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="truncate text-sm font-medium text-gray-800">
                        {content.title}
                      </h3>
                      <p className="mt-1 text-xs text-gray-500">
                        {content.contentType === "movie" ? "영화" : "TV 시리즈"}
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

export default LikeContents;
