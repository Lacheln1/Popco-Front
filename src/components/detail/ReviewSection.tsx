import React, { useState } from "react";
import { Dropdown } from "antd";
import type { MenuProps } from "antd";

// Swiper 관련 임포트
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperType } from "swiper";
import "swiper/css";

import ReviewCard from "@/components/common/ReviewCard";
import { SwiperNavigation } from "@/components/common/SwiperButton";
import AiReviewSummaryBg from "@/assets/AiReviewPopco.png";

// ReviewCard에 필요한 데이터 타입 (가져왔다고 가정)
interface ReviewData {
  movieTitle: string;
  score: number;
  reviewText: string;
  nickname: string;
  likeCount: number;
  isSpoiler: boolean;
  isOwnReview: boolean;
  isLiked: boolean;
  hasAlreadyReported: boolean;
}

// 목업 데이터
const initialMockReviews: ReviewData[] = [
  // isLiked 상태를 일부러 false로 설정하여 테스트
  {
    movieTitle: "F1 더무비",
    score: 3.0,
    reviewText: "F1 입문하기에 좋은 영화",
    nickname: "ㅇㄹㄴㅇㄹ",
    likeCount: 120,
    isSpoiler: false,
    isOwnReview: false,
    isLiked: false,
    hasAlreadyReported: false,
  },
  {
    movieTitle: "F1 더무비",
    score: 5.0,
    reviewText: "정말 재미있고 감동적인 레이싱 영화입니다. 꼭 보세요!",
    nickname: "abcdfasdf",
    likeCount: 120,
    isSpoiler: false,
    isOwnReview: false,
    isLiked: true,
    hasAlreadyReported: false,
  },
  {
    movieTitle: "F1 더무비",
    score: 2.0,
    reviewText:
      "졸작이라고는 할 수 없다. 감독이 판타지와 현실을 어떻게 연결할지...",
    nickname: "gdsss",
    likeCount: 120,
    isSpoiler: true,
    isOwnReview: false,
    isLiked: false,
    hasAlreadyReported: false,
  },
  {
    movieTitle: "F1 더무비",
    score: 1.5,
    reviewText:
      "기대했는데 너무 실망스러워요. 스토리가 너무 뻔하고 지루합니다.",
    nickname: "MovieLover2",
    likeCount: 15,
    isSpoiler: false,
    isOwnReview: false,
    isLiked: false,
    hasAlreadyReported: false,
  },
  {
    movieTitle: "F1 더무비",
    score: 4.0,
    reviewText: "사운드 디자인이 압권이네요. 영화관에서 꼭 봐야 할 영화.",
    nickname: "SoundMan",
    likeCount: 88,
    isSpoiler: false,
    isOwnReview: false,
    isLiked: false,
    hasAlreadyReported: false,
  },
  {
    movieTitle: "F1 더무비",
    score: 3.0,
    reviewText:
      "주인공이 마지막에 우승하는 장면은 정말 감동이었어요. 스포주의!",
    nickname: "스포일러빌런",
    likeCount: 42,
    isSpoiler: true,
    isOwnReview: false,
    isLiked: false,
    hasAlreadyReported: false,
  },
];

const ReviewSection: React.FC = () => {
  const [swiper, setSwiper] = useState<SwiperType | null>(null);
  // ✅ 리뷰 목록을 state로 관리
  const [reviews, setReviews] = useState<ReviewData[]>(initialMockReviews);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [sortOrder, setSortOrder] = useState("최신순");

  const handleSlideChange = (swiperInstance: SwiperType) => {
    setIsBeginning(swiperInstance.isBeginning);
    setIsEnd(swiperInstance.isEnd);
  };

  const handleSortChange = (key: string) => {
    setSortOrder(key === "1" ? "최신순" : "인기순");
  };

  const handleLikeToggle = (clickedIndex: number) => {
    setReviews((currentReviews) =>
      currentReviews.map((review, index) => {
        if (index === clickedIndex) {
          const newLikeCount = review.isLiked
            ? review.likeCount - 1
            : review.likeCount + 1;
          return {
            ...review,
            isLiked: !review.isLiked,
            likeCount: newLikeCount,
          };
        }
        return review;
      }),
    );
  };

  const sortItems: MenuProps["items"] = [
    { key: "1", label: "최신순", onClick: () => handleSortChange("1") },
    { key: "2", label: "인기순", onClick: () => handleSortChange("2") },
  ];

  return (
    <section>
      <h3 className="mb-6 text-2xl font-bold">리뷰</h3>

      {/* 부모 요소에 relative 추가하여 위치 기준점으로 설정 */}
      <div
        className="relative mx-auto mb-10 h-32 w-full max-w-3xl bg-contain bg-center bg-no-repeat md:h-40"
        style={{ backgroundImage: `url(${AiReviewSummaryBg})` }}
      >
        <p className="absolute left-[52%] top-[60%] w-full max-w-md -translate-x-1/2 -translate-y-1/2 px-4 text-center text-sm leading-relaxed text-gray-600 md:text-base">
          리뷰에서 많이 언급된 특징을 AI가 분석했어요.
          <br />
          팝코가 요약한 결과, 액션과 연출에 대한 평이 높아요!
        </p>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <Dropdown menu={{ items: sortItems }} trigger={["click"]}>
          <button className="ml-3 mt-3 flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-gray-900">
            {sortOrder}
            <svg
              width="16"
              height="16"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5 7.5L10 12.5L15 7.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </Dropdown>

        <SwiperNavigation
          swiper={swiper}
          isBeginning={isBeginning}
          isEnd={isEnd}
        />
      </div>

      <Swiper
        slidesPerView="auto"
        spaceBetween={16}
        onSwiper={setSwiper}
        onSlideChange={handleSlideChange}
        className="pb-2"
      >
        {reviews.map((review, index) => (
          <SwiperSlide key={index} className="!h-auto !w-[150px] md:!w-[250px]">
            <ReviewCard
              reviewData={review}
              onLikeClick={() => handleLikeToggle(index)}
              onReport={() => console.log("report clicked")}
              onEdit={() => console.log("edit clicked")}
              onDelete={() => console.log("delete clicked")}
              onCardClick={() => console.log("card clicked")}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default ReviewSection;
