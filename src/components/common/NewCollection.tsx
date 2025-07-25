import React, { useState } from "react";
import { Link } from "react-router-dom";
import EmptySaveIcon from "../../assets/empty-save.svg";
import FullSaveIcon from "../../assets/full-save.svg";
import { CollectionBase } from "../../types/collection";

export interface NewCollectionProps extends CollectionBase {
  userNickname: string;
  description: string;
  totalCount: number;
  isSaved: boolean;
  onSaveToggle: (collectionId: number) => void; // 인자를 collectionId만 받도록 통일
}

const NewCollection: React.FC<NewCollectionProps> = React.memo(
  ({
    collectionId,
    userNickname,
    title,
    description,
    posters = [],
    totalCount,
    isSaved,
    href,
    onSaveToggle,
  }) => {
    const [isHovered, setIsHovered] = useState(false);

    const handleSaveToggle = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onSaveToggle(collectionId); // collectionId만 전달
    };

    const displayPosters = Array.from({ length: 6 }).map(
      (_, index) => posters[index] || null,
    );

    return (
      <div className="w-[350px] rounded-xl bg-white shadow-lg transition-shadow hover:shadow-xl md:w-[450px] md:rounded-2xl">
        <Link
          to={href}
          className="group relative block w-full overflow-hidden rounded-t-xl md:rounded-t-2xl"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="relative flex h-[160px] w-full items-center">
            {displayPosters.map((posterUrl, index) => (
              <div
                key={index}
                className="absolute h-[160px] w-[110px] rounded-lg bg-zinc-400 shadow-md transition-transform duration-300"
                style={{
                  transform: `translateX(${
                    isHovered ? index * 80 : index * 68
                  }px)`,
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

        <div className="flex items-start justify-between p-4">
          <div className="min-w-0">
            <Link to={href}>
              <h3 className="max-w-[380px] truncate text-lg font-bold text-gray-800 hover:text-black">
                {title}
              </h3>
            </Link>
            <p className="mt-1 max-w-[380px] truncate text-sm text-gray-500">
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
  },
);

export default NewCollection;
