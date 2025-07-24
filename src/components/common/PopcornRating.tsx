import React, { useState, useCallback, useEffect } from "react"; // useEffect 추가
import fullPopcornImg from "@/assets/rating-full-popcorn.svg";
import halfPopcornImg from "@/assets/rating-half-popcorn.svg";
import emptyPopcornImg from "@/assets/rating-empty-popcorn.svg";

interface PopcornRatingProps {
  initialRating?: number;
  onRatingChange?: (rating: number) => void;
  readonly?: boolean;
  size?: number;
  className?: string;
  allowHalfRating?: boolean;
  showScore?: boolean;
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
  // [수정 2] hoverRating 상태 제거
  // const [hoverRating, setHoverRating] = useState<number>(0);

  // [수정 2] 마우스 누름 상태(드래그)를 추적하기 위한 상태 추가
  const [isDragging, setIsDragging] = useState<boolean>(false);
  
  // prop이 변경될 때 내부 상태도 업데이트 (이전 리팩토링 제안 반영)
  useEffect(() => {
    setRating(initialRating);
  }, [initialRating]);

  const handleRatingChange = useCallback((newRating: number) => {
    if (readonly) return;
    setRating(newRating);
    onRatingChange?.(newRating);
  }, [readonly, onRatingChange]);

  // [수정 2] 마우스를 눌렀을 때 드래그 시작
  const handleMouseDown = (value: number) => {
    if (readonly) return;
    setIsDragging(true);
    handleRatingChange(value); // 클릭 즉시 반영
  }

  // [수정 2] 드래그 중 다른 팝콘으로 이동했을 때 점수 변경
  const handleMouseEnter = useCallback((value: number) => {
    if (readonly || !isDragging) return; // 드래그 중이 아니면 아무것도 안 함
    handleRatingChange(value);
  }, [readonly, isDragging, handleRatingChange]);


  const getPopcornImage = (index: number, currentRating: number): string => {
    const ratingValue = currentRating - index;
    if (ratingValue >= 1) return fullPopcornImg;
    if (ratingValue >= 0.5) return halfPopcornImg;
    return emptyPopcornImg;
  };

  const renderPopcorn = (index: number) => {
    // [수정 2] hoverRating을 사용하지 않고 rating만 사용
    const popcornImage = getPopcornImage(index, rating);

    // [수정 1] readonly 여부와 관계없이 동일한 div 래퍼를 사용해 간격 문제 해결
    return (
      <div 
        key={index} 
        className="relative inline-block"
        onMouseEnter={() => handleMouseEnter(index + 1)}
        // 0.5점 단위일 경우를 위해 각 영역에 이벤트 핸들러 배치
      >
        {!readonly && allowHalfRating && (
          <>
            <div 
              className="absolute left-0 top-0 h-full w-1/2 cursor-pointer z-20"
              onMouseDown={() => handleMouseDown(index + 0.5)}
              onMouseEnter={() => handleMouseEnter(index + 0.5)}
            />
            <div 
              className="absolute right-0 top-0 h-full w-1/2 cursor-pointer z-20"
              onMouseDown={() => handleMouseDown(index + 1)}
              onMouseEnter={() => handleMouseEnter(index + 1)}
            />
          </>
        )}
        {!readonly && !allowHalfRating && (
          <div 
            className="absolute inset-0 h-full w-full cursor-pointer z-20"
            onMouseDown={() => handleMouseDown(index + 1)}
          />
        )}
        <img
          src={popcornImage}
          alt={`${index + 1}번째 팝콘`}
          className="relative z-10 block select-none"
          width={size}
          height={size}
          draggable={false}
        />
      </div>
    );
  };

  // [수정 2] 마우스를 뗄 때 드래그 종료. 컴포넌트 영역 밖에서 떼도 인식하도록 window에 이벤트 설정
  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false);
    
    window.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <div className={`select-none flex items-center gap-1 ${className}`}>
      <div className="flex">
        {Array.from({ length: 5 }, (_, index) => renderPopcorn(index))}
      </div>
      {showScore && (
        // [수정 2] hoverRating을 사용하지 않음
        <span className={`ml-2 min-w-[3rem] text-lg font-bold`}>
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
};

export default PopcornRating;