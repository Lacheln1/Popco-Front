import reviewIconUrl from "@/assets/review.png";
import emptyPlusIconUrl from "@/assets/empty-plus.png";
import fullPlusIconUrl from "@/assets/full-plus.png";
import folderIconUrl from "@/assets/folder.png";
import { useState } from "react";
import ReviewModal from "../ReviewModal/ReviewModal";

// Props 타입 정의
interface ActionButtonsProps {
  isWished: boolean;
  onWishClick: () => void;
  isDesktop?: boolean;
}

const ActionButtons = ({
  isWished,
  onWishClick,
  isDesktop = false,
}: ActionButtonsProps) => {
  const iconSize = isDesktop ? "h-8 w-8" : "h-6 w-6";
  const textSize = isDesktop ? "text-sm" : "text-xs";
  const gap = isDesktop ? "gap-2" : "gap-1";

  const [isModalOpen, setIsModalOpen] = useState(false);
  const showReviewModal = () => {
    setIsModalOpen(true);
  };

  return (
    <div
      className={`flex items-center text-center text-gray-600 ${isDesktop ? "gap-8" : "w-full justify-around"}`}
    >
      <button
        type="button"
        className={`flex flex-col items-center ${gap} hover:opacity-80`}
        onClick={showReviewModal}
      >
        <img src={reviewIconUrl} alt="리뷰 쓰기" className={iconSize} />
        <span className={`${textSize} font-semibold`}>리뷰 쓰기</span>
      </button>
      <ReviewModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
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
      >
        <img src={folderIconUrl} alt="콜렉션 추가" className={iconSize} />
        <span className={`${textSize} font-semibold`}>콜렉션 추가</span>
      </button>
    </div>
  );
};

export default ActionButtons;
