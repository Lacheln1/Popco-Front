import React from "react";

interface CastAndCrewProps {
  director: { name: string; role: string; imageUrl: string };
  cast: { name: string; imageUrl: string }[];
}

const CastAndCrew: React.FC<CastAndCrewProps> = ({ director, cast }) => {
  return (
    <div className="flex h-full flex-col">
      {/* 감독 섹션 */}
      <div>
        <h3 className="mb-4 px-4 text-lg font-bold sm:text-xl">감독</h3>
        <div className="flex items-center gap-4">
          <img
            src={director.imageUrl}
            alt={director.name}
            className="ml-3 h-14 w-14 rounded-full object-cover sm:ml-9 sm:h-16 sm:w-16 lg:ml-5"
          />
          <div>
            <p className="font-semibold sm:text-base">{director.name}</p>
            <p className="text-xs text-gray-500 sm:text-sm">{director.role}</p>
          </div>
        </div>
      </div>

      {/* 출연진 섹션 */}
      <div className="mt-8">
        <h3 className="mb-4 px-4 text-lg font-bold sm:text-xl">출연진</h3>
        <div className="grid grid-cols-5 gap-x-2 gap-y-4 px-2">
          {cast.map((actor, index) => (
            <div key={`${actor.name}-${index}`} className="text-center">
              <img
                src={actor.imageUrl}
                alt={actor.name}
                className="mx-auto mb-2 h-14 w-14 rounded-full object-cover sm:h-16 sm:w-16"
              />
              <p className="text-xs font-semibold sm:text-sm">{actor.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CastAndCrew;
