import React from "react";

interface MovieInfoProps {
  movie: {
    genres: string[];
    ott: { name: string; logo: string }[];
    runtime: string;
    synopsis: string;
  };
  isDesktop?: boolean;
}

const MovieInfo: React.FC<MovieInfoProps> = ({ movie }) => (
  <div className="space-y-4 text-sm text-gray-800 md:text-base">
    <div className="flex w-full">
      <div className="w-1/2 md:w-auto">
        <div className="flex">
          <p className="w-16 shrink-0 font-semibold md:w-28">장르</p>
          <p>{movie.genres.join(", ")}</p>
        </div>
      </div>
    </div>
    <div className="flex">
      <p className="w-24 shrink-0 font-semibold md:w-28">관람가능 OTT</p>
      <div className="flex items-center gap-2">
        {movie.ott.map((provider) => (
          <img
            key={provider.name}
            src={provider.logo}
            alt={provider.name}
            className="h-6 w-6 rounded-md object-cover"
          />
        ))}
      </div>
    </div>
    <div className="flex">
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
