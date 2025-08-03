import React, { useState, useEffect, useCallback } from "react";
import YouTube from "react-youtube";

interface Trailer {
  videoId: string;
  thumbnailUrl: string;
}

interface TrailerSectionProps {
  trailers: Trailer[];
}

const TrailerSection: React.FC<TrailerSectionProps> = ({ trailers }) => {
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);

  useEffect(() => {
    if (trailers && trailers.length > 0) {
      setActiveVideoId(trailers[0].videoId);
    }
  }, [trailers]);

  const handleImageError = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      e.currentTarget.src =
        "https://placehold.co/160x90/cccccc/333333?text=No+Image";
    },
    []
  );

  if (!trailers || trailers.length === 0) {
    return (
      <div className="w-full px-4 text-center lg:px-0">
        <h3 className="mb-4 text-xl font-bold">트레일러</h3>
        <p className="text-gray-500">공개된 트레일러 영상이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="w-full px-4 lg:px-0">
      <h3 className="mb-4 text-xl font-bold">트레일러</h3>

      <div className="aspect-video w-full overflow-hidden rounded-lg bg-black shadow-lg">
        {activeVideoId && (
          <YouTube
            videoId={activeVideoId}
            opts={{
              width: "100%",
              height: "100%",
              playerVars: {
                autoplay: 0,
                modestbranding: 1,
                rel: 0,
              },
            }}
            className="h-full w-full"
            key={activeVideoId}
          />
        )}
      </div>

      <div className="mt-4 w-full overflow-x-auto pb-2">
        <div className="flex w-max space-x-3">
          {trailers.map((trailer) => (
            <div
              key={trailer.videoId}
              className="w-40 flex-shrink-0 cursor-pointer"
              onClick={() => setActiveVideoId(trailer.videoId)}
            >
              <img
                src={trailer.thumbnailUrl}
                alt={`Trailer thumbnail ${trailer.videoId}`}
                onError={handleImageError}
                className={`aspect-video w-full rounded-md object-cover transition-all duration-200 ${
                  activeVideoId === trailer.videoId
                    ? "border-4 border-pop-orange-400"
                    : "border-4 border-transparent hover:opacity-80"
                }`}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrailerSection;