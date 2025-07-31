import React, { useState } from "react";
import reviewIconUrl from "@/assets/review.png";
import emptyPlusIconUrl from "@/assets/empty-plus.png";
import fullPlusIconUrl from "@/assets/full-plus.png";
import folderIconUrl from "@/assets/folder.png";
import ReviewModal from "../ReviewModal/ReviewModal";
import AddToCollectionModal from "../collection/AddToCollectionModal";

// Props 타입 정의
interface ActionButtonsProps {
  isWished: boolean;
  onWishClick: () => void;
  isDesktop?: boolean;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  isWished,
  onWishClick,
  isDesktop = false,
}) => {
  const iconSize = isDesktop ? "h-8 w-8" : "h-6 w-6";
  const textSize = isDesktop ? "text-sm" : "text-xs";
  const gap = isDesktop ? "gap-2" : "gap-1";

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isAddToCollectionModalOpen, setIsAddToCollectionModalOpen] = useState(false);

  return (
    <>
      <div
        className={`flex items-center text-center text-gray-600 ${isDesktop ? "gap-8" : "w-full justify-around"}`}
      >
        <button
          type="button"
          className={`flex flex-col items-center ${gap} hover:opacity-80`}
          onClick={() => setIsReviewModalOpen(true)}
        >
          <img src={reviewIconUrl} alt="리뷰 쓰기" className={iconSize} />
          <span className={`${textSize} font-semibold`}>리뷰 쓰기</span>
        </button>
        
        <button
          type="button"
          onClick={onWishClick}
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
          onClick={() => setIsAddToCollectionModalOpen(true)}
        >
          <img src={folderIconUrl} alt="콜렉션 추가" className={iconSize} />
          <span className={`${textSize} font-semibold`}>콜렉션 추가</span>
        </button>
      </div>

      {/* 리뷰 모달 */}
      <ReviewModal
        isModalOpen={isReviewModalOpen}
        setIsModalOpen={setIsReviewModalOpen}
        isAuthor={false}
        isWriting={true}
        contentsTitle="F1 더 무비"
        contentsImg="bvVoP1t2gNvmE9ccSrqR1zcGHGM.jpg"
        popcorn={3.5}
        reviewDetail="정말 재밌는 영화였어요!"
        author="너굴맨"
        likeCount={13}
        isLiked={false}
      />

      <AddToCollectionModal
        isOpen={isAddToCollectionModalOpen}
        onClose={() => setIsAddToCollectionModalOpen(false)}
        contentToAdd={{
          id: 456, 
          title: "F1 더 무비",
          posterUrl: "bvVoP1t2gNvmE9ccSrqR1zcGHGM.jpg",
        }}
      />
    </>
  );
};

export default ActionButtons;
