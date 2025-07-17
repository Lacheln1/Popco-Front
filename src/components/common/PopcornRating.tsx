import React, { useState, useCallback } from "react";
import fullPopcornImg from "@/assets/rating-full-popcorn.svg";
import halfPopcornImg from "@/assets/rating-half-popcorn.svg";
import emptyPopcornImg from "@/assets/rating-empty-popcorn.svg";

interface PopcornRatingProps {
  initialRating?: number; //초기 별점 값 (0-5)
  onRatingChange?: (rating: number) => void; // 별점 변경 시 호출되는 콜백 함수
  readonly?: boolean; // 읽기 전용 모드 여부
  size?: number; // 팝콘 아이콘 크기
  className?: string; // 추가 CSS 클래스명
  allowHalfRating?: boolean; // 0.5점 단위 클릭 허용 여부
  showScore?: boolean; // 점수 표시 여부
}

const PopcornRating: React.FC<PopcornRatingProps> = ({
  initialRating = 0,
  onRatingChange,
  readonly = false,
  size = 40,
  className = "",
  allowHalfRating = true,
  showScore = true,
}) => {
  const [rating, setRating] = useState<number>(initialRating);
  const [hoverRating, setHoverRating] = useState<number>(0);

  const handleRatingChange = useCallback(
    (newRating: number) => {
      if (readonly) return;

      setRating(newRating);
      onRatingChange?.(newRating);
    },
    [readonly, onRatingChange],
  );

  const handleMouseEnter = useCallback(
    (value: number) => {
      if (readonly) return;
      setHoverRating(value);
    },
    [readonly],
  );

  const handleMouseLeave = useCallback(() => {
    if (readonly) return;
    setHoverRating(0);
  }, [readonly]);

  const getPopcornImage = (index: number, currentRating: number): string => {
    const ratingValue = currentRating - index;

    if (ratingValue >= 1) return fullPopcornImg;
    if (ratingValue >= 0.5) return halfPopcornImg;
    return emptyPopcornImg;
  };

  const renderPopcorn = (index: number) => {
    const displayRating = hoverRating || rating;
    const popcornImage = getPopcornImage(index, displayRating);

    if (allowHalfRating && !readonly) {
      return (
        <div key={index} className="relative inline-block cursor-pointer">
          {/* 왼쪽 절반 (0.5점) */}
          <button
            type="button"
            className="absolute left-0 top-0 z-20 cursor-pointer border-none bg-transparent"
            onClick={() => handleRatingChange(index + 0.5)}
            onMouseEnter={() => handleMouseEnter(index + 0.5)}
            onMouseLeave={handleMouseLeave}
            style={{
              width: `${size / 2}px`,
              height: `${size}px`,
            }}
            aria-label={`${index + 0.5}점`}
          />

          {/* 오른쪽 절반 (1점) */}
          <button
            type="button"
            className="absolute right-0 top-0 z-20 cursor-pointer border-none bg-transparent"
            style={{
              width: `${size / 2}px`,
              height: `${size}px`,
            }}
            onClick={() => handleRatingChange(index + 1)}
            onMouseEnter={() => handleMouseEnter(index + 1)}
            onMouseLeave={handleMouseLeave}
            aria-label={`${index + 1}점`}
          />

          {/* 팝콘 이미지 */}
          <img
            src={popcornImage}
            alt={`${index + 1}번째 팝콘`}
            className="relative z-10 block transition-all duration-100 ease-in-out"
            width={size}
            height={size}
            draggable={false}
          />
        </div>
      );
    }

    // 일반 클릭 모드 (1점 단위) 또는 읽기 전용
    return (
      <button
        key={index}
        type="button"
        className={`popcorn-button border-none bg-transparent p-0.5 transition-transform duration-100 ease-in-out ${
          readonly ? "cursor-default" : "cursor-pointer"
        }`}
        onClick={() => handleRatingChange(index + 1)}
        onMouseEnter={() => handleMouseEnter(index + 1)}
        onMouseLeave={handleMouseLeave}
        disabled={readonly}
        aria-label={`${index + 1}점`}
      >
        <img
          src={popcornImage}
          alt={`${index + 1}번째 팝콘`}
          className="block select-none transition-transform duration-100 ease-in-out"
          width={size}
          height={size}
          draggable={false}
        />
      </button>
    );
  };

  return (
    <div className={`user-select-none flex items-center gap-1 ${className}`}>
      {/* 5개의 팝콘 렌더링 */}
      {Array.from({ length: 5 }, (_, index) => renderPopcorn(index))}

      {/* 현재 점수 표시 */}
      {showScore && (
        <span className={`ml-2 min-w-[60px] ${className}`}>
          {(hoverRating || rating).toFixed(1)}
        </span>
      )}
    </div>
  );
};

export default PopcornRating;
