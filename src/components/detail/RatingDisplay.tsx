// RatingDisplay.tsx
// 평균 팝콘, 나의 팝콘을 표시하는 컴포넌트

import PopcornRating from "@/components/common/PopcornRating";

const RatingDisplay = ({
  label,
  rating,
  initialRating,
  onRatingChange,
  size,
}) => (
  <div className="flex items-center gap-4">
    <PopcornRating
      initialRating={initialRating ?? rating}
      onRatingChange={onRatingChange}
      readonly={!onRatingChange}
      size={size}
      showScore={false}
    />
    <div className="flex flex-col items-center">
      <span className={`${size === 36 ? "text-2xl" : "text-lg"} font-bold`}>
        {rating.toFixed(1)}
      </span>
      <span className="text-xs text-gray-500">{label}</span>
    </div>
  </div>
);

export default RatingDisplay;