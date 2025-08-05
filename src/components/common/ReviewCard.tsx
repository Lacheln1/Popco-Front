import { useState } from "react";
import { Card, Dropdown, message } from "antd";
import type { MenuProps } from "antd";
import { useNavigate } from "react-router-dom";

import { ReviewCardData } from "@/types/Reviews.types";
import MenuIcon from "@/assets/menu-3dot.svg";
import EmptyLikeIcon from "@/assets/empty-like.png";
import FullLikeIcon from "@/assets/full-like.png";
import FullPopcornIcon from "@/assets/full-popcorn.svg";
import HalfPopcornIcon from "@/assets/half-popcorn.svg";

interface ReviewCardProps extends ReviewCardData {
  onLikeClick: () => void;
  onReport: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onCardClick?: () => void;
}

const ReviewCard: React.FC<ReviewCardProps> = ({
  // ✅ 필요한 모든 속성을 파라미터에서 직접 받음
  score,
  reviewText,
  authorNickname,
  likeCount,
  status,
  isOwnReview,
  isLiked,
  hasAlreadyReported,
  contentTitle,
  contentId,
  contentType,
  onLikeClick,
  onReport,
  onEdit,
  onDelete,
  onCardClick,
}) => {
  const navigate = useNavigate();
  const [isSpoilerRevealed, setIsSpoilerRevealed] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // 타이틀 처리
  const titleToDisplay = contentTitle || "";
  const truncatedTitle =
    titleToDisplay.length > 8
      ? titleToDisplay.substring(0, 8) + "..."
      : titleToDisplay;

  // 팝콘 아이콘 렌더링
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

  // 메뉴 아이템 클릭 핸들러
  const handleMenuClick = (key: string, e: any) => {
    e.domEvent.stopPropagation();

    switch (key) {
      case "report":
        if (hasAlreadyReported) {
          message.warning("이미 신고한 리뷰입니다.");
          return;
        }
        if (isOwnReview) {
          message.warning("본인의 리뷰는 신고할 수 없습니다.");
          return;
        }
        onReport();
        break;
      case "edit":
        if (!isOwnReview) {
          message.error("본인의 리뷰만 수정할 수 있습니다.");
          return;
        }
        onEdit();
        break;
      case "delete":
        if (!isOwnReview) {
          message.error("본인의 리뷰만 삭제할 수 있습니다.");
          return;
        }
        onDelete();
        break;
    }
    setDropdownOpen(false);
  };

  // 드롭다운 메뉴 아이템
  const items: MenuProps["items"] = [
    {
      key: "report",
      label: "신고하기",
      disabled: hasAlreadyReported || isOwnReview,
      onClick: (e) => handleMenuClick("report", e),
    },
  ];

  // 작성자 본인인 경우 수정/삭제 메뉴 추가
  if (isOwnReview) {
    items.push(
      {
        key: "edit",
        label: "수정하기",
        onClick: (e) => handleMenuClick("edit", e),
      },
      {
        key: "delete",
        label: "삭제하기",
        danger: true,
        onClick: (e) => handleMenuClick("delete", e),
      },
    );
  }

  // 카드 헤더 메뉴 버튼
  const cardMenu = (
    <div
      className="cursor-default"
      onClick={(e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
      }}
    >
      <Dropdown
        menu={{ items }}
        trigger={["click"]}
        placement="bottomRight"
        open={dropdownOpen}
        onOpenChange={setDropdownOpen}
      >
        <button
          type="button"
          className="-mr-2 rounded p-1 hover:bg-gray-100 focus:outline-none"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
        >
          <img src={MenuIcon} alt="메뉴" className="h-6 w-6 cursor-pointer" />
        </button>
      </Dropdown>
    </div>
  );

  // 스포일러 클릭 핸들러
  const handleSpoilerClick = (e: React.MouseEvent<HTMLParagraphElement>) => {
    if (!isSpoilerRevealed && status === "SPOILER") {
      e.stopPropagation();
      setIsSpoilerRevealed(true);
      message.info("스포일러 내용이 공개되었습니다.");
    }
  };

  // 타이틀 클릭 핸들러
  const clickableTitle = (
    <div
      onClick={(e) => {
        e.stopPropagation();
        navigate(`/detail/${contentType}/${contentId}`);
      }}
      className="h-full w-full cursor-pointer text-sm font-semibold transition-colors md:text-lg"
      title={contentTitle}
    >
      {truncatedTitle}
    </div>
  );

  // 좋아요 클릭 핸들러
  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onLikeClick();
  };

  // 카드 전체 클릭 핸들러
  const handleCardClick = () => {
    if (onCardClick && !dropdownOpen) {
      onCardClick();
    }
  };

  return (
    <div
      className="flex h-full w-[150px] flex-col rounded-lg bg-white shadow-lg transition-shadow duration-300 hover:shadow-xl md:w-[250px]"
      onClick={handleCardClick}
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
            borderBottom: "1px solid #f0f0f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          },
          body: { padding: 0, flexGrow: 1 },
        }}
      >
        <div className="flex h-full flex-col gap-y-1 px-3 py-2 md:gap-y-3 md:px-4 md:py-3">
          {/* 평점 */}
          <div className="flex items-center gap-x-1 md:gap-x-2">
            <div className="flex items-center">{renderPopcorns()}</div>
            <span className="text-sunglasses-red text-base font-bold md:text-lg">
              {score.toFixed(1)}
            </span>
          </div>

          {/* 리뷰 내용 */}
          <div className="flex-grow">
            {status === "BLIND" ? (
              <p className="line-clamp-2 flex min-h-[36px] items-center text-xs font-semibold leading-relaxed text-gray-500 md:min-h-[40px] md:text-sm">
                검열된 리뷰입니다.
              </p>
            ) : status === "SPOILER" && !isSpoilerRevealed ? (
              <div
                className="relative cursor-pointer"
                onClick={handleSpoilerClick}
              >
                <p className="line-clamp-2 min-h-[36px] select-none text-xs leading-relaxed text-gray-800 blur-sm filter-none md:min-h-[40px] md:text-sm">
                  {reviewText}
                </p>
              </div>
            ) : (
              <p className="line-clamp-2 min-h-[36px] text-xs leading-relaxed text-gray-800 md:min-h-[40px] md:text-sm">
                {reviewText}
              </p>
            )}
          </div>

          {/* 하단 정보 */}
          <div
            className="mt-auto flex cursor-default items-center justify-between border-t border-gray-100 pt-2"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            <span className="line-clamp-1 text-xs text-gray-500 md:text-sm">
              {authorNickname}
            </span>
            <div className="flex items-center gap-x-1">
              <button
                className="p-1 transition-transform hover:scale-110"
                onClick={handleLikeClick}
                disabled={!onLikeClick}
              >
                <img
                  src={isLiked ? FullLikeIcon : EmptyLikeIcon}
                  alt="좋아요"
                  className="h-4 w-4"
                />
              </button>
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
