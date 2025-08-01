import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { Swiper as SwiperType } from "swiper";
import { SwiperNavigation } from "@/components/common/SwiperButton";
import { Dropdown } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { fetchHeroPersona } from "@/apis/personaApi";
import { PersonaRecommendation } from "@/types/Persona.types";
import "swiper/swiper-bundle.css";

interface LikeContentSectionProps {
  userId: number;
  personaName: string;
  accessToken: string;
}

const LikeContentSection: React.FC<LikeContentSectionProps> = ({
  userId,
  personaName,
  accessToken,
}) => {
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | undefined>(
    undefined,
  );
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [selected, setSelected] = useState<"movie" | "tv">("movie");
  const [recommendations, setRecommendations] = useState<
    PersonaRecommendation[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const categoryMap = {
    movie: "영화",
    tv: "시리즈",
  };

  // 드롭다운 메뉴 항목
  const items = [
    {
      key: "movie",
      label: "영화",
    },
    {
      key: "tv",
      label: "시리즈",
    },
  ];

  // API 호출 함수
  const fetchRecommendations = async (contentType: "movie" | "tv") => {
    if (!accessToken) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // contentType을 "all"로 먼저 시도해보기
      const response = await fetchHeroPersona(userId, accessToken, "all");

      // 만약 "all"로도 데이터가 없다면 contentType 파라미터 없이 시도
      if (!response.recommendations || response.recommendations.length === 0) {
        const fallbackResponse = await fetchHeroPersona(userId, accessToken);

        if (
          fallbackResponse.recommendations &&
          fallbackResponse.recommendations.length > 0
        ) {
          // 선택된 타입에 맞는 데이터만 필터링
          const filteredRecommendations =
            fallbackResponse.recommendations.filter(
              (item) => item.type === contentType,
            );

          setRecommendations(filteredRecommendations);
          return;
        }
      }

      // 선택된 타입에 맞는 데이터만 필터링
      const filteredRecommendations = response.recommendations.filter(
        (item) => item.type === contentType,
      );

      setRecommendations(filteredRecommendations);
    } catch (err) {
      console.error("추천 데이터 가져오기 실패:", err);
      setError("데이터를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트 마운트 시 초기 데이터 로드
  useEffect(() => {
    if (accessToken && userId) {
      fetchRecommendations(selected);
    }
  }, [accessToken, userId, selected]);

  // 카테고리 변경 핸들러
  const handleCategoryChange = (key: string) => {
    const category = key as "movie" | "tv";
    setSelected(category);
    fetchRecommendations(category);
  };

  const handleSwiperInit = (swiper: SwiperType) => {
    setSwiperInstance(swiper);
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  };

  const handleSlideChange = (swiper: SwiperType) => {
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  };

  // 포스터 이미지 URL 생성
  const getImageUrl = (posterPath: string) => {
    return posterPath.startsWith("http")
      ? posterPath
      : `https://image.tmdb.org/t/p/w500${posterPath}`;
  };

  return (
    <div className="pretendard flex justify-center px-3 py-8 md:px-8">
      <div className="flex w-full max-w-[1200px] flex-col bg-slate-50 px-4 py-5">
        {/* 헤더 섹션 */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="gmarket text-lg text-gray-800">
              <span className="gmarket-bold">'{personaName}'</span>
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
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="text-gray-500">데이터를 불러오는 중...</div>
            </div>
          ) : error ? (
            <div className="flex h-64 items-center justify-center">
              <div className="text-red-500">{error}</div>
            </div>
          ) : recommendations.length === 0 ? (
            <div className="flex h-64 items-center justify-center">
              <div className="text-gray-500">
                추천 데이터가 없습니다.
                <div className="mt-2 text-xs text-gray-400">
                  현재 상태: {selected} | 총 {recommendations.length}개
                </div>
              </div>
            </div>
          ) : (
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
              {recommendations.map((item) => (
                <SwiperSlide key={item.contentId}>
                  <div className="group cursor-pointer overflow-hidden rounded-lg bg-white shadow-sm transition-shadow hover:shadow-md">
                    <div className="aspect-[3/4] overflow-hidden">
                      <img
                        src={getImageUrl(item.poster_path)}
                        alt={item.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => {
                          // 이미지 로드 실패 시 기본 이미지로 대체
                          const target = e.target as HTMLImageElement;
                          target.src = "/images/no-image-placeholder.jpg";
                        }}
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="truncate text-sm font-medium text-gray-800">
                        {item.title}
                      </h3>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {item.genres.slice(0, 2).map((genre, index) => (
                          <span
                            key={index}
                            className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600"
                          >
                            {genre}
                          </span>
                        ))}
                      </div>
                      <div className="mt-1 text-xs text-gray-500">
                        평점: {item.predicted_rating.toFixed(1)}
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </div>
    </div>
  );
};

export default LikeContentSection;
