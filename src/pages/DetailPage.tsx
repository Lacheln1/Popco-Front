import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";

// --- 타입 임포트 ---
import { ContentsDetail, Crew } from "@/types/Contents.types";
import { ReviewCardData } from "@/types/Reviews.types";

// --- 훅 임포트 ---
import { useContentsDetail } from "@/hooks/useContentsDetail";
import { useMyReview } from "@/hooks/queries/review/useMyReview"; // 내 리뷰 조회 훅
import useAuthCheck from "@/hooks/useAuthCheck";
import { useFetchWishlist, useToggleWishlist } from "@/hooks/useWishlist";

// --- Zustand 스토어 임포트 ---
import { useLikeStore } from "@/store/useLikeStore";

// --- 컴포넌트 임포트 ---
import ReviewModal from "@/components/ReviewModal/ReviewModal";
import LikePopcorn from "@/components/popcorn/LikePopcorn";
import HatePopcorn from "@/components/popcorn/HatePopcorn";
import CastAndCrew from "@/components/detail/CastAndCrew";
import TrailerSection from "@/components/detail/TrailerSection";
import RatingDisplay from "@/components/detail/RatingDisplay";
import MovieInfo from "@/components/detail/MovieInfo";
import ActionButtons from "@/components/detail/ActionButtons";
import ReviewSection from "@/components/detail/ReviewSection";
import CollectionSection from "@/components/detail/CollectionSection";
import { TMDB_IMAGE_BASE_URL } from "@/constants/contents";
import Spinner from "@/components/common/Spinner";
import { App } from "antd";

type LikeState = "LIKE" | "DISLIKE" | "NEUTRAL";

// ======================================================================
// 1. UI 담당 프레젠테이셔널 컴포넌트
// ======================================================================
interface DetailContentsProps {
  contents: ContentsDetail;
  contentId: number;
  contentType: string;
  myCurrentRating: number;
  setMyCurrentRating: (rating: number | null) => void;
  isLoggedIn: boolean;
  isWished: boolean;
  handleWishClick: () => void;
  likeState: LikeState;
  onLikeChange: (targetState: LikeState) => void;
  onEditReview: (reviewData: ReviewCardData) => void;
  onReviewClick: () => void;
  reviewButtonLabel: string;
}

const DetailContents = ({
  contents,
  contentId,
  contentType,
  myCurrentRating,
  isLoggedIn,
  setMyCurrentRating,
  isWished,
  handleWishClick,
  likeState,
  onLikeChange,
  onEditReview,
  onReviewClick,
  reviewButtonLabel,
}: DetailContentsProps) => {
  const scrollRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end start"],
  });
  const bannerOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const bannerScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
  const bannerY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const { accessToken } = useAuthCheck();

  const bannerUrl = `${TMDB_IMAGE_BASE_URL}${contents.backdropPath}`;
  const posterUrl = `${TMDB_IMAGE_BASE_URL}${contents.posterPath}`;

  const director = contents.crews.find((crew: Crew) => crew.job === "Director");
  const cast = contents.casts;
  const trailerProps = (contents.videos || [])
    .filter((video) => video.type === "Trailer")
    .map((video) => ({
      videoId: video.key,
      thumbnailUrl: `https://i.ytimg.com/vi/${video.key}/sddefault.jpg`,
    }));
  const movieInfoProps = {
    genres: contents.genres.map((genre) => genre.name),
    ott: contents.watchProviders.map((provider) => ({
      name: provider.name,
      logo: `${TMDB_IMAGE_BASE_URL}${provider.logoPath}`,
    })),
    runtime: contents.runtime ? `${contents.runtime}분` : "정보 없음",
    synopsis: contents.overview,
  };

  // 좋아요/싫어요 버튼 클릭 핸들러
  const isLiked = likeState === "LIKE";
  const isHated = likeState === "DISLIKE";

  const handleLikeClick = () => onLikeChange("LIKE");
  const handleHateClick = () => onLikeChange("DISLIKE");

  return (
    <div ref={scrollRef} className="bg-white">
      {/* 배너 섹션 */}
      <motion.div
        style={{
          backgroundImage: `linear-gradient(to top, rgba(18, 18, 18, 1) 10%, rgba(18, 18, 18, 0.4) 100%), url(${bannerUrl})`,
          opacity: bannerOpacity,
          scale: bannerScale,
          y: bannerY,
        }}
        className="relative h-[40vh] origin-top bg-cover bg-center md:h-[45vh]"
      >
        <div className="absolute bottom-10 left-4 flex flex-col items-start text-white md:left-10">
          <h1 className="text-3xl font-black md:text-5xl">{contents.title}</h1>
          <p className="text-lg">{`개봉 · ${new Date(contents.releaseDate).getFullYear()}`}</p>
        </div>
      </motion.div>

      {/* 메인 컨텐츠 */}
      <div className="mx-auto mt-8 max-w-6xl pb-16">
        {/* --- 데스크톱 --- */}
        <div className="hidden md:block">
          <div className="mb-8 flex items-center justify-between border-y border-gray-200 py-4">
            <div className="flex items-center gap-10">
              <RatingDisplay
                label="평균 팝콘"
                rating={contents.ratingAverage}
                size={36}
              />

              <RatingDisplay
                label="나의 팝콘"
                rating={myCurrentRating}
                onRatingChange={setMyCurrentRating}
                size={36}
                disabled={!isLoggedIn}
              />
            </div>
            <ActionButtons
              onReviewClick={onReviewClick}
              reviewButtonLabel={reviewButtonLabel}
              isWished={isWished}
              onWishClick={handleWishClick}
              isDesktop
              token={accessToken}
              movieTitle={contents.title}
            />
          </div>
          <div className="flex flex-row items-center gap-12">
            <img
              src={posterUrl}
              alt={`${contents.title} poster`}
              className="w-56 flex-shrink-0 rounded-lg shadow-2xl"
            />
            <div className="flex-grow">
              <div className="mb-4 flex items-start justify-between">
                <h2 className="text-3xl font-bold">{contents.title}</h2>
                <div className="ml-4 flex flex-shrink-0 items-center gap-4">
                  <LikePopcorn onClick={handleLikeClick} isSelected={isLiked} />
                  <HatePopcorn onClick={handleHateClick} isSelected={isHated} />
                </div>
              </div>
              <MovieInfo movie={movieInfoProps} isDesktop />
            </div>
          </div>
        </div>

        {/* --- 모바일 --- */}
        <div className="flex flex-col px-4 md:hidden">
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-1 flex flex-col gap-6">
              <img
                src={posterUrl}
                alt={`${contents.title} poster`}
                className="w-full rounded-lg shadow-2xl"
              />
              <h2 className="text-center text-lg font-bold">
                {contents.title}
              </h2>
            </div>
            <div className="col-span-2 flex flex-col justify-between">
              <div className="flex w-full justify-around border-b border-gray-200 pb-2">
                <LikePopcorn onClick={handleLikeClick} isSelected={isLiked} />
                <HatePopcorn onClick={handleHateClick} isSelected={isHated} />
              </div>
              <div className="flex flex-grow flex-col justify-center gap-2">
                <div className="flex items-center justify-center">
                  <RatingDisplay
                    label="평균 팝콘"
                    rating={contents.ratingAverage}
                    size={28}
                  />
                </div>
                <div className="flex items-center justify-center">
                  <RatingDisplay
                    label="나의 팝콘"
                    rating={myCurrentRating}
                    onRatingChange={setMyCurrentRating}
                    size={28}
                    disabled={!isLoggedIn}
                  />
                </div>
              </div>
              <div className="border-t border-gray-200 pt-2">
                <ActionButtons
                  onReviewClick={onReviewClick}
                  reviewButtonLabel={reviewButtonLabel}
                  isWished={isWished}
                  onWishClick={handleWishClick}
                  token={accessToken}
                  movieTitle={contents.title}
                />
              </div>
            </div>
          </div>
          <div className="mt-10">
            <MovieInfo movie={movieInfoProps} />
          </div>
        </div>

        {/* --- 공통 섹션 --- */}
        <hr className="my-12 border-t border-gray-200" />
        <div className="flex flex-col-reverse lg:flex-row lg:gap-24">
          <div className="mt-12 flex justify-center lg:mt-0 lg:w-1/2">
            <TrailerSection trailers={trailerProps} />
          </div>
          <hr className="my-8 border-t border-gray-200 lg:hidden" />
          <div className="lg:w-5/12">
            <CastAndCrew director={director} cast={cast} />
          </div>
        </div>

        <hr className="my-12 border-t border-gray-200" />
        <div className="px-4 lg:px-0">
          <ReviewSection
            contentId={contentId}
            contentType={contentType}
            contentTitle={contents.title}
            onEditClick={onEditReview}
          />
        </div>

        <hr className="my-12 border-t border-gray-200" />
        <div className="px-4 lg:px-0">
          <CollectionSection contentId={contentId} contentType={contentType} />
        </div>
      </div>
    </div>
  );
};

// ======================================================================
// 2. 메인 페이지 로직 컨테이너 컴포넌트
// ======================================================================
export default function DetailPage() {
  const { message } = App.useApp();
  const queryClient = useQueryClient();
  const { user, accessToken } = useAuthCheck();
  const { contents, loading, error, contentId, contentType } =
    useContentsDetail();

  // Zustand 스토어 사용
  const { getReaction, updateReaction } = useLikeStore();

  // 현재 좋아요/싫어요 상태 (Zustand에서 자동으로 관리됨)
  const likeState = getReaction(Number(contentId), contentType ?? "");

  // 내 리뷰 데이터 조회
  const { data: myReviewData } = useMyReview(
    Number(contentId),
    contentType ?? "",
    accessToken ?? undefined,
  );

  // 좋아요/싫어요 상태 변경 핸들러
  const handleLikeChange = useCallback(
    async (targetState: LikeState) => {
      if (!user.isLoggedIn) {
        message.info("로그인 먼저 진행해주세요!", 1.5);
        return;
      }

      if (!accessToken || !contentId || !contentType) {
        message.error("필요한 정보가 부족합니다.");
        return;
      }

      try {
        // Zustand 스토어의 updateReaction 사용
        await updateReaction(
          Number(contentId),
          contentType,
          targetState,
          user.userId,
          accessToken,
        );

        // 성공 메시지
        const finalState = likeState === targetState ? "NEUTRAL" : targetState;
        if (finalState === "LIKE") {
          message.success("좋아요를 등록했습니다!", 1);
        } else if (finalState === "DISLIKE") {
          message.success("싫어요를 등록했습니다!", 1);
        } else {
          message.success("반응을 취소했습니다.", 1);
        }
      } catch (error) {
        console.error("좋아요/싫어요 처리 실패:", error);
      }
    },
    [
      user.isLoggedIn,
      user.userId,
      accessToken,
      contentId,
      contentType,
      message,
      likeState,
      updateReaction,
    ],
  );

  // 리뷰 모달 상태
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isWritingReview, setIsWritingReview] = useState(true);
  const [editingReviewData, setEditingReviewData] =
    useState<ReviewCardData | null>(null);

  // 사용자가 UI로 직접 변경한 평점 (상호작용 전에는 null)
  const [interactiveRating, setInteractiveRating] = useState<number | null>(
    null,
  );

  // 화면에 최종적으로 표시될 평점 계산
  const displayRating = interactiveRating ?? myReviewData?.myReview?.score ?? 0;

  const handleRatingChange = useCallback(
    (rating: number | null) => {
      if (!user.isLoggedIn) {
        message.info("로그인 먼저 진행해주세요!", 1.5);
        return;
      }
      setInteractiveRating(rating);
    },
    [user.isLoggedIn, message],
  );

  // 리뷰 작성 모달 열기
  const handleOpenWriteModal = useCallback(() => {
    if (!user.isLoggedIn) {
      message.info("로그인 먼저 진행해주세요!", 1.5);
      return;
    }
    setIsWritingReview(true);
    setEditingReviewData(null);
    setIsReviewModalOpen(true);
  }, [user.isLoggedIn]);

  // 리뷰 수정 모달 열기
  const handleOpenEditModal = useCallback((reviewData: ReviewCardData) => {
    setIsWritingReview(false);
    setEditingReviewData(reviewData);
    setIsReviewModalOpen(true);
  }, []);

  // ActionButtons의 '리뷰' 버튼 클릭 통합 핸들러
  const handleReviewButtonClick = useCallback(() => {
    if (!contentType || !contents) return;
    if (myReviewData?.existUserReview && myReviewData.myReview) {
      const reviewToEdit: ReviewCardData = {
        reviewId: myReviewData.myReview.reviewId,
        contentId: Number(contentId),
        contentType: contentType,
        contentTitle: contents?.title ?? "제목 없음",
        score: myReviewData.myReview.score,
        reviewText: myReviewData.myReview.text,
        authorNickname: user.nickname || "나",
        status: "COMMON",
        likeCount: myReviewData.myReview.likeCount,
        isLiked: false,
        isOwnReview: true,
        hasAlreadyReported: false,
        reviewDate: myReviewData.myReview.createdAt,
      };
      handleOpenEditModal(reviewToEdit);
    } else {
      handleOpenWriteModal();
    }
  }, [
    myReviewData,
    user,
    contents,
    contentType,
    contentId,
    handleOpenEditModal,
    handleOpenWriteModal,
  ]);

  // 리뷰 등록/수정 성공 콜백
  const handleReviewUpdateSuccess = () => {
    setInteractiveRating(null);

    // 관련 쿼리 무효화로 최신 데이터 요청
    queryClient.invalidateQueries({
      queryKey: ["reviews", contentId, contentType],
    });
    queryClient.invalidateQueries({
      queryKey: ["contentsDetail", contentId, contentType],
    });
    queryClient.invalidateQueries({
      queryKey: ["myReview", contentId, contentType],
    });
    setIsReviewModalOpen(false);
  };

  // 위시리스트 상태 및 핸들러
  const { data: wishlistData } = useFetchWishlist(user.userId, accessToken);
  const { mutate: toggleWishlist } = useToggleWishlist();
  const isWished = useMemo(
    () =>
      wishlistData?.data.some(
        (item: any) => item.contentId === Number(contentId),
      ) ?? false,
    [wishlistData, contentId],
  );

  const handleWishClick = useCallback(() => {
    if (!user.isLoggedIn || !contentType || !accessToken) return;
    toggleWishlist({
      isWished,
      userId: user.userId,
      contentId: Number(contentId),
      contentType: contentType,
      accessToken: accessToken,
    });
  }, [isWished, user, contentId, contentType, accessToken, toggleWishlist]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (error || !contents || !contentId || !contentType) {
    return (
      <div className="flex h-screen items-center justify-center">
        {error || "데이터를 찾을 수 없습니다."}
      </div>
    );
  }

  return (
    <>
      <DetailContents
        contents={contents}
        contentId={Number(contentId)}
        contentType={contentType}
        myCurrentRating={displayRating}
        setMyCurrentRating={handleRatingChange}
        isLoggedIn={user.isLoggedIn}
        isWished={isWished}
        handleWishClick={handleWishClick}
        likeState={likeState}
        onLikeChange={handleLikeChange}
        onEditReview={handleOpenEditModal}
        onReviewClick={handleReviewButtonClick}
        reviewButtonLabel={
          myReviewData?.existUserReview ? "리뷰 수정" : "리뷰 쓰기"
        }
      />

      {isReviewModalOpen && (
        <ReviewModal
          isModalOpen={isReviewModalOpen}
          setIsModalOpen={setIsReviewModalOpen}
          isWriting={isWritingReview}
          isAuthor={true}
          contentId={Number(contentId)}
          contentType={contentType}
          contentsTitle={contents.title}
          contentsImg={contents.posterPath}
          popcorn={editingReviewData?.score ?? displayRating}
          reviewDetail={editingReviewData?.reviewText ?? ""}
          author={editingReviewData?.authorNickname ?? user.nickname ?? "익명"}
          token={accessToken ?? undefined}
          reviewId={editingReviewData?.reviewId ?? 0}
          onUpdateSuccess={handleReviewUpdateSuccess}
        />
      )}
    </>
  );
}
