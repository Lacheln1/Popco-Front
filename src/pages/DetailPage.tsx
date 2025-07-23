import { useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

// --- 컴포넌트 임포트 ---
import PopcornRating from "@/components/common/PopcornRating";
import LikePopcorn from "@/components/popcorn/LikePopcorn";
import HatePopcorn from "@/components/popcorn/HatePopcorn";

// --- PNG 아이콘 임포트 ---
import reviewIconUrl from "@/assets/review.png";
import emptyPlusIconUrl from "@/assets/empty-plus.png";
import fullPlusIconUrl from "@/assets/full-plus.png";
import folderIconUrl from "@/assets/folder.png";

// --- 임시 목업 데이터 ---
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
    "한때 주목받는 유망주였지만 끔찍한 사고로 F1®에서 우승하지 못하고 한순간에 추락한 드라이버 ‘소니 헤이스’(브래드 피트). 그의 오랜 동료인 ‘루벤 세르반테스’(하비에르 바르뎀)에게 레이싱 복귀를 제안받으며 최하위 팀인 APXGP에 합류한다. 그러나 팀 내 떠오르는 천재 드라이버 ‘조슈아 피어스’(댐슨 이드리스)와 ‘소니 헤이스’의 갈등은 날이 갈수록 심해지고, 설상가상 우승을 향한 팀의 전략 또한 번번이 ...",
};

const ottLogos: { [key: string]: string } = {
  wavve: "https://placehold.co/32x32/1a1a1a/ffffff?text=W",
  netflix: "https://placehold.co/32x32/E50914/ffffff?text=N",
};

export default function DetailPage() {
  const [isWished, setIsWished] = useState(false);
  const [myCurrentRating, setMyCurrentRating] = useState(movieData.myRating);

  const scrollRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end start"],
  });
  const bannerOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const bannerScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
  const bannerY = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <div ref={scrollRef} className="bg-white dark:bg-gray-900">
      {/* 1. 배너 섹션 (높이 축소) */}
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
          <p className="text-lg">{movieData.country}</p>
          <p className="text-lg">{movieData.year}</p>
        </div>
      </motion.div>

      {/* 2. 메인 컨텐츠 (배너 제외, max-w-6xl 적용 및 겹침 문제 해결) */}
      <div className="mx-auto mt-8 max-w-6xl px-4 pb-16">
        {/* --- 데스크탑 (md 이상) 전용 레이아웃 --- */}
        <div className="hidden md:block">
          {/* A. 평가 및 액션 바 */}
          <div className="mb-8 flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                  평균
                </span>
                <PopcornRating
                  initialRating={movieData.avgRating}
                  readonly
                  size={20}
                  showScore={true}
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                  나의
                </span>
                <PopcornRating
                  initialRating={myCurrentRating}
                  onRatingChange={setMyCurrentRating}
                  size={20}
                  showScore={true}
                />
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-4 text-center text-gray-600 dark:text-gray-300">
                <button
                  type="button"
                  className="flex flex-col items-center gap-1 hover:opacity-80"
                >
                  <img
                    src={reviewIconUrl}
                    alt="리뷰 쓰기"
                    className="h-5 w-5"
                  />
                  <span className="text-xs font-semibold">리뷰</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsWished(!isWished)}
                  className="flex flex-col items-center gap-1 hover:opacity-80"
                >
                  <img
                    src={isWished ? fullPlusIconUrl : emptyPlusIconUrl}
                    alt="보고싶어요"
                    className="h-5 w-5"
                  />
                  <span className="text-xs font-semibold">보고싶어요</span>
                </button>
                <button
                  type="button"
                  className="flex flex-col items-center gap-1 hover:opacity-80"
                >
                  <img
                    src={folderIconUrl}
                    alt="콜렉션 추가"
                    className="h-5 w-5"
                  />
                  <span className="text-xs font-semibold">콜렉션</span>
                </button>
              </div>
              <div className="flex items-center gap-4 border-l border-gray-300 pl-6 dark:border-gray-600">
                <LikePopcorn />
                <HatePopcorn />
              </div>
            </div>
          </div>
          {/* B. 포스터 및 상세 정보 */}
          <div className="flex flex-row gap-8">
            <div className="w-56 flex-shrink-0">
              <img
                src={movieData.posterUrl}
                alt={`${movieData.title} poster`}
                className="w-full rounded-lg shadow-2xl"
              />
            </div>
            <div className="flex-grow">
              <h2 className="mb-4 text-3xl font-bold dark:text-white">
                {movieData.title}
              </h2>
              <div className="space-y-4 text-gray-800 dark:text-gray-200">
                <div className="flex">
                  <p className="w-24 shrink-0 font-semibold">장르</p>
                  <p>{movieData.genres.join(", ")}</p>
                </div>
                <div className="flex">
                  <p className="w-24 shrink-0 font-semibold">OTT</p>
                  <div className="flex items-center gap-2">
                    {movieData.ott.map((o) => (
                      <img
                        key={o}
                        src={ottLogos[o]}
                        alt={o}
                        className="h-6 w-6 rounded-md"
                      />
                    ))}
                  </div>
                </div>
                <div className="flex">
                  <p className="w-24 shrink-0 font-semibold">상영 시간</p>
                  <p>{movieData.runtime}</p>
                </div>
                <div className="mt-4 flex flex-col">
                  <p className="mb-2 font-semibold">줄거리</p>
                  <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                    {movieData.synopsis}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- 모바일 (md 미만) 전용 레이아웃 --- */}
        <div className="flex flex-col md:hidden">
          <div className="flex flex-row gap-4">
            <div className="w-1/3 flex-shrink-0">
              <img
                src={movieData.posterUrl}
                alt={`${movieData.title} poster`}
                className="w-full rounded-lg shadow-2xl"
              />
            </div>
            <div className="flex w-2/3 flex-col items-center justify-start gap-3">
              <div className="flex w-full justify-around">
                <LikePopcorn />
                <HatePopcorn />
              </div>
              <div className="w-full rounded-lg bg-gray-50 p-2 dark:bg-gray-800">
                <p className="mb-1 text-center text-xs dark:text-gray-300">
                  평균 팝콘
                </p>
                <PopcornRating
                  initialRating={movieData.avgRating}
                  readonly
                  size={20}
                  showScore={true}
                  className="justify-center"
                />
              </div>
              <div className="w-full rounded-lg bg-gray-50 p-2 dark:bg-gray-800">
                <p className="mb-1 text-center text-xs dark:text-gray-300">
                  나의 팝콘
                </p>
                <PopcornRating
                  initialRating={myCurrentRating}
                  onRatingChange={setMyCurrentRating}
                  size={20}
                  showScore={true}
                  className="justify-center"
                />
              </div>
              <div className="flex w-full items-center justify-around border-t border-gray-200 pt-2 text-center text-gray-600 dark:border-gray-700 dark:text-gray-300">
                <button
                  type="button"
                  className="flex flex-col items-center gap-1 hover:opacity-80"
                >
                  <img
                    src={reviewIconUrl}
                    alt="리뷰 쓰기"
                    className="h-5 w-5"
                  />
                  <span className="text-xs font-semibold">리뷰</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsWished(!isWished)}
                  className="flex flex-col items-center gap-1 hover:opacity-80"
                >
                  <img
                    src={isWished ? fullPlusIconUrl : emptyPlusIconUrl}
                    alt="보고싶어요"
                    className="h-5 w-5"
                  />
                  <span className="text-xs font-semibold">보고싶어요</span>
                </button>
                <button
                  type="button"
                  className="flex flex-col items-center gap-1 hover:opacity-80"
                >
                  <img
                    src={folderIconUrl}
                    alt="콜렉션 추가"
                    className="h-5 w-5"
                  />
                  <span className="text-xs font-semibold">콜렉션</span>
                </button>
              </div>
            </div>
          </div>
          <div className="mt-6 space-y-4 text-gray-800 dark:text-gray-200">
            <h2 className="text-2xl font-bold dark:text-white">
              {movieData.title}
            </h2>
            <div className="flex">
              <p className="w-24 shrink-0 font-semibold">장르</p>
              <p>{movieData.genres.join(", ")}</p>
            </div>
            <div className="flex">
              <p className="w-24 shrink-0 font-semibold">OTT</p>
              <div className="flex items-center gap-2">
                {movieData.ott.map((o) => (
                  <img
                    key={o}
                    src={ottLogos[o]}
                    alt={o}
                    className="h-6 w-6 rounded-md"
                  />
                ))}
              </div>
            </div>
            <div className="flex">
              <p className="w-24 shrink-0 font-semibold">상영 시간</p>
              <p>{movieData.runtime}</p>
            </div>
            <div className="mt-4 flex flex-col">
              <p className="mb-2 font-semibold">줄거리</p>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                {movieData.synopsis}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
