import React from "react";
import { Link } from "react-router-dom";
import EmptySaveIcon from "@/assets/empty-save.svg";
import FullSaveIcon from "@/assets/full-save.svg";
import { CollectionBase } from "@/types/Collection.types";

export interface HotCollectionProps extends CollectionBase {
  saveCount: number;
  isSaved: boolean;
  onSaveToggle: (collectionId: number) => void;
  size?: "large" | "small";
}

const HotCollection: React.FC<HotCollectionProps> = React.memo(
  ({
    collectionId,
    title,
    posters,
    saveCount,
    isSaved,
    href,
    onSaveToggle,
    size = "large",
  }) => {
    const handleSaveToggle = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onSaveToggle(collectionId);
    };

    const displayPosters = Array.from(
      { length: 4 },
      (_, index) => posters[index] || null,
    );

    const sizeStyles = {
      large: {
        container: "w-[180px] shrink-0 md:w-[220px]",
        badgeContainer:
          "absolute -top-4 right-2 h-12 w-12 drop-shadow-md md:-top-5 md:h-[54px] md:w-[54px]",
        badgeText: "text-sm font-bold md:text-base",
        title:
          "line-clamp-2 pl-1 text-base font-bold text-gray-800 transition-colors group-hover:text-black",
        saveIcon: "h-6 w-6",
      },
      small: {
        container: "w-[110px] shrink-0 sm:w-[150px] lg:w-[200px]",
        badgeContainer:
          "absolute -top-3 right-1 h-10 w-10 drop-shadow-md md:-top-5 md:right-2 md:h-[54px] md:w-[54px]",
        badgeText: "text-xs font-bold md:text-base",
        title:
          "line-clamp-2 pl-1 text-sm font-bold text-gray-800 transition-colors group-hover:text-black md:text-base",
        saveIcon: "h-5 w-5 md:h-6 md:w-6",
      },
    };

    const currentStyles = sizeStyles[size];

    return (
      <div className={currentStyles.container}>
        <Link
          to={href}
          className="group relative block aspect-square w-full rounded-xl bg-zinc-200 p-1.5 shadow-lg transition-all duration-200 hover:scale-[1.02] hover:shadow-xl md:rounded-2xl md:p-2"
        >
          <div className="grid h-full w-full grid-cols-2 grid-rows-2 gap-1 md:gap-1.5">
            {displayPosters.map((posterUrl, index) => (
              <div
                key={index}
                className="h-full w-full overflow-hidden rounded-lg bg-zinc-400 md:rounded-xl"
              >
                {posterUrl ? (
                  <img
                    src={`https://image.tmdb.org/t/p/original${posterUrl}`}
                    alt={`${title} poster ${index + 1}`}
                    className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <div className="h-full w-full bg-zinc-300" />
                )}
              </div>
            ))}
          </div>

          <div className={currentStyles.badgeContainer}>
            <img
              src={FullSaveIcon}
              alt="Save count badge"
              className="h-full w-full"
            />
            <div className="absolute inset-0 flex items-center justify-center pb-1 md:pb-2">
              <span
                className={`text-sunglasses-red ${currentStyles.badgeText}`}
              >
                {saveCount > 999 ? "999+" : saveCount}
              </span>
            </div>
          </div>
        </Link>

        <div className="mt-3 flex items-start justify-between gap-2">
          <Link to={href} className="group min-w-0 flex-1">
            <h3 className={currentStyles.title}>{title}</h3>
          </Link>

          <button
            type="button"
            onClick={handleSaveToggle}
            aria-label={isSaved ? "찜 해제" : "찜하기"}
            className="flex-shrink-0 rounded-full p-1 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <img
              src={isSaved ? FullSaveIcon : EmptySaveIcon}
              alt={isSaved ? "찜 된 상태" : "찜 안 된 상태"}
              className={currentStyles.saveIcon}
            />
          </button>
        </div>
      </div>
    );
  },
);

HotCollection.displayName = "HotCollection";

export default HotCollection;
