import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ReviewCard from "../common/ReviewCard";

gsap.registerPlugin(ScrollTrigger);

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

      const distance = wrapper.scrollWidth - section.offsetWidth;

      const [startX, endX] =
        index % 2 === 0
          ? [-distance, 0] // 왼 → 오
          : [0, -distance]; // 오 → 왼

      gsap.fromTo(
        wrapper,
        { x: startX },
        {
          x: endX,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            scrub: 0.5,
          },
        },
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  const renderCardRow = (rowIndex: number) => (
    <section
      className="overflow-hidden py-6"
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
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="w-[280px] flex-shrink-0">
            <ReviewCard reviewData={reviewData} {...handlers} />
          </div>
        ))}
      </div>
    </section>
  );

  return (
    <div className="overflow-x-hidden">
      <h3 className="gmarket mx-auto px-4 py-8 text-xl leading-snug sm:text-2xl md:text-[28px] xl:w-[1200px]">
        최근 뜨고 있는 리뷰
      </h3>
      {renderCardRow(0)}
      {renderCardRow(1)}
    </div>
  );
};

export default HeroReview;
