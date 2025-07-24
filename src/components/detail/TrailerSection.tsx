import React, { useState, useMemo, useCallback } from 'react';
import YouTube from 'react-youtube';

interface Trailer {
  videoId: string;
  thumbnailUrl: string;
}

interface TrailerSectionProps {
  trailers: Trailer[];
}

const TrailerSection: React.FC<TrailerSectionProps> = ({ trailers }) => {
  if (!trailers || trailers.length === 0) {
    return null;
  }

  const [activeTrailer, setActiveTrailer] = useState<Trailer>(trailers[0]);

  // useMemo: activeTrailer가 바뀔 때만 썸네일 리스트를 새로 계산
  const thumbnailTrailers = useMemo(() => {
    return trailers
      .filter((trailer) => trailer.videoId !== activeTrailer.videoId)
      .slice(0, 3);
  }, [trailers, activeTrailer]);

  const handleThumbnailClick = useCallback((trailer: Trailer) => {
    setActiveTrailer(trailer);
  }, []); 

  const handleImageError = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      e.currentTarget.src =
        'https://placehold.co/120x90/cccccc/333333?text=No+Image';
    },
    []
  );

  return (
    <div className="px-4 lg:px-0">
      <h3 className="text-xl font-bold mb-4">트레일러</h3>

      {/* 메인 영상 플레이어 */}
      <div className="w-full lg:w-10/12 aspect-video mb-4 rounded-lg overflow-hidden bg-gray-200">
        <YouTube
          videoId={activeTrailer.videoId}
          opts={{
            width: '100%',
            height: '100%',
            playerVars: {
              autoplay: 0,
              modestbranding: 1,
              rel: 0,
            },
          }}
          className="w-full h-full"
        />
      </div>

      {/* 썸네일 리스트 */}
      <div className="w-full lg:w-10/12 grid grid-cols-3 gap-2">
        {thumbnailTrailers.map((trailer) => (
          <button
            key={trailer.videoId}
            onClick={() => handleThumbnailClick(trailer)}
            className="rounded-md overflow-hidden aspect-video hover:opacity-80 focus:ring-2 focus:ring-blue-500 bg-gray-200"
          >
            <img
              src={trailer.thumbnailUrl}
              alt={`Trailer thumbnail ${trailer.videoId}`}
              className="w-full h-full object-cover"
              onError={handleImageError}
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default TrailerSection;