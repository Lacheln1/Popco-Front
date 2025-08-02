import { Modal, Input, Avatar, Checkbox, Button } from "antd";
import { CheckboxProps } from "antd/lib";
import { UserOutlined } from "@ant-design/icons";
import { AiOutlineLike, AiFillLike } from "react-icons/ai";
import { useEffect, useState } from "react";
import PopcornRating from "../common/PopcornRating";
import { ReviewModalProps } from "@/types/Reviews.types";
import { useParams } from "react-router-dom";
import { deleteReview, postReview, putReview } from "@/apis/reviewApi";
import { App } from "antd";
import { useQueryClient } from "@tanstack/react-query";
import { TMDB_IMAGE_BASE_URL } from "@/constants/contents";

const ReviewModal = ({
  isModalOpen,
  setIsModalOpen,
  isAuthor,
  isWriting,
  contentsTitle,
  contentsImg,
  popcorn = 3.5,
  reviewDetail = "",
  author = "익명",
  likeCount = 0,
  isLiked = false,
  token,
  refetchMyReview,
  reviewId,
}: ReviewModalProps) => {
  const { TextArea } = Input;
  const { id, type } = useParams();
  const contentId = Number(id);
  const [review, setReview] = useState("");
  const [score, setScore] = useState(popcorn ?? 0);
  const [isSpoiler, setIsSpoiler] = useState(false);
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);

  const { message } = App.useApp();

  useEffect(() => {
    setReview(isWriting ? "" : reviewDetail);
    setScore(popcorn ?? 0);
  }, [isWriting, reviewDetail, popcorn]);

  const handleCancel = () => setIsModalOpen(false);

  const handleSpoilerChange: CheckboxProps["onChange"] = (e) => {
    setIsSpoiler(e.target.checked);
  };

  const handleOk = async () => {
    if (!review.trim() || !id || !type || !token) return;

    const reviewData = {
      score,
      text: review.trim(),
      status: (isSpoiler ? "SPOILER" : "COMMON") as "SPOILER" | "COMMON",
    };

    try {
      if (isWriting || isEditing) {
        if (isWriting) {
          await postReview(contentId, type, reviewData, token);
          message.success("리뷰가 등록되었습니다!");
        } else {
          if (!reviewId) return;
          await putReview(reviewId, reviewData, token);
          message.success("리뷰가 수정되었습니다!");
        }

        await queryClient.invalidateQueries({
          queryKey: ["myReview", contentId, type],
        });

        refetchMyReview?.();
        setIsModalOpen(false);
      }
    } catch (err) {
      message.error(
        isWriting || isEditing ? "리뷰 등록/수정에 실패했습니다." : "오류 발생",
      );
    }
  };

  const handleDelete = async () => {
    if (!reviewId || !token) return;
    try {
      await deleteReview(reviewId, token);
      message.success("리뷰가 삭제되었습니다.");
      refetchMyReview?.();
      setIsModalOpen(false);
    } catch (err) {
      message.error("리뷰 삭제에 실패했습니다.");
    }
  };

  const handleRatingChange = (newRating: number) => {
    setScore(newRating);
  };

  const renderReviewContent = () =>
    isWriting || isEditing ? (
      <TextArea
        placeholder="리뷰를 남겨주세요"
        maxLength={250}
        showCount
        rows={10}
        autoSize={false}
        value={review}
        onChange={(e) => setReview(e.target.value)}
        className="mb-8 mt-4 h-[230px] w-full rounded-lg bg-slate-50 2sm:h-[280px]"
        style={{
          backgroundColor: "#f8fafc",
          padding: "3rem 1rem 1rem 1rem",
          outline: "none",
          boxShadow: "none",
          borderColor: "transparent",
          resize: "none",
        }}
      />
    ) : (
      <div
        className="mb-8 mt-4 h-[230px] w-full whitespace-pre-wrap rounded-lg bg-slate-50 text-gray-700 2sm:h-[280px]"
        style={{ padding: "3rem 1rem 1rem 1rem" }}
      >
        {review || "작성된 리뷰가 없습니다."}
      </div>
    );

  const renderTopMeta = () => (
    <div
      className={`absolute ${isWriting || isEditing ? "top-8" : "top-3"} left-1/2 z-10 flex w-11/12 -translate-x-1/2 justify-between`}
    >
      <div className="flex items-center gap-2 text-xs">
        <Avatar size="small" icon={<UserOutlined />} />
        <span>{author}</span>
      </div>
      <div className="flex items-center gap-2">
        {isWriting || isEditing ? (
          <Checkbox onChange={handleSpoilerChange}>스포일러 포함</Checkbox>
        ) : (
          <>
            {isLiked ? (
              <AiFillLike className="size-5" />
            ) : (
              <AiOutlineLike className="size-5" />
            )}
            <span>{likeCount}</span>
          </>
        )}
      </div>
    </div>
  );

  const renderFooterButtons = () => {
    if (isWriting || isEditing) {
      return (
        <>
          <Button
            className="rounded-3xl px-10 py-5 text-base"
            onClick={handleCancel}
          >
            취소
          </Button>
          <Button
            className="rounded-3xl px-10 py-5 text-base"
            type="primary"
            onClick={handleOk}
          >
            저장
          </Button>
        </>
      );
    }

    if (isAuthor) {
      return (
        <>
          <Button
            className="rounded-3xl px-10 py-5 text-base"
            onClick={handleDelete}
          >
            삭제
          </Button>
          <Button
            className="rounded-3xl px-10 py-5 text-base"
            type="primary"
            onClick={() => setIsEditing(true)}
          >
            수정
          </Button>
        </>
      );
    }

    return (
      <Button
        className="rounded-3xl px-10 py-5 text-base"
        onClick={handleCancel}
      >
        확인
      </Button>
    );
  };

  return (
    <Modal
      centered
      className="review-modal"
      open={isModalOpen}
      onCancel={handleCancel}
      onOk={handleOk}
      maskClosable={!isWriting && !isEditing}
      styles={{ footer: { justifySelf: "center" } }}
      footer={
        <div className="flex w-full justify-center gap-4">
          {renderFooterButtons()}
        </div>
      }
    >
      {/* 헤더: 영화 정보 */}
      <div className="center flex gap-4">
        <img
          className="w-20 rounded-md 2sm:w-24"
          src={`${TMDB_IMAGE_BASE_URL}${contentsImg}`}
          alt={contentsTitle}
        />
        <div className="flex flex-col gap-2 self-center">
          <div className="text-xl font-semibold">{contentsTitle}</div>
          {isWriting || isEditing ? (
            <PopcornRating
              readonly={false}
              initialRating={score}
              onRatingChange={handleRatingChange}
            />
          ) : (
            <PopcornRating readonly={true} initialRating={popcorn} />
          )}
        </div>
      </div>

      {/* 리뷰 콘텐츠 */}
      <div className="relative">
        {renderReviewContent()}
        {renderTopMeta()}
      </div>
    </Modal>
  );
};

export default ReviewModal;
