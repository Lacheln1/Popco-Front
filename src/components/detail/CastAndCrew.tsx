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
        <h3 className="mb-4 px-4 text-xl font-bold">감독</h3>
        <div className="flex items-center gap-4 pl-3">
          <img
            src={director.imageUrl}
            alt={director.name}
            className="h-16 w-16 rounded-full object-cover"
          />
          <div>
            <p className="font-semibold">{director.name}</p>
            <p className="text-sm text-gray-500">{director.role}</p>
          </div>
        </div>
      </div>

      {/* 출연진 섹션 */}
      <div className="mt-8">
        <h3 className="mb-4 px-4 text-xl font-bold">출연진</h3>
        <div className="grid grid-cols-5 gap-x-2 gap-y-4">
          {cast.map((actor, index) => (
            <div key={`${actor.name}-${index}`} className="text-center">
              <img
                src={actor.imageUrl}
                alt={actor.name}
                className="mx-auto mb-2 h-16 w-16 rounded-full object-cover"
              />
              <p className="text-sm font-semibold">{actor.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CastAndCrew;
