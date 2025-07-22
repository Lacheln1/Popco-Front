import { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

// 1. 요청하신 방식으로 SVG 아이콘들을 불러옵니다.
import ReviewIcon from '@/assets/review.svg?react';
import EmptyPlusIcon from '@/assets/empty-plus.svg?react';
import FullPlusIcon from '@/assets/full-plus.svg?react';
import FolderIcon from '@/assets/folder.svg?react';

// 아래는 더미(dummy) 컴포넌트 및 데이터입니다. 실제 프로젝트에 맞게 수정하세요.
import PopcornRating from '@/components/common/PopcornRating';
import LikePopcorn from '@/components/popcorn/LikePopcorn';
import HatePopcorn from '@/components/popcorn/HatePopcorn';

// 2. TMDB API를 통해 받을 데이터 (임시 목업 데이터)
const movieData = {
  title: 'F1 더 무비',
  country: '미국',
  year: '2025',
  bannerUrl: '/images/f1_banner.jpg', // public 폴더나 assets 폴더의 실제 이미지 경로로 변경
  posterUrl: '/images/f1_poster.jpg', // public 폴더나 assets 폴더의 실제 이미지 경로로 변경
  avgRating: 4.0,
  myRating: 3.5,
  genres: ['액션', '우정'],
  runtime: '150분',
  ott: ['wavve', 'netflix'],
  synopsis:
    '한때 주목받는 유망주였지만 끔찍한 사고로 F1®에서 우승하지 못하고 한순간에 추락한 드라이버 ‘소니 헤이스’(브래드 피트). 그의 오랜 동료인 ‘루벤 세르반테스’(하비에르 바르뎀)에게 레이싱 복귀를 제안받으며 최하위 팀인 APXGP에 합류한다. 그러나 팀 내 떠오르는 천재 드라이버 ‘조슈아 피어스’(댐슨 이드리스)와 ‘소니 헤이스’의 갈등은 날이 갈수록 심해지고, 설상가상 우승을 향한 팀의 전략 또한 번번이 ...',
};

// OTT 로고를 위한 간단한 맵
const ottLogos: { [key: string]: string } = {
  wavve: '/images/wavve-logo.png', // 실제 로고 경로로 변경
  netflix: '/images/netflix-logo.png', // 실제 로고 경로로 변경
};


export default function MovieDetailTop() {
  const [isWished, setIsWished] = useState(false);
  
  // 3. 스크롤 애니메이션을 위한 ref와 hook
  const scrollRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ['start start', 'end start'],
  });
  
  // 스크롤 Y 진행도(0 to 1)에 따라 배너의 투명도(1 to 0)와 스케일(1 to 0.8)을 조절
  const bannerOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const bannerScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
  const bannerY = useTransform(scrollYProgress, [0, 1], [0, -100]); // 배너가 위로 올라가며 사라지는 효과

  return (
    <div ref={scrollRef} className="bg-white dark:bg-gray-900">
      {/* 4. 배너 섹션 (Framer Motion 적용) */}
      <motion.div
        style={{
          backgroundImage: `linear-gradient(to top, rgba(18, 18, 18, 1) 10%, rgba(18, 18, 18, 0.4) 100%), url(${movieData.bannerUrl})`,
          opacity: bannerOpacity,
          scale: bannerScale,
          y: bannerY,
        }}
        className="relative h-[50vh] md:h-[60vh] bg-cover bg-center origin-top"
      >
        <div className="absolute bottom-10 left-4 md:left-10 flex flex-col items-start text-white">
          <h1 className="text-4xl md:text-6xl font-black">{movieData.title}</h1>
          <p className="text-lg md:text-xl">{movieData.country}</p>
          <p className="text-lg md:text-xl">{movieData.year}</p>
        </div>
      </motion.div>

      {/* 5. 메인 컨텐츠 섹션 (포스터 및 정보) */}
      <div className="relative max-w-5xl mx-auto px-4 pb-16 -mt-24 md:-mt-32">
        <div className="flex flex-col md:flex-row md:gap-8">
          {/* 왼쪽: 영화 포스터 */}
          <div className="w-48 md:w-64 mx-auto md:mx-0 flex-shrink-0">
            <img src={movieData.posterUrl} alt={`${movieData.title} poster`} className="w-full rounded-lg shadow-2xl" />
          </div>

          {/* 오른쪽: 영화 상세 정보 */}
          <div className="flex-grow mt-6 md:mt-24">
            {/* --- 모바일 뷰 전용 평가 섹션 --- */}
            <div className="flex md:hidden justify-around items-start p-4 bg-gray-100 dark:bg-gray-800 rounded-lg mb-6">
              <LikePopcorn />
              <PopcornRating label="평균 팝콘" score={movieData.avgRating} readonly />
              <PopcornRating label="나의 팝콘" score={movieData.myRating} readonly />
              <HatePopcorn />
            </div>

            {/* --- 데스크탑 뷰 전용 평가 섹션 --- */}
            <div className="hidden md:flex items-center gap-8 mb-6">
                <PopcornRating initialRating={movieData.avgRating} readonly showScore={false} size={24}/>
                <span className="text-lg font-bold">{movieData.avgRating.toFixed(1)}</span>
                <span className="text-sm text-gray-500">평균 팝콘</span>
            </div>

            {/* 액션 버튼 (리뷰, 보고싶어요, 콜렉션) */}
            <div className="flex justify-around md:justify-start md:gap-8 items-center text-center text-gray-600 dark:text-gray-300 border-y border-gray-200 dark:border-gray-700 py-4">
              <button type="button" className="flex flex-col items-center gap-2 hover:text-yellow-400">
                <ReviewIcon className="w-6 h-6" />
                <span className="text-xs font-semibold">리뷰 쓰기</span>
              </button>
              <button type="button" onClick={() => setIsWished(!isWished)} className="flex flex-col items-center gap-2 hover:text-yellow-400">
                {isWished ? <FullPlusIcon className="w-6 h-6 text-yellow-400"/> : <EmptyPlusIcon className="w-6 h-6"/>}
                <span className="text-xs font-semibold">보고싶어요</span>
              </button>
              <button type="button" className="flex flex-col items-center gap-2 hover:text-yellow-400">
                <FolderIcon className="w-6 h-6" />
                <span className="text-xs font-semibold">콜렉션 추가</span>
              </button>
            </div>

            <div className="mt-6 space-y-4 text-gray-800 dark:text-gray-200">
              <div className="flex">
                <p className="w-24 font-semibold shrink-0">장르</p>
                <p>{movieData.genres.join(', ')}</p>
              </div>
              <div className="flex">
                <p className="w-24 font-semibold shrink-0">관람 가능 OTT</p>
                <div className="flex gap-2 items-center">
                  {movieData.ott.map(o => <img key={o} src={ottLogos[o]} alt={o} className="w-6 h-6"/>)}
                </div>
              </div>
              <div className="flex">
                <p className="w-24 font-semibold shrink-0">상영 시간</p>
                <p>{movieData.runtime}</p>
              </div>
              <div className="flex flex-col mt-4">
                <p className="font-semibold mb-2">줄거리</p>
                <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">{movieData.synopsis}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}