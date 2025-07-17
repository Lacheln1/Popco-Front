import LikePopcorn from "@/components/popcorn/LikePopcorn";
import HatePopcorn from "@/components/popcorn/HatePopcorn";
import { HiCursorClick } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

type LikeState = "liked" | "hated" | "neutral";

type PosterProps = {
  title: string;
  posterUrl: string;
  id: string;
  likeState: LikeState;
  onLikeChange: (newState: LikeState) => void;
};

const Poster = ({
  title,
  posterUrl,
  id,
  likeState,
  onLikeChange,
}: PosterProps) => {
  const navigator = useNavigate();

  const handlePosterClick = () => navigator(`/detail/${id}`);

  const toggleState = (e: React.MouseEvent, target: LikeState) => {
    e.stopPropagation();
    onLikeChange(likeState === target ? "neutral" : target);
  };

  const isLiked = likeState === "liked";
  const isHated = likeState === "hated";

  const renderReactionButton = (
    type: "like" | "hate",
    isSelected: boolean,
    onClick: (e: React.MouseEvent) => void,
    sizeClass: string,
  ) => {
    const Component = type === "like" ? LikePopcorn : HatePopcorn;
    const shouldDim = likeState !== "neutral" && !isSelected;

    return (
      <div
        className={`${sizeClass} flex items-center justify-center rounded-full transition-opacity duration-300 sm:bg-white ${
          shouldDim ? "opacity-70" : "opacity-100"
        }`}
      >
        <Component isSelected={isSelected} onClick={onClick} />
      </div>
    );
  };

  return (
    <div className="group flex w-[35vw] min-w-[100px] max-w-[210px] flex-col gap-1 md:w-[210px]">
      <div
        onClick={handlePosterClick}
        role="button"
        className="relative w-full cursor-pointer"
      >
        <img
          className="relative aspect-[7/10] w-full rounded-md object-cover"
          src={posterUrl}
          alt="poster"
        />

        {/* PC 호버용 오버레이 */}
        <div className="absolute inset-0 hidden items-center justify-center gap-4 rounded-md bg-black/40 p-2 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100 sm:flex">
          {renderReactionButton(
            "like",
            isLiked,
            (e) => toggleState(e, "liked"),
            "h-[80px] w-[80px]",
          )}
          {renderReactionButton(
            "hate",
            isHated,
            (e) => toggleState(e, "hated"),
            "h-[80px] w-[80px]",
          )}

          <div className="absolute bottom-7 flex items-center gap-3 text-white">
            <span>자세히 보기</span>
            <HiCursorClick />
          </div>
        </div>
      </div>

      {/* 모바일 하단 버튼 */}
      <div className="flex w-full items-center justify-between gap-2">
        <div className="w-1/2 overflow-hidden truncate text-ellipsis text-[clamp(0.78rem,3vw,1rem)] sm:text-[17px]">
          {title}
        </div>
        <div className="flex w-1/2 items-center justify-end gap-2 sm:hidden">
          {renderReactionButton(
            "like",
            isLiked,
            (e) => toggleState(e, "liked"),
            "w-[8vw]",
          )}
          {renderReactionButton(
            "hate",
            isHated,
            (e) => toggleState(e, "hated"),
            "w-[8vw]",
          )}
        </div>
      </div>
    </div>
  );
};

export default Poster;
