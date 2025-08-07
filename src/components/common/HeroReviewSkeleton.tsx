// src/components/skeleton/HeroReviewSkeleton.tsx
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const HeroReviewSkeleton = () => {
  // 한 줄에 10개 카드 * 2줄 구성
  const renderSkeletonRow = (rowIndex: number) => (
    <section key={rowIndex} className="overflow-hidden pb-6">
      <div className="flex gap-4">
        {Array.from({ length: 10 }).map((_, idx) => (
          <div key={idx} className="w-[260px] flex-shrink-0">
            <Skeleton height={150} borderRadius={12} />
            <Skeleton height={20} width="80%" className="mt-2" />
            <Skeleton height={16} width="60%" />
            <Skeleton height={16} width="70%" />
          </div>
        ))}
      </div>
    </section>
  );

  return (
    <div className="bg-footerBlue overflow-x-hidden py-10">
      {/* 상단 / 하단 슬라이드 */}
      {renderSkeletonRow(0)}
      {renderSkeletonRow(1)}
    </div>
  );
};

export default HeroReviewSkeleton;
