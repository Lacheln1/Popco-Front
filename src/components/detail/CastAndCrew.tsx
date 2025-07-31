import React from "react";
import { Cast, Crew } from "@/types/Contents.types";

interface CastAndCrewProps {
  director: Crew | undefined; // 감독은 없을 수도 있으므로 undefined 허용
  cast: Cast[];
}

const CastAndCrew: React.FC<CastAndCrewProps> = ({ director, cast }) => {
  const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w185"; // w185는 인물사진에 적합한 사이즈입니다.
  const placeholderImage = "https://placehold.co/185x278/e2e8f0/4a5568?text=No+Image"; // 이미지가 없을 때 보여줄 기본 이미지

  return (
    <div className="flex h-full flex-col">
      {/* 감독 섹션 */}
      {director && (
        <div>
          <h3 className="mb-4 px-4 text-lg font-bold sm:text-xl">감독</h3>
          <div className="flex items-center gap-4">
            <img
              src={director.profilePath ? `${TMDB_IMAGE_BASE_URL}${director.profilePath}` : placeholderImage}
              alt={director.name}
              className="ml-3 h-14 w-14 rounded-full object-cover sm:ml-9 sm:h-16 sm:w-16 lg:ml-5"
            />
            <div>
              <p className="font-semibold sm:text-base">{director.name}</p>
              <p className="text-xs text-gray-500 sm:text-sm">{director.job}</p>
            </div>
          </div>
        </div>
      )}

      {/* 출연진 섹션 */}
      <div className="mt-8">
        <h3 className="mb-4 px-4 text-lg font-bold sm:text-xl">출연진</h3>
        <div className="grid grid-cols-5 gap-x-2 gap-y-4 px-2">
          {cast.slice(0, 10).map((actor) => (
            <div key={actor.actorId} className="text-center">
              <img
                src={actor.profilePath ? `${TMDB_IMAGE_BASE_URL}${actor.profilePath}` : placeholderImage}
                alt={actor.actorName}
                className="mx-auto mb-2 h-14 w-14 rounded-full object-cover sm:h-16 sm:w-16"
              />
              <p className="text-xs font-semibold sm:text-sm">{actor.actorName}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CastAndCrew;
