// ✅ 인터페이스에서 isDesktop 제거
interface MovieInfoProps {
  movie: {
    genres: string[];
    ott: string[];
    runtime: string;
    synopsis: string;
  };
  ottLogos: { [key: string]: string };
}

const MovieInfo: React.FC<MovieInfoProps> = ({ movie, ottLogos }) => (
  // ✅ 모바일에서는 text-sm, md 사이즈 이상에서는 기본 text 사이즈(text-base) 적용
  <div className="space-y-4 text-sm text-gray-800 md:text-base">
    <div className="flex w-full">
      {/* ✅ 모바일에서는 w-1/2, md 사이즈 이상에서는 w-auto로 자동 조절 */}
      <div className="w-1/2 md:w-auto">
        <div className="flex">
          {/* ✅ 라벨 너비를 w-16, md 사이즈 이상에서는 w-28로 변경 */}
          <p className="w-16 shrink-0 font-semibold md:w-28">장르</p>
          <p>{movie.genres.join(", ")}</p>
        </div>
      </div>
      {/* ✅ 모바일에서만 보이던 불필요한 div 제거 */}
    </div>
    <div className="flex">
      {/* ✅ 라벨 너비를 w-16, md 사이즈 이상에서는 w-28로 변경 */}
      <p className="w-24 shrink-0 font-semibold md:w-28">관람가능 OTT</p>
      <div className="flex items-center gap-2">
        {movie.ott.map((o) => (
          <img
            key={o}
            src={ottLogos[o]}
            alt={o}
            className="h-6 w-6 rounded-md"
          />
        ))}
      </div>
    </div>
    <div className="flex">
      {/* ✅ 라벨 너비를 w-16, md 사이즈 이상에서는 w-28로 변경 */}
      <p className="w-16 shrink-0 font-semibold md:w-28">상영 시간</p>
      <p>{movie.runtime}</p>
    </div>
    <div className="mt-4 flex flex-col">
      <p className="mb-2 font-semibold">줄거리</p>
      <p className="leading-relaxed text-gray-600">{movie.synopsis}</p>
    </div>
  </div>
);

export default MovieInfo;
