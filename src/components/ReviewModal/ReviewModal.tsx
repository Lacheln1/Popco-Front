import { Modal, Input, Avatar, Checkbox, Button, App } from "antd";
import { CheckboxProps } from "antd/lib";
import { UserOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import PopcornRating from "../common/PopcornRating";
import { ReviewModalProps } from "@/types/Reviews.types";
import { usePostReview, usePutReview } from "@/hooks/useReviews";
import { getUserDetail } from "@/apis/userApi";
import { TMDB_IMAGE_BASE_URL } from "@/constants/contents";

interface CustomReviewModalProps extends ReviewModalProps {
  onUpdateSuccess?: (newScore: number) => void;
  contentId?: number;
  contentType?: string;
}

const ReviewModal = ({
  isModalOpen,
  setIsModalOpen,
  isWriting,
  contentsTitle,
  contentsImg,
  popcorn = 0,
  reviewDetail = "",
  author = "익명",
  token,
  reviewId,
  onUpdateSuccess,
  contentId: propsContentId,
  contentType: propsContentType,
}: CustomReviewModalProps) => {
  const { TextArea } = Input;
  const { id: paramsId, type: paramsType } = useParams();

  // props로 받은 값이 있으면 우선 사용, 없으면 useParams 사용
  const contentId = propsContentId || Number(paramsId);
  const contentType = propsContentType || paramsType || "";

  const [review, setReview] = useState("");
  const [score, setScore] = useState(popcorn);
  const [isSpoiler, setIsSpoiler] = useState(false);
  const [userProfile, setUserProfile] = useState<{
    nickname: string;
    profileImageUrl: string;
  } | null>(null);

  const { message } = App.useApp();

  const { mutate: postReview, isPending: isPosting } = usePostReview(
    contentId,
    contentType,
  );
  const { mutate: putReview, isPending: isPutting } = usePutReview(
    contentId,
    contentType,
  );
  const isSubmitting = isPosting || isPutting;

  // 사용자 프로필 정보 가져오기
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (token && isModalOpen) {
        try {
          const response = await getUserDetail(token);
          if (response.data) {
            setUserProfile({
              nickname: response.data.nickname,
              profileImageUrl: response.data.profileImageUrl,
            });
          }
        } catch (error) {
          console.error("사용자 프로필 가져오기 실패:", error);
        }
      }
    };

    fetchUserProfile();
  }, [token, isModalOpen]);

  // 모달이 열릴 때마다 상태 초기화
  useEffect(() => {
    if (isModalOpen) {
      setReview(reviewDetail);
      setScore(popcorn);
      setIsSpoiler(false);
    } else {
      // 모달이 닫힐 때 상태 완전 초기화
      setReview("");
      setScore(0);
      setIsSpoiler(false);
      setUserProfile(null);
    }
  }, [isModalOpen, reviewDetail, popcorn]);

  const handleCancel = () => {
    setIsModalOpen(false);
    // 상태 초기화
    setReview("");
    setScore(0);
    setIsSpoiler(false);
    setUserProfile(null);
  };

  const handleSpoilerChange: CheckboxProps["onChange"] = (e) => {
    setIsSpoiler(e.target.checked);
  };

  const handleSave = () => {
    // 디버깅용 로그
    console.log("handleSave 호출:", {
      review: review.trim(),
      contentType,
      token,
      contentId,
      reviewId,
      isWriting,
    });

    if (!review.trim()) {
      message.warning("리뷰 내용을 입력해주세요.");
      return;
    }

    if (!contentType || !token) {
      message.error("필수 정보가 없습니다. 다시 시도해주세요.");
      console.error("Missing info:", { contentType, token });
      return;
    }

    if (!contentId) {
      message.error("콘텐츠 정보를 찾을 수 없습니다.");
      return;
    }

    const body = {
      score,
      text: review.trim(),
      status: (isSpoiler ? "SPOILER" : "COMMON") as "SPOILER" | "COMMON",
    };

    const commonOptions = {
      onSuccess: () => {
        message.success(
          `리뷰가 성공적으로 ${isWriting ? "등록" : "수정"}되었습니다.`,
        );
        // 모달 닫기
        setIsModalOpen(false);
        onUpdateSuccess?.(score);
        // 상태 초기화
        setReview("");
        setScore(0);
        setIsSpoiler(false);
        setUserProfile(null);
        // 콜백 실행
      },
      onError: (error: any) => {
        console.error("리뷰 처리 오류:", error);
        message.error(error.message || "리뷰 처리 중 오류가 발생했습니다.");
      },
    };

    if (isWriting) {
      console.log("리뷰 등록 요청:", { body, contentId, contentType });
      postReview({ body, token }, commonOptions);
    } else if (reviewId) {
      console.log("리뷰 수정 요청:", {
        reviewId,
        body,
        contentId,
        contentType,
      });
      putReview({ reviewId, body, token }, commonOptions);
    }
  };

  return (
    <Modal
      centered
      open={isModalOpen}
      onCancel={handleCancel}
      closable={false}
      maskClosable={!isSubmitting}
      footer={
        <div className="flex justify-center gap-3 pb-2">
          <Button
            key="back"
            onClick={handleCancel}
            disabled={isSubmitting}
            size="large"
            className="h-10 rounded-full px-8 py-2"
          >
            취소
          </Button>
          <Button
            key="submit"
            type="primary"
            loading={isSubmitting}
            onClick={handleSave}
            size="large"
            className="h-10 rounded-full px-8 py-2"
          >
            저장
          </Button>
        </div>
      }
    >
      <div className="center mb-6 flex gap-4">
        <img
          className="w-24 rounded-md 2sm:w-28"
          src={
            contentsImg.startsWith("http")
              ? contentsImg
              : `${TMDB_IMAGE_BASE_URL}${contentsImg}`
          }
          alt={contentsTitle}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/placeholder-image.png"; // 이미지 로드 실패 시 대체 이미지
          }}
        />
        <div className="flex flex-col gap-3 self-center">
          {" "}
          {/* gap 증가 */}
          <div className="text-xl font-semibold">{contentsTitle}</div>
          <div className="mt-1">
            {" "}
            {/* 팝콘 평점 위치 조정 */}
            <PopcornRating
              readonly={false}
              initialRating={score}
              onRatingChange={setScore}
            />
          </div>
        </div>
      </div>
      <div className="relative">
        <div className="absolute left-1/2 top-6 z-10 flex w-11/12 -translate-x-1/2 justify-between">
          <div className="flex items-center gap-2 text-xs">
            <Avatar
              size="small"
              src={userProfile?.profileImageUrl}
              icon={!userProfile?.profileImageUrl && <UserOutlined />}
            />
            <span>{userProfile?.nickname || author}</span>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox onChange={handleSpoilerChange} checked={isSpoiler}>
              스포일러 포함
            </Checkbox>
          </div>
        </div>
        <TextArea
          placeholder="리뷰를 남겨주세요"
          maxLength={250}
          showCount
          rows={8} // rows 감소
          autoSize={false}
          value={review}
          onChange={(e) => setReview(e.target.value)}
          className="mb-6 mt-4 h-[200px] w-full rounded-lg bg-slate-50 2sm:h-[220px]"
          style={{
            backgroundColor: "#f8fafc",
            padding: "2.5rem 1rem 1rem 1rem",
            outline: "none",
            boxShadow: "none",
            borderColor: "transparent",
            resize: "none",
          }}
        />
      </div>
    </Modal>
  );
};

export default ReviewModal;
