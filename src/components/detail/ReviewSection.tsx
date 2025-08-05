import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dropdown, Button, Form, Select, App } from "antd";
import type { MenuProps } from "antd";
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperType } from "swiper";
import "swiper/css";

import {
  useFetchInfiniteReviews,
  useToggleReviewReaction,
  useDeleteReview,
  useFetchReviewSummary,
  useFetchDeclarationTypes,
  usePostReviewDeclaration,
} from "@/hooks/useReviews";
import useAuthCheck from "@/hooks/useAuthCheck";
import ReviewCard from "@/components/common/ReviewCard";
import { ReviewCardData, ContentReview } from "@/types/Reviews.types";
import { SwiperNavigation } from "@/components/common/SwiperButton";
import AiReviewSummaryBg from "@/assets/AiReviewPopco.png";
import Spinner from "@/components/common/Spinner";

interface ReviewSectionProps {
  contentId: number;
  contentType: string;
  contentTitle: string;
  onEditClick: (review: ReviewCardData) => void;
}

const ReviewSection: React.FC<ReviewSectionProps> = ({
  contentId,
  contentType,
  contentTitle,
  onEditClick,
}) => {
  const { accessToken } = useAuthCheck();
  const [swiper, setSwiper] = useState<SwiperType | undefined>(undefined);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [sortOrder, setSortOrder] = useState<"recent" | "popular">("recent");
  const [reportForm] = Form.useForm();
  const { message, modal } = App.useApp();
  const navigate = useNavigate();

  // AI 리뷰 요약 데이터 호출
  const { data: summaryData, isLoading: isSummaryLoading } =
    useFetchReviewSummary(contentId, contentType);

  // 신고 유형 조회
  const { data: declarationTypes, isLoading: isDeclarationTypesLoading } =
    useFetchDeclarationTypes();

  // 리뷰 삭제 훅
  const { mutate: deleteReview, isPending: isDeleting } = useDeleteReview(
    contentId,
    contentType,
  );

  // 신고 훅 (sortOrder를 넘겨주지 않아도 됨)
  const { mutate: reportReview, isPending: isReporting } =
    usePostReviewDeclaration(contentId, contentType);

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useFetchInfiniteReviews(contentId, contentType, sortOrder, accessToken);

  const { mutate: toggleReaction } = useToggleReviewReaction(
    contentId,
    contentType,
    sortOrder,
  );

  const transformToCardData = (review: ContentReview): ReviewCardData => ({
    reviewId: review.reviewId,
    contentId: contentId,
    contentType: contentType,
    contentTitle: contentTitle,
    score: review.score,
    reviewText: review.text,
    status: review.status,
    likeCount: review.likeCount,
    isLiked: review.isLiked,
    isOwnReview: review.isAuthor,
    hasAlreadyReported: review.isDeclaration,
    authorNickname: review.reviewerName,
    reviewDate: review.reviewDate,
  });

  const allReviews =
    data?.pages.flatMap((page) =>
      page.data.reviewList.map(transformToCardData),
    ) || [];

  const handleAuthRequiredAction = (action: () => void) => {
    if (!accessToken) {
      message.error("로그인이 필요한 기능입니다.");
      navigate("/login");
      return;
    }
    action();
  };

  const handleLikeToggle = (reviewId: number) => {
    handleAuthRequiredAction(() => {
      toggleReaction({ reviewId, token: accessToken ?? undefined });
    });
  };

  const handleReport = (reviewId: number) => {
    handleAuthRequiredAction(() => {
      const form = reportForm;
      form.resetFields();

      modal.confirm({
        title: "리뷰 신고하기",
        content: (
          <Form form={form} layout="vertical" className="mr-6 mt-4">
            <Form.Item
              name="declarationType"
              label="신고 유형"
              rules={[{ required: true, message: "신고 유형을 선택해주세요" }]}
            >
              <Select
                placeholder="신고 유형을 선택해주세요"
                loading={isDeclarationTypesLoading}
              >
                {declarationTypes?.map((type) => (
                  <Select.Option key={type.code} value={type.code}>
                    {type.description}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
        ),
        okText: "신고",
        cancelText: "취소",
        okButtonProps: { loading: isReporting },
        onOk: async () => {
          try {
            const values = await form.validateFields();
            reportReview(
              {
                reviewId,
                body: {
                  declarationType: values.declarationType,
                  content: "",
                },
                token: accessToken ?? undefined,
              },
              {
                onSuccess: () => {
                  message.success("신고가 접수되었습니다.");
                },
                onError: (error: any) => {
                  message.error(
                    error.message || "신고 처리 중 오류가 발생했습니다.",
                  );
                },
              },
            );
          } catch (error) {
            console.error("신고 폼 검증 또는 제출 실패:", error);
            return Promise.reject(error);
          }
        },
      });
    });
  };

  const handleEdit = (review: ReviewCardData) => {
    handleAuthRequiredAction(() => {
      onEditClick(review);
    });
  };

  const handleDelete = (reviewId: number) => {
    handleAuthRequiredAction(() => {
      modal.confirm({
        title: "리뷰 삭제",
        content: "정말로 리뷰를 삭제하시겠습니까?",
        okText: "삭제",
        cancelText: "취소",
        okButtonProps: { loading: isDeleting },
        async onOk() {
          deleteReview(
            { reviewId, token: accessToken ?? undefined },
            {
              onSuccess: () => {
                message.success("리뷰가 삭제되었습니다.");
              },
              onError: (error) => {
                console.error("리뷰 삭제 API 에러:", error);
                message.error("리뷰 삭제에 실패했습니다.");
              },
            },
          );
        },
      });
    });
  };

  const handleSlideChange = (swiperInstance: SwiperType) => {
    setIsBeginning(swiperInstance.isBeginning);
    setIsEnd(swiperInstance.isEnd);
  };

  const handleSortChange = (key: "recent" | "popular") => {
    setSortOrder(key);
  };

  const sortItems: MenuProps["items"] = [
    {
      key: "recent",
      label: "최신순",
      onClick: () => handleSortChange("recent"),
    },
    {
      key: "popular",
      label: "인기순",
      onClick: () => handleSortChange("popular"),
    },
  ];

  const sortOrderText = sortOrder === "recent" ? "최신순" : "인기순";

  return (
    <>
      <section>
        <h3 className="mb-6 text-2xl font-bold">리뷰</h3>

        {/* AI 리뷰 요약 섹션 */}
        <div
          className="relative mx-auto mb-10 h-32 w-full max-w-3xl bg-contain bg-center bg-no-repeat md:h-40"
          style={{ backgroundImage: `url(${AiReviewSummaryBg})` }}
        >
          <div className="absolute left-1/2 top-1/2 ml-3 flex w-full max-w-md -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center text-center">
            <p className="mt-1 text-[0.6rem] leading-relaxed text-gray-400 md:mb-2 md:text-xs">
              리뷰에서 많이 언급된 특징을 AI가 분석했어요.
            </p>
            {isSummaryLoading ? (
              <div className="mt-2">
                <Spinner />
              </div>
            ) : summaryData?.hasSummary ? (
              <p className="text-xs leading-relaxed text-gray-600 md:text-base">
                {summaryData.summary}
              </p>
            ) : (
              <p className="text-xs leading-relaxed text-gray-400 md:text-base">
                아직 충분한 리뷰가 없어 분석할 수 없습니다.
              </p>
            )}
          </div>
        </div>

        <div className="mb-4 flex items-center justify-between">
          <Dropdown menu={{ items: sortItems }} trigger={["click"]}>
            <button className="ml-1 mt-3 flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-gray-900">
              {sortOrderText}
              <svg
                width="16"
                height="16"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 7.5L10 12.5L15 7.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </Dropdown>
          <SwiperNavigation
            swiper={swiper}
            isBeginning={isBeginning}
            isEnd={isEnd}
          />
        </div>

        {isLoading && (
          <div className="flex justify-center p-8">
            <Spinner />
          </div>
        )}
        {error && (
          <div className="text-center text-gray-500">
            리뷰를 불러오는 중 오류가 발생했습니다.
          </div>
        )}

        {!isLoading && !error && allReviews.length > 0 && (
          <Swiper
            slidesPerView="auto"
            spaceBetween={28}
            onSwiper={setSwiper}
            onSlideChange={handleSlideChange}
            className="pb-2 pl-1"
          >
            {allReviews.map((reviewCardData) => (
              <SwiperSlide
                key={reviewCardData.reviewId}
                className="!h-auto !w-[150px] md:!w-[250px]"
              >
                <ReviewCard
                  reviewData={reviewCardData}
                  onLikeClick={() => handleLikeToggle(reviewCardData.reviewId)}
                  onReport={() => handleReport(reviewCardData.reviewId)}
                  onEdit={() => handleEdit(reviewCardData)}
                  onDelete={() => handleDelete(reviewCardData.reviewId)}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        )}

        {!isLoading && !error && allReviews.length === 0 && (
          <div className="py-10 text-center text-gray-400">
            작성된 리뷰가 없습니다.
          </div>
        )}

        <div className="mt-8 text-center">
          {hasNextPage && (
            <Button
              onClick={() => fetchNextPage()}
              loading={isFetchingNextPage}
              disabled={isFetchingNextPage}
            >
              {isFetchingNextPage ? "불러오는 중..." : "더보기"}
            </Button>
          )}
        </div>
      </section>
    </>
  );
};

export default ReviewSection;
