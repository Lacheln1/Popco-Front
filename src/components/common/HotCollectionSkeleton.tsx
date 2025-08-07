import React from "react";

interface HotCollectionSkeletonProps {
  size?: "large" | "small";
}

const HotCollectionSkeleton: React.FC<HotCollectionSkeletonProps> = ({ 
  size = "large" 
}) => {
  const sizeStyles = {
    large: {
      container: "w-[180px] shrink-0 md:w-[220px]",
      height: "h-[180px] md:h-[220px]",
      badgeSize: 54,
      iconSize: 24,
    },
    small: {
      container: "w-[110px] shrink-0 sm:w-[150px] lg:w-[200px]",
      height: "h-[110px] sm:h-[150px] lg:h-[200px]",
      badgeSize: 40,
      iconSize: 20,
    },
  };

  const currentStyles = sizeStyles[size];

  return (
    <div className={currentStyles.container}>
      {/* 메인 이미지 박스 스켈레톤 */}
      <div className={`${currentStyles.height} animate-pulse rounded-xl bg-gray-200 shadow-lg md:rounded-2xl`}>
      </div>

      {/* 제목 스켈레톤 */}
      <div className="mt-3">
        <div className="space-y-2">
          <div className="h-4 w-full animate-pulse rounded bg-gray-200"></div>
          <div className="h-4 w-4/5 animate-pulse rounded bg-gray-200"></div>
        </div>
      </div>
    </div>
  );
};

export default HotCollectionSkeleton;