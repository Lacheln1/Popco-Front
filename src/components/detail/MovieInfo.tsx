// MovieInfo.tsx
// 영화 기본 정보 (장르, OTT, 상영시간, 줄거리)를 표시하는 재사용 컴포넌트
const MovieInfo = ({ movie, ottLogos, isDesktop = false }) => (
  <div className={`space-y-4 text-gray-800 ${isDesktop ? '' : 'text-sm'}`}>
    <div className={`flex ${!isDesktop && 'w-full'}`}>
      <div className={!isDesktop ? 'w-1/2' : ''}>
        <div className="flex">
          <p className={`shrink-0 font-semibold ${isDesktop ? 'w-28' : 'w-16'}`}>장르</p>
          <p>{movie.genres.join(", ")}</p>
        </div>
      </div>
      {/* 모바일에서는 OTT가 별도 라인으로 표시될 수 있도록 처리 */}
      {!isDesktop && (
         <div className="w-1/2">
            {/* 모바일용 OTT 로직을 여기에 추가하거나 부모에서 별도 배치 */}
         </div>
      )}
    </div>
    <div className="flex">
      <p className={`shrink-0 font-semibold ${isDesktop ? 'w-28' : 'w-16'}`}>관람가능 OTT</p>
      <div className="flex items-center gap-2">
        {movie.ott.map((o) => (
          <img key={o} src={ottLogos[o]} alt={o} className="h-6 w-6 rounded-md" />
        ))}
      </div>
    </div>
    <div className="flex">
      <p className={`shrink-0 font-semibold ${isDesktop ? 'w-28' : 'w-16'}`}>상영 시간</p>
      <p>{movie.runtime}</p>
    </div>
    <div className="mt-4 flex flex-col">
      <p className="mb-2 font-semibold">줄거리</p>
      <p className="leading-relaxed text-gray-600">{movie.synopsis}</p>
    </div>
  </div>
);

export default MovieInfo;



