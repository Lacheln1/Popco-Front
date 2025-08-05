// src/components/MainPage/HeroReview.tsx

import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import ReviewCard from "../common/ReviewCard";
import { useWeeklyReview } from "@/hooks/queries/review/useWeeklyReview";

const HeroReview = () => {
  const wrapperRefs = useRef<(HTMLDivElement | null)[]>([]);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const navigate = useNavigate();

  const { data = [], isLoading, isError } = useWeeklyReview();

  useEffect(() => {
    if (!data || data?.length === 0) return;

    wrapperRefs.current.forEach((wrapper, index) => {
      const section = sectionRefs.current[index];
      if (!wrapper || !section) return;

      const distance = wrapper.scrollWidth / 2;
      const isEven = index % 2 === 0;

      gsap.to(wrapper, {
        x: isEven ? `+=${distance}` : `-=${distance}`,
        ease: "none",
        duration: 80,
        repeat: -1,
        modifiers: {
          x: gsap.utils.unitize(gsap.utils.wrap(-distance, 0)),
        },
      });
    });
  }, [data]);

  const topRowData = data?.slice(0, 10);
  const bottomRowData = data?.slice(10, 20);

  const handleCardClick = (contentType: string, contentId: number) => {
    navigate(`/detail/${contentType}/${contentId}`);
  };

  const duplicatedCards = (rowData: typeof data) =>
    Array.from({ length: 4 }).flatMap((_, i) =>
      rowData.map((review, idx) => (
        <div key={`${i}-${idx}`} className="flex-shrink-0">
          <ReviewCard
            {...{
              contentTitle: review.contentTitle,
              score: review.score,
              reviewText: review.reviewText,
              authorNickname: review.userNickname,
              likeCount: review.likeCount,
              reviewId: review.reviewId,
              status: review.status,
              isOwnReview: false,
              isLiked: false,
              hasAlreadyReported: false,
              contentId: review.contentId,
              contentType: review.contentType,
            }}
            onCardClick={() =>
              handleCardClick(review.contentType, review.contentId)
            }
            onLikeClick={() => {}}
            onReport={() => {}}
            onEdit={() => {}}
            onDelete={() => {}}
          />
        </div>
      )),
    );

  const renderCardRow = (rowIndex: number, rowData: typeof data) => (
    <section
      className="overflow-hidden pb-6"
      ref={(el) => {
        sectionRefs.current[rowIndex] = el as HTMLDivElement | null;
      }}
    >
      <div
        className="flex gap-4" // 좌우 패딩 제거 (전체 너비 사용)
        ref={(el) => {
          wrapperRefs.current[rowIndex] = el as HTMLDivElement | null;
        }}
      >
        {duplicatedCards(rowData)}
      </div>
    </section>
  );

  return (
    <div className="bg-footerBlue overflow-x-hidden py-10">
      <div className="mx-auto px-4 xl:w-[1200px]">
        <h3 className="gmarket py-8 text-xl leading-snug text-white sm:text-2xl md:text-[28px]">
          최근 뜨고 있는 리뷰
        </h3>
      </div>

      {/* 로딩 중 */}
      {isLoading && (
        <div className="py-10 text-center text-white">불러오는 중입니다...</div>
      )}

      {/* 에러 발생 */}
      {isError && (
        <div className="py-10 text-center text-white">
          리뷰 데이터를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.
        </div>
      )}

      {/* 데이터는 왔지만 없음 */}
      {!isLoading && !isError && data?.length === 0 && (
        <div className="py-10 text-center text-white">
          이번 주 리뷰 데이터가 아직 없습니다.
        </div>
      )}

      {/* 정상 렌더링 */}
      {!isLoading && !isError && data?.length > 0 && (
        <>
          {renderCardRow(0, topRowData)}
          {renderCardRow(1, bottomRowData)}
        </>
      )}
    </div>
  );
};

export default HeroReview;
