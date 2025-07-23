// components/detail/ReviewSection.tsx

import React, { useState } from "react";
import { Dropdown } from "antd";
import type { MenuProps } from "antd";

// Swiper 관련 임포트
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperType } from "swiper";
import "swiper/css";

// 직접 만드신 컴포넌트 및 이미지 임포트
import ReviewCard from "@/components/common/ReviewCard";
import { SwiperNavigation } from "@/components/common/SwiperButton";
import AiReviewSummaryImg from "@/assets/AiReviewPopco.png";

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
const mockReviews: ReviewData[] = [
  { movieTitle: "F1 더무비", score: 3.0, reviewText: "F1 입문하기에 좋은 영화", nickname: "ㅇㄹㄴㅇㄹ", likeCount: 120, isSpoiler: false, isOwnReview: false, isLiked: true, hasAlreadyReported: false },
  { movieTitle: "F1 더무비", score: 5.0, reviewText: "정말 재미있고 감동적인 레이싱 영화입니다. 꼭 보세요!", nickname: "abcdfasdf", likeCount: 120, isSpoiler: false, isOwnReview: false, isLiked: false, hasAlreadyReported: false },
  { movieTitle: "F1 더무비", score: 2.0, reviewText: "졸작이라고는 할 수 없다. 감독이 판타지와 현실을 어떻게 연결할지...", nickname: "gdsss", likeCount: 120, isSpoiler: true, isOwnReview: false, isLiked: false, hasAlreadyReported: false },
  { movieTitle: "F1 더무비", score: 5.0, reviewText: "멸망을 초래할 재앙의 공포 속에서 일치해가는 후회와 죄책감", nickname: "dfsdfs", likeCount: 120, isSpoiler: false, isOwnReview: false, isLiked: true, hasAlreadyReported: true },
  { movieTitle: "F1 더무비", score: 4.5, reviewText: "멸망을 초래할 재앙의 공포 속에서 일치해가는 후회와 죄책감", nickname: "dfdf", likeCount: 120, isSpoiler: false, isOwnReview: true, isLiked: false, hasAlreadyReported: false },
  // 필요시 리뷰 데이터 추가
];


const ReviewSection: React.FC = () => {
  const [swiper, setSwiper] = useState<SwiperType | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [sortOrder, setSortOrder] = useState("최신순");

  const handleSlideChange = (swiperInstance: SwiperType) => {
    setIsBeginning(swiperInstance.isBeginning);
    setIsEnd(swiperInstance.isEnd);
  };

  const sortItems: MenuProps["items"] = [
    { key: "1", label: "최신순", onClick: () => setSortOrder("최신순") },
    { key: "2", label: "인기순", onClick: () => setSortOrder("인기순") },
  ];

  return (
    <section>
      <h3 className="text-2xl font-bold mb-6">리뷰</h3>

      {/* AI 리뷰 요약 섹션 */}
      <div className="mb-10 flex justify-center">
        <img 
          src={AiReviewSummaryImg} 
          alt="AI 리뷰 요약" 
          className="w-full max-w-2xl"
        />
      </div>

      {/* 정렬 및 네비게이션 */}
      <div className="flex justify-between items-center mb-4">
        <Dropdown menu={{ items: sortItems }} trigger={["click"]}>
          <button className="flex items-center gap-1 text-sm font-medium text-gray-600">
            {sortOrder}
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </Dropdown>
        
        <SwiperNavigation swiper={swiper} isBeginning={isBeginning} isEnd={isEnd} />
      </div>

      {/* 리뷰 카드 슬라이더 */}
      <Swiper
        slidesPerView="auto"
        spaceBetween={16}
        onSwiper={setSwiper}
        onSlideChange={handleSlideChange}
      >
        {mockReviews.map((review, index) => (
          <SwiperSlide key={index} className="!w-[150px] md:!w-[250px]">
            <ReviewCard
              reviewData={review}
              // 임시 핸들러
              onLikeClick={() => console.log("like clicked")}
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