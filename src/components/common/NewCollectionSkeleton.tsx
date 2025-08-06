import React from "react";

interface NewCollectionSkeletonProps {
  size?: "large" | "small";
}

const NewCollectionSkeleton: React.FC<NewCollectionSkeletonProps> = ({ 
  size = "large" 
}) => {
  const maxWidth = size === "small" ? "max-w-[350px]" : "max-w-[540px]";
  const translateX = size === "large" ? 86 : 62;

  return (
    <div className={`w-full rounded-xl bg-white shadow-lg md:rounded-2xl ${maxWidth}`}>
      {/* 포스터 섹션 스켈레톤 */}
      <div className="relative h-[160px] w-full overflow-hidden rounded-t-xl bg-gray-200 animate-pulse md:rounded-t-2xl">
        {/* 그라데이션 오버레이 */}
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        
        {/* 하단 정보 스켈레톤 */}
        <div className="absolute bottom-3 left-4 z-10 flex items-baseline space-x-2">
          <div className="h-4 w-20 animate-pulse rounded bg-white/80"></div>
          <div className="h-3 w-16 animate-pulse rounded bg-white/60"></div>
        </div>
      </div>

      {/* 하단 텍스트 섹션 스켈레톤 */}
      <div className="p-4">
        <div className="space-y-2">
          <div className="h-5 w-5/6 animate-pulse rounded bg-gray-200"></div>
          <div className="h-3 w-3/4 animate-pulse rounded bg-gray-200"></div>
        </div>
      </div>
    </div>
  );
};

export default NewCollectionSkeleton;