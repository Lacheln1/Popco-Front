import { useState, useRef, useCallback } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

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

// --- UI 개발을 위한 임시 목업 데이터 ---
const movieData = {
  title: "F1 더 무비",
  country: "미국",
  year: "2025",
  bannerUrl: "https://placehold.co/1200x600/1a1a1a/ffffff?text=Banner+Image",
  posterUrl: "https://placehold.co/400x600/333333/ffffff?text=Poster",
  avgRating: 4.0,
  myRating: 0,
  genres: ["액션", "우정"],
  runtime: "150분",
  ott: ["wavve", "netflix"],
  synopsis:
    "한때 주목받는 유망주였지만 끔찍한 사고로 F1®에서 우승하지 못하고 한순간에 추락한 드라이버 ‘소니 헤이스’(브래드 피트). 그의 오랜 동료인 ‘루벤 세르반테스’(하비에르 바르뎀)에게 레이싱 복귀를 제안받으며 최하위 팀인 APXGP에 합류한다. 그러나 팀 내 떠오르는 천재 드라이버 ‘조슈아 피어스’(댐슨 이드리스)와 ‘소니 헤이스’의 갈등은 날이 갈수록 심해지고, 설상가상 우승을 향한 팀의 전략 또한 번번이 실패한다. 하지만 ‘소니 헤이스’는 포기하지 않고 팀을 위해 헌신하며, 결국 팀은 F1® 역사상 가장 위대한 드라이버로 거듭난다.",
};

const ottLogos: { [key: string]: string } = {
  wavve: "https://placehold.co/32x32/1a1a1a/ffffff?text=W",
  netflix: "https://placehold.co/32x32/E50914/ffffff?text=N",
};

// 출연진/제작진 데이터 (감독 1, 출연진 10명 고정)
const directorData = {
  name: "조셉 코신스키",
  role: "감독",
  imageUrl: "https://i.pravatar.cc/100?u=director",
};

const castData = [
  { name: "브래드 피트", imageUrl: "https://i.pravatar.cc/100?u=bradpitt" },
  {
    name: "댐슨 이드리스",
    imageUrl: "https://i.pravatar.cc/100?u=damsonidris",
  },
  { name: "케리 콘던", imageUrl: "https://i.pravatar.cc/100?u=kerrycondon" },
  {
    name: "하비에르 바르뎀",
    imageUrl: "https://i.pravatar.cc/100?u=javierbardem",
  },
  {
    name: "토비어스 멘지스",
    imageUrl: "https://i.pravatar.cc/100?u=tobiasmenzies",
  },
  { name: "사라 나일스", imageUrl: "https://i.pravatar.cc/100?u=sarahniles" },
  { name: "윌 메릭", imageUrl: "https://i.pravatar.cc/100?u=willmerrick" },
  {
    name: "루이스 해밀턴",
    imageUrl: "https://i.pravatar.cc/100?u=lewishamilton",
  },
  { name: "샘 클라플린", imageUrl: "https://i.pravatar.cc/100?u=samclaflin" },
  { name: "게리 콜", imageUrl: "https://i.pravatar.cc/100?u=garycole" },
];

const trailerData = [
  {
    videoId: "dQw4w9WgXcQ",
    thumbnailUrl: "https://i.ytimg.com/vi/dQw4w9WgXcQ/sddefault.jpg",
  },
  {
    videoId: "eX2qFMC8cFo",
    thumbnailUrl: "https://i.ytimg.com/vi/eX2qFMC8cFo/sddefault.jpg",
  },
  {
    videoId: "JfVOs4VSpmA",
    thumbnailUrl: "https://i.ytimg.com/vi/JfVOs4VSpmA/sddefault.jpg",
  },
  {
    videoId: "tN1A2mVnrOM",
    thumbnailUrl: "https://i.ytimg.com/vi/tN1A2mVnrOM/sddefault.jpg",
  },
];

export default function DetailPage() {
  const [isWished, setIsWished] = useState(false);
  const [myCurrentRating, setMyCurrentRating] = useState(movieData.myRating);

  const handleWishClick = useCallback(() => {
    setIsWished((prev) => !prev);
  }, []);

  const scrollRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end start"],
  });
  const bannerOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const bannerScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
  const bannerY = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <div ref={scrollRef} className="bg-white">
      {/* 배너 섹션 */}
      <motion.div
        style={{
          backgroundImage: `linear-gradient(to top, rgba(18, 18, 18, 1) 10%, rgba(18, 18, 18, 0.4) 100%), url(${movieData.bannerUrl})`,
          opacity: bannerOpacity,
          scale: bannerScale,
          y: bannerY,
        }}
        className="relative h-[40vh] origin-top bg-cover bg-center md:h-[45vh]"
      >
        <div className="absolute bottom-10 left-4 flex flex-col items-start text-white md:left-10">
          <h1 className="text-3xl font-black md:text-5xl">{movieData.title}</h1>
          <p className="text-lg">{`${movieData.country} · ${movieData.year}`}</p>
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
                rating={movieData.avgRating}
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
            />
          </div>
          <div className="flex flex-row items-center gap-12">
            <img
              src={movieData.posterUrl}
              alt={`${movieData.title} poster`}
              className="w-56 flex-shrink-0 rounded-lg shadow-2xl"
            />
            <div className="flex-grow">
              <div className="mb-4 flex items-start justify-between">
                <h2 className="text-3xl font-bold">{movieData.title}</h2>
                <div className="ml-4 flex flex-shrink-0 items-center gap-4">
                  <LikePopcorn />
                  <HatePopcorn />
                </div>
              </div>
              <MovieInfo movie={movieData} ottLogos={ottLogos} isDesktop />
            </div>
          </div>
        </div>

        {/* --- 모바일 (md 미만) --- */}
        <div className="flex flex-col px-4 md:hidden">
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-1 flex flex-col gap-6">
              <img
                src={movieData.posterUrl}
                alt={`${movieData.title} poster`}
                className="w-full rounded-lg shadow-2xl"
              />
              <h2 className="text-center text-lg font-bold">
                {movieData.title}
              </h2>
            </div>

            <div className="col-span-2 flex flex-col justify-between">
              <div className="flex w-full justify-around border-b border-gray-200 pb-2">
                <LikePopcorn />
                <HatePopcorn />
              </div>
              <div className="flex flex-grow flex-col justify-center gap-2">
                <div className="flex items-center justify-center">
                  <RatingDisplay
                    label="평균 팝콘"
                    rating={movieData.avgRating}
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
                />
              </div>
            </div>
          </div>

          <div className="mt-10">
            <MovieInfo movie={movieData} ottLogos={ottLogos} />
          </div>
        </div>

        {/* --- 공통 섹션 --- */}
        <hr className="my-12 border-t border-gray-200" />
        <div className="flex flex-col-reverse lg:flex-row lg:gap-24">
          <div className="mt-12 flex justify-center lg:mt-0 lg:w-1/2">
            <TrailerSection trailers={trailerData} />
          </div>
          <hr className="my-8 border-t border-gray-200 lg:hidden" />
          <div className="lg:w-5/12">
            <CastAndCrew director={directorData} cast={castData} />
          </div>
        </div>
        {/* --- 리뷰 섹션 --- */}
        <hr className="my-12 border-t border-gray-200" />
        <div className="px-4 lg:px-0">
          <ReviewSection />
        </div>
        {/*-- 컬렉션 섹션 (새로 추가) --- */}
        <hr className="my-12 border-t border-gray-200" />
        <div className="px-4 lg:px-0">
          <CollectionSection />
        </div>
      </div>
    </div>
  );
}
