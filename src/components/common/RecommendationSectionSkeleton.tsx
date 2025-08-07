import PosterSkeleton from "../common/PosterSkeleton"; // 이미 만든 컴포넌트 사용

const RecommendationSectionSkeleton = () => {
  return (
    <div className="relative m-auto flex flex-col items-center gap-8 py-16 text-white md:flex-row md:py-8">
      {/* 오른쪽 추천 포스터 리스트 영역 */}
      <div className="w-full md:w-3/5">
        <div className="mb-3 flex justify-end px-8">
          <div className="flex gap-2">
            <div className="h-8 w-8 animate-pulse rounded-full bg-gray-600" />
            <div className="h-8 w-8 animate-pulse rounded-full bg-gray-600" />
          </div>
        </div>

        {/* 스켈레톤 카드 슬라이더 영역 */}
        <div className="pb-6">
          <div className="flex gap-4">
            {[...Array(4)].map((_, idx) => (
              <PosterSkeleton key={idx} />
            ))}
          </div>
        </div>
      </div>

      {/* 데코 이미지 (애니메이션만 유지하거나 비워도 됨) */}
      <img
        className="absolute left-[5%] w-[80px] mix-blend-screen sm:bottom-[8%] sm:left-[3%] sm:w-[100px] md:w-[120px] lg:left-[5%] lg:w-[150px]"
        src="/images/components/glossy_popcorn.png"
        alt="popcorn"
      />
      <img
        className="width-[120px] absolute left-2/3 top-[3%] mix-blend-screen md:left-[7%] md:w-[130px] lg:w-[160px]"
        src="/images/components/glossy_glass.png"
        alt="glass"
      />
      <img
        className="absolute left-[10%] top-[25%] w-[70px] mix-blend-screen sm:left-1/4 sm:top-[4%] sm:w-[90px] md:w-[100px] lg:w-[120px]"
        src="/images/components/glossy_slate.png"
        alt="slate"
      />
      <img
        className="absolute left-[10%] top-[20%] hidden mix-blend-screen sm:bottom-[65%] sm:left-[15%] sm:top-auto sm:block sm:w-[100px] md:bottom-[10%] md:left-1/4 md:w-[130px] lg:bottom-[12%] lg:w-[160px]"
        src="/images/components/glossy_tv.png"
        alt="tv"
      />
    </div>
  );
};

export default RecommendationSectionSkeleton;
