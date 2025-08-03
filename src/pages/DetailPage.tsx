import { useState, useRef, useCallback, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";

// --- 타입 임포트 ---
import { ContentsDetail, Crew } from "@/types/Contents.types";

// --- 훅 임포트 ---
import { useContentsDetail } from "@/hooks/useContentsDetail";

// --- 컴포넌트 임포트 ---
import LikePopcorn from "@/components/popcorn/LikePopcorn";
import HatePopcorn from "@/components/popcorn/HatePopcorn";
import CastAndCrew from "@/components/detail/CastAndCrew";
import TrailerSection from "@/components/detail/TrailerSection";
import RatingDisplay from "@/components/detail/RatingDisplay";
import MovieInfo from "@/components/detail/MovieInfo";
import ActionButtons from "@/components/detail/ActionButtons";
import ReviewSection from "@/components/detail/ReviewSection";
import CollectionSection from "@/components/detail/CollectionSection";
import { validateAndRefreshTokens } from "@/apis/tokenApi";
import useAuthCheck from "@/hooks/useAuthCheck";
import { TMDB_IMAGE_BASE_URL } from "@/constants/contents";

// ======================================================================
// 1. UI와 스크롤 로직을 담당할 별도 컴포넌트 생성
// ======================================================================
interface DetailContentsProps {
  contents: ContentsDetail;
  contentId: number;
  contentType: string;
  myCurrentRating: number;
  setMyCurrentRating: (rating: number) => void;
  isWished: boolean;
  handleWishClick: () => void;
  isLiked: boolean;
  handleLikeClick: () => void;
  isHated: boolean;
  handleHateClick: () => void;
}

const DetailContents = ({
  contents,
  contentId, // props 받기
  contentType, // props 받기
  myCurrentRating,
  setMyCurrentRating,
  isWished,
  handleWishClick,
  isLiked,
  handleLikeClick,
  isHated,
  handleHateClick,
}: DetailContentsProps) => {
  // Framer Motion 관련 훅과 로직
  const scrollRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end start"],
  });
  const bannerOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const bannerScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
  const bannerY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const { accessToken } = useAuthCheck();

  // API 데이터를 UI에 맞게 가공
  const bannerUrl = `${TMDB_IMAGE_BASE_URL}${contents.backdropPath}`;
  const posterUrl = `${TMDB_IMAGE_BASE_URL}${contents.posterPath}`;

  const director = contents.crews.find((crew: Crew) => crew.job === "Director");
  const cast = contents.casts;
  const trailerProps = (contents.videos || [])
    .filter((video) => video.type === "Trailer")
    .map((video) => ({
      videoId: video.key, // API의 'key'를 'videoId'로 매핑
      thumbnailUrl: `https://i.ytimg.com/vi/${video.key}/sddefault.jpg`, // 썸네일 URL 생성
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

      {/*메인 컨텐츠 */}
      <div className="mx-auto mt-8 max-w-6xl pb-16">
        {/* --- 데스크톱 (md 이상) --- */}
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
              />
            </div>
            <ActionButtons
              isWished={isWished}
              onWishClick={handleWishClick}
              isDesktop
              token={accessToken}
              movieTitle={contents?.title}
              moviePoster={`${TMDB_IMAGE_BASE_URL}${contents.posterPath}`}
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

        {/* --- 모바일 (md 미만) --- */}
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
                  />
                </div>
              </div>
              <div className="border-t border-gray-200 pt-2">
                <ActionButtons
                  isWished={isWished}
                  onWishClick={handleWishClick}
                  token={accessToken}
                  movieTitle={contents.title}
                  moviePoster={`${TMDB_IMAGE_BASE_URL}${contents.posterPath}`}
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

        {/* --- 리뷰 섹션 --- */}
        <hr className="my-12 border-t border-gray-200" />
        <div className="px-4 lg:px-0">
          <ReviewSection />
        </div>

        {/*-- 컬렉션 섹션 --- */}
        <hr className="my-12 border-t border-gray-200" />
        <div className="px-4 lg:px-0">
          {/* contents 객체에서 contentId와 contentType을 props로 전달. */}
          <CollectionSection contentId={contentId} contentType={contentType} />
        </div>
      </div>
    </div>
  );
};

// ======================================================================
// 2. 메인 페이지 컴포넌트: 데이터 로딩과 상태 관리만 담당
// ======================================================================
export default function DetailPage() {
  const { contents, loading, error, contentId, contentType } =
    useContentsDetail();

  const [isWished, setIsWished] = useState(false);
  const [myCurrentRating, setMyCurrentRating] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isHated, setIsHated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    const checkAuth = async () => {
      const isValid = await validateAndRefreshTokens();
      if (!isValid) {
        navigate("/login");
      }
    };
    checkAuth();
  }, []);

  const handleLikeClick = () => {
    setIsLiked((prev) => !prev);
    if (isHated) setIsHated(false);
  };

  const handleHateClick = () => {
    setIsHated((prev) => !prev);
    if (isLiked) setIsLiked(false);
  };

  const handleWishClick = useCallback(() => {
    setIsWished((prev) => !prev);
  }, []);

  // 로딩 및 에러 UI 처리
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        로딩 중...
      </div>
    );
  }

  if (error || !contents) {
    return (
      <div className="flex h-screen items-center justify-center">
        {error || "데이터를 찾을 수 없습니다."}
      </div>
    );
  }

  // 데이터 로딩 완료 후, 상태와 데이터를 props로 넘겨주며 DetailContents 렌더링
  return (
    <DetailContents
      contents={contents}
      contentId={Number(contentId)}
      contentType={contentType}
      myCurrentRating={myCurrentRating}
      setMyCurrentRating={setMyCurrentRating}
      isWished={isWished}
      handleWishClick={handleWishClick}
      isLiked={isLiked}
      handleLikeClick={handleLikeClick}
      isHated={isHated}
      handleHateClick={handleHateClick}
    />
  );
}
