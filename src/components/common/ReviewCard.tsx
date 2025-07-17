import React, { useState } from "react";
import { Card, Dropdown } from "antd";
import type { MenuProps } from "antd";

import MenuIcon from "../../assets/menu-3dot.svg";
import EmptyLikeIcon from "../../assets/empty-like.png";
import FullLikeIcon from "../../assets/full-like.png";
import FullPopcornIcon from "../../assets/full-popcorn.svg";
import HalfPopcornIcon from "../../assets/half-popcorn.svg";

const ReviewCard = ({
  reviewData,
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
          className="h-5 w-5 md:h-6 md:w-6"
        />,
      );
    }
    if (hasHalfPopcorn) {
      popcorns.push(
        <img
          key="half"
          src={HalfPopcornIcon}
          alt="Half"
          className="ml-1 h-5 w-2 md:h-6 md:w-2"
        />,
      );
    }
    return popcorns;
  };

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: "신고하기",
      onClick: (e) => {
        e.stopPropagation();
        onReport();
      },
      disabled: hasAlreadyReported,
    },
  ];
  if (isOwnReview) {
    items.push(
      {
        key: "2",
        label: "수정하기",
        onClick: (e) => {
          e.stopPropagation();
          onEdit();
        },
      },
      {
        key: "3",
        label: "삭제하기",
        onClick: (e) => {
          e.stopPropagation();
          onDelete();
        },
        danger: true,
      },
    );
  }

  const cardMenu = (
    <div className="cursor-default" onClick={(e) => e.stopPropagation()}>
      <Dropdown menu={{ items }} trigger={["click"]} placement="bottomRight">
        <button type="button" className="-mr-3 focus:outline-none md:-mr-2">
          <img
            src={MenuIcon}
            alt="메뉴"
            className="h-5 w-5 cursor-pointer md:h-6 md:w-6"
          />
        </button>
      </Dropdown>
    </div>
  );

  const handleSpoilerClick = (e) => {
    if (!isSpoilerRevealed) {
      e.stopPropagation();
      setIsSpoilerRevealed(true);
    }
  };

  const clickableTitle = (
    <div
      onClick={onCardClick}
      className="h-full w-full cursor-pointer text-sm font-bold md:text-lg"
    >
      {truncatedTitle}
    </div>
  );

  return (
    <div
      className="w-[150px] rounded-lg shadow-lg transition-shadow duration-300 hover:shadow-xl md:w-[250px]"
      onClick={onCardClick}
    >
      <Card
        title={clickableTitle}
        extra={cardMenu}
        className="h-full w-full"
        variant="borderless"
        styles={{
          header: {
            padding: "10px 12px",
            minHeight: "auto",
          },
          body: { padding: 0 },
        }}
      >
        {/* 내부 여백 및 폰트 크기 반응형 적용 */}
        <div
          onClick={onCardClick}
          className="flex cursor-pointer flex-col gap-y-1 p-2 pt-0 md:gap-y-3 md:p-4"
        >
          <div className="flex items-center gap-x-1 md:gap-x-2">
            <div className="flex items-center">{renderPopcorns()}</div>
            <span className="text-sunglasses-red text-base font-bold md:text-lg">
              {score.toFixed(1)}
            </span>
          </div>

          <p
            className={`line-clamp-2 min-h-[18px] text-xs leading-relaxed text-gray-800 md:min-h-[40px] md:text-sm ${
              isSpoiler && !isSpoilerRevealed
                ? "select-none blur-sm filter"
                : ""
            }`}
            onClick={isSpoiler ? handleSpoilerClick : undefined}
          >
            {reviewText}
          </p>

          <div
            className="mt-auto flex cursor-default items-center justify-between border-t border-gray-100 pt-1 md:pt-2"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="text-xs text-gray-500 md:text-sm">{nickname}</span>
            <div className="flex items-center gap-x-1">
              <img
                src={isLiked ? FullLikeIcon : EmptyLikeIcon}
                alt="좋아요"
                className="h-4 w-4 cursor-pointer"
                onClick={onLikeClick}
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
