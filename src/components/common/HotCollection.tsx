import React, { useState } from "react";
import { Link } from "react-router-dom";
import EmptySaveIcon from "../../assets/empty-save.svg";
import FullSaveIcon from "../../assets/full-save.svg";
import { CollectionBase } from "../../types/collectionTypes";

interface HotCollectionProps extends CollectionBase {
  saveCount: number;
}

const HotCollection: React.FC<HotCollectionProps> = ({
  collectionId,
  title,
  posters,
  saveCount,
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

  const displayPosters = new Array(4).fill(null);
  posters.slice(0, 4).forEach((poster, index) => {
    displayPosters[index] = poster;
  });

  return (
    // 포스터 4개 담는 콜렉션 카드
    <div className="w-full max-w-[235px]">
      <Link
        to={href}
        className="group relative block aspect-square w-full rounded-xl bg-zinc-200 p-1.5 shadow-lg transition-shadow hover:shadow-xl md:rounded-2xl md:p-2"
      >
        <div className="grid h-full w-full grid-cols-2 grid-rows-2 gap-1 md:gap-1.5">
          {displayPosters.map((posterUrl, index) => (
            <div
              key={index}
              className="h-full w-full overflow-hidden rounded-xl bg-zinc-400 md:rounded-2xl"
            >
              {posterUrl ? (
                <img
                  src={posterUrl}
                  alt={`${title} poster ${index + 1}`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full bg-zinc-400" />
              )}
            </div>
          ))}
        </div>

        {/* 저장 총 개수 */}
        <div className="absolute right-[8px] top-[-20px] h-[48px] w-[48px] md:h-[54px] md:w-[54px]">
          <img
            src={FullSaveIcon}
            alt="Save count badge"
            className="h-full w-full drop-shadow-md"
          />
          <div className="absolute inset-0 flex items-center justify-center pb-2 md:pb-2">
            <span className="text-sunglasses-red text-sm font-bold md:text-base">
              {saveCount}
            </span>
          </div>
        </div>
      </Link>

      {/* 제목과 찜 버튼 */}
      <div className="mt-2 flex items-center justify-between">
        <Link to={href} className="group min-w-0">
          <h3 className="group-hover max-w-[160px] truncate pl-1 text-base font-bold">
            {title}
          </h3>
        </Link>

        <button
          type="button"
          onClick={handleSaveToggle}
          aria-label="찜하기"
          className="z-10 flex-shrink-0 p-1"
        >
          <img
            src={isSaved ? FullSaveIcon : EmptySaveIcon}
            alt={isSaved ? "찜 된 상태" : "찜 안 된 상태"}
            className="h-6 w-6"
          />
        </button>
      </div>
    </div>
  );
};

export default HotCollection;
