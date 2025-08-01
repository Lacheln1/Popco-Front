import React, { useState } from "react";
import reviewIconUrl from "@/assets/review.png";
import emptyPlusIconUrl from "@/assets/empty-plus.png";
import fullPlusIconUrl from "@/assets/full-plus.png";
import folderIconUrl from "@/assets/folder.png";
import ReviewModal from "../ReviewModal/ReviewModal";
import AddToCollectionModal from "../collection/AddToCollectionModal";
import { useMyReview } from "@/hooks/queries/review/useMyReview";
import { App } from "antd";
import { useParams } from "react-router-dom";

interface ActionButtonsProps {
  isWished: boolean;
  onWishClick: () => void;
  isDesktop?: boolean;
  token?: string | null;
  movieTitle: string;
  moviePoster: string;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  isWished,
  onWishClick,
  isDesktop = false,
  token,
  movieTitle,
  moviePoster,
}) => {
  const iconSize = isDesktop ? "h-8 w-8" : "h-6 w-6";
  const textSize = isDesktop ? "text-sm" : "text-xs";
  const gap = isDesktop ? "gap-2" : "gap-1";

  const { message } = App.useApp();
  const { id, type = "" } = useParams();
  const contentId = id ? Number(id) : undefined;

  const { data, isLoading, isError } = useMyReview(
    contentId,
    type,
    token ?? undefined,
  );
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isAddToCollectionModalOpen, setIsAddToCollectionModalOpen] =
    useState(false);

  if (isLoading || isError || !data) return null;
  const { existUserReview, myReview } = data;

  const handleReviewClick = () => {
    if (!token) {
      message.info("로그인 먼저 진행해주세요!", 1.5);
      return;
    }
    setIsReviewModalOpen(true);
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
          <img src={reviewIconUrl} alt="리뷰 쓰기" className={iconSize} />
          <span className={`${textSize} font-semibold`}>
            {existUserReview ? "리뷰 수정" : "리뷰 쓰기"}
          </span>
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

      <ReviewModal
        isModalOpen={isReviewModalOpen}
        setIsModalOpen={setIsReviewModalOpen}
        isAuthor={true}
        isWriting={!existUserReview}
        contentsTitle={
          movieTitle || myReview?.title || "선택된 영화가 없습니다."
        }
        contentsImg={moviePoster || myReview?.posterPath || "/images/n.png"}
        popcorn={myReview?.score ?? 0}
        reviewDetail={myReview?.text ?? ""}
        author="나"
        likeCount={0}
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
