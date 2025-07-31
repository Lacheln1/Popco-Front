import { useState } from "react";
import { Card, Dropdown } from "antd";
import type { MenuProps } from "antd";

import MenuIcon from "@/assets/menu-3dot.svg";
import EmptyLikeIcon from "@/assets/empty-like.png";
import FullLikeIcon from "@/assets/full-like.png";
import FullPopcornIcon from "@/assets/full-popcorn.svg";
import HalfPopcornIcon from "@/assets/half-popcorn.svg";
import { useNavigate } from "react-router-dom";

interface ReviewData {
  movieTitle: string;
  score: number;
  reviewText: string;
  nickname: string;
  likeCount: number;
  isSpoiler: boolean;
  isOwnReview: boolean;
  isLiked: boolean;
  hasAlreadyReported: boolean;
}

interface ReviewCardProps {
  reviewData: ReviewData;
  contentId?: number;
  contentType?: string;
  onLikeClick?: () => void;
  onReport?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onCardClick?: () => void;
}

const ReviewCard: React.FC<ReviewCardProps> = ({
  reviewData,
  contentId,
  contentType,
  onLikeClick,
  onReport,
  onEdit,
  onDelete,
  onCardClick,
}) => {
  const {
    movieTitle,
    score,
    reviewText,
    nickname,
    likeCount,
    isSpoiler,
    isOwnReview,
    isLiked,
    hasAlreadyReported,
  } = reviewData;

  const [isSpoilerRevealed, setIsSpoilerRevealed] = useState(false);
  const truncatedTitle =
    movieTitle.length > 8 ? movieTitle.substring(0, 8) + "..." : movieTitle;

  const renderPopcorns = () => {
    const popcorns = [];
    const fullPopcorns = Math.floor(score);
    const hasHalfPopcorn = score % 1 !== 0;

    for (let i = 0; i < fullPopcorns; i++) {
      popcorns.push(
        <img
          key={`full-${i}`}
          src={FullPopcornIcon}
          alt="Full"
          className="h-4 w-4 md:h-6 md:w-6"
        />,
      );
    }
    if (hasHalfPopcorn) {
      popcorns.push(
        <img
          key="half"
          src={HalfPopcornIcon}
          alt="Half"
          className="ml-1 h-3 w-2 md:h-4 md:w-3"
        />,
      );
    }
    return popcorns;
  };

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: "신고하기",
      onClick: onReport,
      disabled: hasAlreadyReported,
    },
  ];

  if (isOwnReview) {
    items.push(
      {
        key: "2",
        label: "수정하기",
        onClick: onEdit,
      },
      {
        key: "3",
        label: "삭제하기",
        onClick: onDelete,
        danger: true,
      },
    );
  }

  const cardMenu = (
    <div
      className="cursor-default"
      onClick={(e: React.MouseEvent) => e.stopPropagation()}
    >
      <Dropdown menu={{ items }} trigger={["click"]} placement="bottomRight">
        <button type="button" className="-mr-2 focus:outline-none">
          <img src={MenuIcon} alt="메뉴" className="h-6 w-6 cursor-pointer" />
        </button>
      </Dropdown>
    </div>
  );

  const handleSpoilerClick = (e: React.MouseEvent<HTMLParagraphElement>) => {
    if (!isSpoilerRevealed) {
      e.stopPropagation();
      setIsSpoilerRevealed(true);
    }
  };

  const navigate = useNavigate();

  const clickableTitle = (
    <div
      onClick={() => {
        if (contentId && contentType) {
          navigate(`/detail/${contentType}/${contentId}`);
        } else {
          if (onCardClick) onCardClick();
        }
      }}
      className="h-full w-full cursor-pointer text-sm font-bold md:text-lg"
    >
      {truncatedTitle}
    </div>
  );

  return (
    <div
      className="flex h-full w-[150px] flex-col rounded-lg shadow-lg transition-shadow duration-300 hover:shadow-xl md:w-[250px]"
      onClick={onCardClick}
    >
      <Card
        title={clickableTitle}
        extra={cardMenu}
        className="h-full w-full"
        variant="borderless"
        styles={{
          header: {
            padding: "4px 12px",
            minHeight: "auto",
          },
          body: { padding: 0 },
        }}
      >
        <div
          onClick={onCardClick}
          className="flex h-full cursor-pointer flex-col gap-y-1 px-3 md:gap-y-3 md:px-4 md:py-2"
        >
          <div className="flex items-center gap-x-1 md:gap-x-2">
            <div className="flex items-center">{renderPopcorns()}</div>
            <span className="text-sunglasses-red text-base font-bold md:text-lg">
              {score.toFixed(1)}
            </span>
          </div>

          <p
            className={`line-clamp-2 min-h-[36px] text-xs leading-relaxed text-gray-800 md:min-h-[40px] md:text-sm ${
              isSpoiler && !isSpoilerRevealed
                ? "select-none blur-sm filter"
                : ""
            }`}
            onClick={isSpoiler ? handleSpoilerClick : undefined}
          >
            {reviewText}
          </p>

          <div
            className="mt-auto flex cursor-default items-center justify-between border-t border-gray-100 py-1 md:py-2"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            <span className="line-clamp-1 text-xs text-gray-500 md:text-sm">
              {nickname}
            </span>
            <div className="flex items-center gap-x-1">
              <img
                src={isLiked ? FullLikeIcon : EmptyLikeIcon}
                alt="좋아요"
                className="h-4 w-4 cursor-pointer"
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  if (onLikeClick) onLikeClick();
                }}
              />
              <span className="text-xs font-medium text-gray-600 md:text-sm">
                {likeCount}
              </span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ReviewCard;
