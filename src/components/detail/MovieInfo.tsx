import React from "react";

interface MovieInfoProps {
  movie: {
    genres: string[];
    ott: { name:string; logo: string }[];
    runtime: string;
    synopsis: string;
  };
  isDesktop?: boolean;
}

const MovieInfo: React.FC<MovieInfoProps> = ({ movie }) => {
  // 정보가 없을 때 표시할 문구 스타일
  const noInfoText = <span className="text-gray-400">정보 없음</span>;

  return (
    <div className="space-y-4 text-sm text-gray-800 md:text-base">
      {/* 장르 */}
      <div className="flex w-full">
        <div className="w-1/2 md:w-auto">
          <div className="flex">
            <p className="w-16 shrink-0 font-semibold md:w-28">장르</p>
            <p>
              {movie.genres?.length > 0
                ? movie.genres.join(", ")
                : noInfoText}
            </p>
          </div>
        </div>
      </div>

      {/* 관람가능 OTT */}
      <div className="flex">
        <p className="w-24 shrink-0 font-semibold md:w-28">관람가능 OTT</p>
        <div className="flex items-center gap-2">
          {movie.ott?.length > 0 ? (
            movie.ott.map((provider) => (
              <img
                key={provider.name}
                src={provider.logo}
                alt={provider.name}
                className="h-6 w-6 rounded-md object-cover"
              />
            ))
          ) : (
            noInfoText
          )}
        </div>
      </div>
      
      {/* 상영 시간 */}
      <div className="flex">
        <p className="w-16 shrink-0 font-semibold md:w-28">상영 시간</p>
        <p>{movie.runtime ? movie.runtime : noInfoText}</p>
      </div>
      
      {/* 줄거리 */}
      <div className="mt-4 flex flex-col">
        <p className="mb-2 font-semibold">줄거리</p>
        <p className="leading-relaxed text-gray-600">
          {movie.synopsis ? (
            movie.synopsis
          ) : (
            <span className="text-gray-400">제공된 줄거리가 없습니다.</span>
          )}
        </p>
      </div>
    </div>
  );
};

export default MovieInfo;