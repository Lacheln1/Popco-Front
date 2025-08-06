import LikePopcorn from "@/components/popcorn/LikePopcorn";
import HatePopcorn from "@/components/popcorn/HatePopcorn";
import { HiCursorClick } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { useLikeStore } from "@/store/useLikeStore";
import useAuthCheck from "@/hooks/useAuthCheck";
import { App } from "antd";

type LikeState = "LIKE" | "DISLIKE" | "NEUTRAL";

type PosterProps = {
  title: string;
  posterUrl: string;
  id: number;
  contentType: string;
  disableHover?: boolean;
  className?: string;
};

const Poster = ({
  title,
  posterUrl,
  id,
  contentType,
  disableHover,
  className = "",
}: PosterProps) => {
  const navigator = useNavigate();
  const { message } = App.useApp();
  const { user, accessToken } = useAuthCheck();

  const { getReaction, updateReaction } = useLikeStore();
  const likeState = getReaction(id, contentType);

  const handlePosterClick = () => navigator(`/detail/${contentType}/${id}`);

  const toggleState = async (e: React.MouseEvent, target: LikeState) => {
    e.stopPropagation();

    if (!user.isLoggedIn) {
      message.info("로그인이 필요합니다.", 1.5);
      return;
    }

    if (!accessToken) {
      message.error("인증 토큰이 없습니다.");
      return;
    }

    try {
      await updateReaction(id, contentType, target, user.userId, accessToken);

    } catch (error) {
      console.error("좋아요/싫어요 처리 실패:", error);
      message.error("처리에 실패했습니다.");
    }
  };

  const isLiked = likeState === "LIKE";
  const isHated = likeState === "DISLIKE";

  const renderReactionButton = (
    type: "LIKE" | "DISLIKE",
    isSelected: boolean,
    onClick: (e: React.MouseEvent) => void,
    sizeClass: string,
  ) => {
    const Component = type === "LIKE" ? LikePopcorn : HatePopcorn;
    const shouldDim = likeState !== "NEUTRAL" && !isSelected;

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
    <div
      className={`group flex w-[35vw] min-w-[100px] max-w-[210px] flex-col gap-1 md:w-[210px] ${className}`}
    >
      <div
        onClick={handlePosterClick}
        role="button"
        className="relative w-full cursor-pointer"
      >
        <img
          className="relative aspect-[7/10] w-full rounded-md object-cover"
          src={posterUrl}
          alt="poster"
          onError={(e) =>
            (e.currentTarget.src = "/images/popco/default_poster.png")
          }
        />
        {/* PC 호버용 오버레이 */}
        {!disableHover && (
          <div className="absolute inset-0 hidden items-center justify-center gap-4 rounded-md bg-black/40 p-2 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100 sm:flex">
            {renderReactionButton(
              "LIKE",
              isLiked,
              (e) => toggleState(e, "LIKE"),
              "h-[80px] w-[80px]",
            )}
            {renderReactionButton(
              "DISLIKE",
              isHated,
              (e) => toggleState(e, "DISLIKE"),
              "h-[80px] w-[80px]",
            )}

            <div className="absolute bottom-7 flex items-center gap-3 text-white">
              <span>자세히 보기</span>
              <HiCursorClick />
            </div>
          </div>
        )}
      </div>
      {/* 모바일 하단 버튼 */}
      <div className="flex w-full items-center justify-between gap-2">
        <div className="w-1/2 overflow-hidden truncate text-ellipsis text-[clamp(0.78rem,3vw,1rem)] sm:w-full sm:text-center sm:text-[17px]">
          {title}
        </div>
        <div className="flex w-1/2 items-center justify-end gap-2 sm:hidden">
          {renderReactionButton(
            "LIKE",
            isLiked,
            (e) => toggleState(e, "LIKE"),
            "w-[8vw]",
          )}
          {renderReactionButton(
            "DISLIKE",
            isHated,
            (e) => toggleState(e, "DISLIKE"),
            "w-[8vw]",
          )}
        </div>
      </div>
    </div>
  );
};

export default Poster;
