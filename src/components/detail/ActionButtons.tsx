import React from "react";
import reviewIconUrl from "@/assets/review.png";
import emptyPlusIconUrl from "@/assets/empty-plus.png";
import fullPlusIconUrl from "@/assets/full-plus.png";
import folderIconUrl from "@/assets/folder.png";
import AddToCollectionModal from "../collection/AddToCollectionModal";
import { App } from "antd";
import { useState } from "react";
import { useParams } from "react-router-dom";

// props 타입 정의
interface ActionButtonsProps {
  isWished: boolean;
  onWishClick: () => void;
  onReviewClick: () => void;
  reviewButtonLabel: string;
  isDesktop?: boolean;
  token?: string | null;
  movieTitle: string;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  isWished,
  onWishClick,
  onReviewClick,
  reviewButtonLabel,
  isDesktop = false,
  token,
  movieTitle,
}) => {
  const iconSize = isDesktop ? "h-8 w-8" : "h-6 w-6";
  const textSize = isDesktop ? "text-sm" : "text-xs";
  const gap = isDesktop ? "gap-2" : "gap-1";
  const { message } = App.useApp();

  // 콜렉션 모달 상태는 ActionButtons가 독립적으로 가져도 괜찮음
  const { id, type = "" } = useParams();
  const contentId = id ? Number(id) : undefined;
  const [isAddToCollectionModalOpen, setIsAddToCollectionModalOpen] =
    useState(false);

  const handleWishClick = () => {
    if (!token) {
      message.info("로그인 먼저 진행해주세요!", 1.5);
      return;
    }
    onWishClick();
  };

  const handleCollectionClick = () => {
    if (!token) {
      message.info("로그인 먼저 진행해주세요!", 1.5);
      return;
    }
    setIsAddToCollectionModalOpen(true);
  };

  const handleReviewClick = () => {
    if (!token) {
      message.info("로그인 먼저 진행해주세요!", 1.5);
      return;
    }
    onReviewClick(); // 부모로부터 받은 함수 호출
  };

  return (
    <>
      <div
        className={`flex items-center text-center text-gray-600 ${isDesktop ? "gap-8" : "w-full justify-around"}`}
      >
        <button
          type="button"
          className={`flex flex-col items-center ${gap} hover:opacity-80`}
          onClick={handleReviewClick}
        >
          <img src={reviewIconUrl} alt="리뷰" className={iconSize} />
          <span className={`${textSize} font-semibold`}>
            {reviewButtonLabel}
          </span>
        </button>

        <button
          type="button"
          onClick={handleWishClick}
          className={`flex flex-col items-center ${gap} hover:opacity-80`}
        >
          <img
            src={isWished ? fullPlusIconUrl : emptyPlusIconUrl}
            alt="보고싶어요"
            className={iconSize}
          />
          <span className={`${textSize} font-semibold`}>보고싶어요</span>
        </button>

        <button
          type="button"
          className={`flex flex-col items-center ${gap} hover:opacity-80`}
          onClick={handleCollectionClick}
        >
          <img src={folderIconUrl} alt="콜렉션 추가" className={iconSize} />
          <span className={`${textSize} font-semibold`}>콜렉션 추가</span>
        </button>
      </div>

      <AddToCollectionModal
        isOpen={isAddToCollectionModalOpen}
        onClose={() => setIsAddToCollectionModalOpen(false)}
        contentToAdd={{
          id: contentId!,
          type: type,
          title: movieTitle,
        }}
      />
    </>
  );
};

export default ActionButtons;
