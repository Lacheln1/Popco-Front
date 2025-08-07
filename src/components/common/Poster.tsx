import LikePopcorn from "@/components/popcorn/LikePopcorn";
import HatePopcorn from "@/components/popcorn/HatePopcorn";
import { HiCursorClick } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import useAuthCheck from "@/hooks/useAuthCheck";
import { App } from "antd";
import { useState } from "react";

type LikeState = "LIKE" | "DISLIKE" | "NEUTRAL";

type PosterProps = {
  title: string;
  posterUrl: string;
  id: number;
  contentType: string;
  disableHover?: boolean;
  className?: string;
  disabled?: boolean; // 로딩 상태를 위한 disabled prop 추가

  // 좋아요/싫어요 상태 관리 - 이제 필수 props
  likeState: LikeState;
  onLikeChange: (newState: LikeState) => void;
};

const Poster = ({
  title,
  posterUrl,
  id,
  contentType,
  disableHover,
  className = "",
  disabled = false,
  likeState,
  onLikeChange,
}: PosterProps) => {
  const navigator = useNavigate();
  const { message } = App.useApp();
  const { user } = useAuthCheck();

  const handlePosterClick = () => {
    if (!disabled) {
      navigator(`/detail/${contentType}/${id}`);
    }
  };

  const toggleState = async (e: React.MouseEvent, target: LikeState) => {
    e.stopPropagation();

    if (disabled) return; // 로딩 중이면 클릭 무시

    if (!user.isLoggedIn) {
      message.info("로그인이 필요합니다.", 1.5);
      return;
    }

    const finalState = likeState === target ? "NEUTRAL" : target;

    try {
      onLikeChange(target);

      if (finalState === "LIKE") {
        message.success("좋아요를 등록했습니다!", 1);
      } else if (finalState === "DISLIKE") {
        message.success("싫어요를 등록했습니다!", 1);
      } else {
        message.success("반응을 취소했습니다.", 1);
      }
    } catch (error) {
      console.error("좋아요/싫어요 처리 실패:", error);
      message.error("처리 중 오류가 발생했습니다.");
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
        } ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
      >
        <Component
          isSelected={isSelected}
          onClick={onClick}
          disabled={disabled}
        />
      </div>
    );
  };

  const [isImageLoaded, setIsImageLoaded] = useState(false);

  return (
    <div
      className={`group flex w-[35vw] min-w-[100px] max-w-[210px] flex-col gap-1 md:w-[210px] ${className} ${
        disabled ? "pointer-events-none opacity-75" : ""
      }`}
    >
      <div
        onClick={handlePosterClick}
        role="button"
        className={`relative w-full ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
      >
        <div className="relative w-full">
          {!isImageLoaded && (
            <div className="absolute inset-0 aspect-[7/10] w-full animate-pulse rounded-md bg-gray-200" />
          )}
          <img
            loading="lazy"
            className={`aspect-[7/10] w-full rounded-md object-cover transition-opacity duration-300 ${
              isImageLoaded ? "opacity-100" : "opacity-0"
            }`}
            src={posterUrl}
            alt="poster"
            onLoad={() => setIsImageLoaded(true)}
            onError={(e) => {
              e.currentTarget.src = "/images/popco/default_poster.png";
              setIsImageLoaded(true);
            }}
          />
        </div>

        {/* PC 호버용 오버레이 */}
        {!disableHover && !disabled && (
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

        {/* 로딩 오버레이 */}
        {disabled && (
          <div className="absolute inset-0 flex items-center justify-center rounded-md bg-black/20 backdrop-blur-sm">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
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
