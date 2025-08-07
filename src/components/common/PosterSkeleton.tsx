const PosterSkeleton = () => {
  return (
    <div className="w-[260px] space-y-3 rounded-xl bg-white p-3 shadow-sm ring-1 ring-gray-200">
      {/* 포스터 영역 */}
      <div className="relative aspect-[7/10] w-full overflow-hidden rounded-lg bg-gray-200">
        <div className="animate-shimmer absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)] bg-[length:200%_100%]" />
      </div>

      {/* 텍스트 영역 */}
      <div className="space-y-2">
        <div className="relative h-4 w-3/4 overflow-hidden rounded bg-gray-200">
          <div className="animate-shimmer absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)] bg-[length:200%_100%]" />
        </div>
        <div className="relative h-4 w-1/2 overflow-hidden rounded bg-gray-200">
          <div className="animate-shimmer absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)] bg-[length:200%_100%]" />
        </div>
      </div>
    </div>
  );
};

export default PosterSkeleton;
