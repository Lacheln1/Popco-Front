import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
  useVelocity,
  useAnimationFrame,
} from "framer-motion";
import { wrap } from "@motionone/utils";
import { useRef, useState } from "react";
import ReviewCard from "../common/ReviewCard";

interface ParallaxRowProps {
  baseVelocity: number;
}

const ParallaxReviewRow = ({ baseVelocity }: ParallaxRowProps) => {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });

  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
    clamp: false,
  });

  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`);
  const directionFactor = useRef(1);

  useAnimationFrame((delta) => {
    let moveBy = directionFactor.current * baseVelocity * 0.5 * (delta / 1000);

    if (velocityFactor.get() < 0) {
      directionFactor.current = -1;
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = 1;
    }

    moveBy += directionFactor.current * moveBy * velocityFactor.get();
    baseX.set(baseX.get() + moveBy);
  });

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

  const duplicatedCards = Array.from({ length: 8 }).flatMap((_, i) => [
    <div key={`a-${i}`} className="w-[250px] flex-shrink-0">
      <ReviewCard reviewData={reviewData} {...handlers} />
    </div>,
    <div key={`b-${i}`} className="w-[250px] flex-shrink-0">
      <ReviewCard reviewData={reviewData} {...handlers} />
    </div>,
  ]);

  return (
    <div className="overflow-hidden">
      <motion.div className="flex gap-4 px-4 py-5 md:px-8" style={{ x }}>
        {duplicatedCards}
      </motion.div>
    </div>
  );
};

const HeroReview = () => {
  return (
    <div className="bg-footerBlue overflow-x-hidden py-10">
      <h3 className="gmarket mx-auto px-4 py-8 text-xl leading-snug text-white sm:text-2xl md:text-[28px] xl:w-[1200px]">
        최근 뜨고 있는 리뷰
      </h3>
      <ParallaxReviewRow baseVelocity={-5} />
      <ParallaxReviewRow baseVelocity={5} />
    </div>
  );
};

export default HeroReview;
