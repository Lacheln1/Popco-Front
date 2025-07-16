import React, { useState } from "react";
import { Link } from "react-router-dom";
import EmptySaveIcon from "../../assets/empty-save.svg";
import FullSaveIcon from "../../assets/full-save.svg";
import { CollectionBase } from "../../types/collectionTypes";

interface NewCollectionProps extends CollectionBase {
  userNickname: string;
  description: string;
  totalCount: number;
}

const NewCollection: React.FC<NewCollectionProps> = ({
  collectionId,
  userNickname,
  title,
  description,
  posters = [],
  totalCount,
  isInitiallySaved,
  href,
  onSaveToggle,
}) => {
  const [isSaved, setIsSaved] = useState(isInitiallySaved);

  const handleSaveToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newSavedState = !isSaved;
    setIsSaved(newSavedState);
    onSaveToggle?.(collectionId, newSavedState);
  };

  const displayPosters = new Array(6).fill(null);
  posters.slice(0, 6).forEach((poster, index) => {
    displayPosters[index] = poster;
  });

  return (
    // 전체카드
    <div className="w-full max-w-[485px] rounded-xl bg-white shadow-lg transition-shadow hover:shadow-xl md:rounded-2xl">
      <Link
        to={href}
        className="group relative block w-full overflow-hidden rounded-t-xl md:rounded-t-2xl"
      >
        {/* 포스터 6개 */}
        <div className="relative flex h-[160px] w-full items-center">
          {displayPosters.map((posterUrl, index) => (
            <div
              key={index}
              className="absolute h-[160px] w-[110px] rounded-lg bg-zinc-400 shadow-md transition-transform duration-300 group-hover:scale-105"
              style={{
                left: `${index * 15.5}%`,
                zIndex: 6 - index,
              }}
            >
              {posterUrl && (
                <img
                  src={posterUrl}
                  alt={`${title} poster ${index + 1}`}
                  className="h-full w-full rounded-lg object-cover brightness-75"
                />
              )}
            </div>
          ))}
        </div>

        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute bottom-3 left-4 z-10 flex items-baseline space-x-2 text-white">
          <p className="text-sm font-semibold">{userNickname} 님</p>
          <p className="text-xs">{totalCount}개 작품</p>
        </div>
      </Link>

      {/* 제목, 설명, 찜하기 버튼 */}
      <div className="flex items-start justify-between p-4">
        <div className="min-w-0">
          <Link to={href}>
            <h3 className="max-w-[180px] truncate text-lg font-bold">
              {title}
            </h3>
          </Link>
          <p className="mt-1 max-w-[250px] truncate text-sm text-gray-500">
            {description}
          </p>
        </div>
        <button
          type="button"
          onClick={handleSaveToggle}
          aria-label="찜하기"
          className="ml-4 flex-shrink-0 p-1"
        >
          <img
            src={isSaved ? FullSaveIcon : EmptySaveIcon}
            alt={isSaved ? "찜 된 상태" : "찜 안 된 상태"}
            className="h-7 w-7"
          />
        </button>
      </div>
    </div>
  );
};

export default NewCollection;
