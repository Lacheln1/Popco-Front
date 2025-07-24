import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ReviewCard from "../common/ReviewCard";

const HeroReview = () => {
  const wrapperRefs = useRef<(HTMLDivElement | null)[]>([]);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(17);

  const reviewData = {
    movieTitle: "예시 제목",
    score: 4.5,
    reviewText: "예시리뷰",
    nickname: "movieFan123",
    likeCount: likeCount,
    isSpoiler: false,
    isOwnReview: false,
    isLiked: isLiked,
    hasAlreadyReported: false,
  };

  const handlers = {
    onLikeClick: () => {
      setIsLiked((prev) => !prev);
      setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
    },
    onReport: () => console.log("onReport called"),
    onEdit: () => console.log("onEdit called"),
    onDelete: () => console.log("onDelete called"),
    onCardClick: () => console.log("onCardClick called"),
  };

  useEffect(() => {
    wrapperRefs.current.forEach((wrapper, index) => {
      const section = sectionRefs.current[index];
      if (!wrapper || !section) return;

      const distance = wrapper.scrollWidth / 2; // 복제된 길이 기준
      const isEven = index % 2 === 0;

      gsap.to(wrapper, {
        x: isEven ? `+=${distance}` : `-=${distance}`,
        ease: "none",
        duration: 40,
        repeat: -1,
        modifiers: {
          x: gsap.utils.unitize(gsap.utils.wrap(-distance, 0)),
        },
      });
    });
  }, []);

  const duplicatedCards = Array.from({ length: 8 }).flatMap((_, i) => [
    <div key={`a-${i}`} className="flex-shrink-0">
      <ReviewCard reviewData={reviewData} {...handlers} />
    </div>,
    <div key={`b-${i}`} className="flex-shrink-0">
      <ReviewCard reviewData={reviewData} {...handlers} />
    </div>,
  ]);

  const renderCardRow = (rowIndex: number) => (
    <section
      className="overflow-hidden pb-6"
      ref={(el) => {
        sectionRefs.current[rowIndex] = el as HTMLDivElement | null;
      }}
    >
      <div
        className="flex gap-4 px-4 md:px-8"
        ref={(el) => {
          wrapperRefs.current[rowIndex] = el as HTMLDivElement | null;
        }}
      >
        {duplicatedCards}
      </div>
    </section>
  );

  return (
    <div className="bg-footerBlue overflow-x-hidden py-10">
      <h3 className="gmarket mx-auto px-4 py-8 text-xl leading-snug text-white sm:text-2xl md:text-[28px] xl:w-[1200px]">
        최근 뜨고 있는 리뷰
      </h3>
      {renderCardRow(0)}
      {renderCardRow(1)}
    </div>
  );
};

export default HeroReview;
