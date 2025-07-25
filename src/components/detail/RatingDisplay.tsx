import PopcornRating from "@/components/common/PopcornRating";

// Props 타입 정의
interface RatingDisplayProps {
  label: string;
  rating: number;
  size: number;
  initialRating?: number;
  onRatingChange?: (rating: number) => void;
}

const RatingDisplay = ({
  label,
  rating,
  initialRating,
  onRatingChange,
  size,
}: RatingDisplayProps) => (
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
