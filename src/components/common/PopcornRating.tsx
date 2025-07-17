import React, { useState, useCallback } from "react";
import fullPopcornImg from "@/assets/full-popcorn.svg";
import halfPopcornImg from "@/assets/half-popcorn.svg";
import emptyPopcornImg from "@/assets/empty-popcorn.svg";

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
        <div
          key={index}
          className="popcorn-container"
          style={{
            position: "relative",
            display: "inline-block",
            cursor: "pointer",
          }}
        >
          {/* 왼쪽 절반 (0.5점) */}
          <button
            type="button"
            className="popcorn-half-button"
            onClick={() => handleRatingChange(index + 0.5)}
            onMouseEnter={() => handleMouseEnter(index + 0.5)}
            onMouseLeave={handleMouseLeave}
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: `${size / 2}px`,
              height: `${size}px`,
              background: "transparent",
              border: "none",
              cursor: "pointer",
              zIndex: 2,
            }}
            aria-label={`${index + 0.5}점`}
          />

          {/* 오른쪽 절반 (1점) */}
          <button
            type="button"
            className="popcorn-full-button"
            onClick={() => handleRatingChange(index + 1)}
            onMouseEnter={() => handleMouseEnter(index + 1)}
            onMouseLeave={handleMouseLeave}
            style={{
              position: "absolute",
              right: 0,
              top: 0,
              width: `${size / 2}px`,
              height: `${size}px`,
              background: "transparent",
              border: "none",
              cursor: "pointer",
              zIndex: 2,
            }}
            aria-label={`${index + 1}점`}
          />

          {/* 팝콘 이미지 */}
          <img
            src={popcornImage}
            alt={`${index + 1}번째 팝콘`}
            width={size}
            height={size}
            style={{
              display: "block",
              transition: "transform 0.1s ease, filter 0.1s ease",
              position: "relative",
              zIndex: 1,
              transform: hoverRating > index ? "scale(1.05)" : "scale(1)",
            }}
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
        className="popcorn-button"
        onClick={() => handleRatingChange(index + 1)}
        onMouseEnter={() => handleMouseEnter(index + 1)}
        onMouseLeave={handleMouseLeave}
        disabled={readonly}
        style={{
          background: "transparent",
          border: "none",
          padding: "2px",
          cursor: readonly ? "default" : "pointer",
          transition: "transform 0.1s ease",
        }}
        aria-label={`${index + 1}점`}
      >
        <img
          src={popcornImage}
          alt={`${index + 1}번째 팝콘`}
          width={size}
          height={size}
          style={{
            display: "block",
            transition: "transform 0.1s ease, filter 0.1s ease",
            transform:
              !readonly && hoverRating > index ? "scale(1.05)" : "scale(1)",
          }}
          draggable={false}
        />
      </button>
    );
  };

  return (
    <div
      className={`popcorn-rating ${className}`}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "4px",
        userSelect: "none",
      }}
    >
      {/* 5개의 팝콘 렌더링 */}
      {Array.from({ length: 5 }, (_, index) => renderPopcorn(index))}

      {/* 현재 점수 표시 */}
      {showScore && (
        <span
          style={{
            marginLeft: "8px",
            minWidth: "60px",
          }}
          className={`${className}`}
        >
          {(hoverRating || rating).toFixed(1)}
        </span>
      )}
    </div>
  );
};

export default PopcornRating;
