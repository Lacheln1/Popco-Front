import { useState, useCallback } from "react";
import HotCollection from "../common/HotCollection";

// HeroCollection에서 사용할 HotCollection 데이터 타입
interface HeroHotCollection {
  collectionId: number;
  title: string;
  posters: string[];
  href: string;
  saveCount: number;
}

// 여러 개의 HotCollection을 렌더링하기 위한 목업 데이터 배열
const mockHotCollections: HeroHotCollection[] = [
  {
    collectionId: 1,
    title: "이번 주 저장수 TOP 4",
    posters: [
      "https://image.tmdb.org/t/p/w500/8UlWHLMpgZm9bx6QYh0NFoq67TZ.jpg",
      "https://image.tmdb.org/t/p/w500/9O1Iy9od7d1rA2v9AafBw2qaC2v.jpg",
      "https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg",
      "https://image.tmdb.org/t/p/w500/kqjL17yufvn9OVLyXYpvtyrFfak.jpg",
    ],
    href: "/collection/1",
    saveCount: 128,
  },
  {
    collectionId: 2,
    title: "에디터 강력 추천",
    posters: [
      "https://image.tmdb.org/t/p/w500/6Wdl9N6dL0Hi0T1qJLWSz6gMLbd.jpg",
      "https://image.tmdb.org/t/p/w500/xBHvZcjRiWyobQ9kxBhO6B2dtRI.jpg",
      "https://image.tmdb.org/t/p/w500/cjr4NWURcVN3gW5FlHeabgBHLrY.jpg",
      "https://image.tmdb.org/t/p/w500/h4VB6m0RwcicVEZvzftYZyKXs6K.jpg",
    ],
    href: "/collection/2",
    saveCount: 99,
  },
  {
    collectionId: 3,
    title: "눈과 귀가 즐거운 뮤지컬",
    posters: [
      "https://image.tmdb.org/t/p/w500/xCEg6KowNISWvMh8GvPSxtdf9TO.jpg",
      "https://image.tmdb.org/t/p/w500/eLT8Cu357VOwBVTitkmlDEg32Fs.jpg",
    ],
    href: "/collection/3",
    saveCount: 77,
  },
];

const HeroCollection = () => {
  // 찜 상태를 { 컬렉션ID: 찜여부 } 형태로 관리
  const [savedMap, setSavedMap] = useState<Record<number, boolean>>({
    1: false,
    2: true,
    3: false,
  });

  const handleSaveToggle = useCallback((collectionId: number) => {
    setSavedMap((prev) => {
      const newSavedState = !prev[collectionId];
      console.log(
        `Collection ${collectionId}의 찜 상태가 ${newSavedState}로 변경됨`,
      );
      return { ...prev, [collectionId]: newSavedState };
    });
  }, []);

  return (
    <section>
      <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center justify-between overflow-x-hidden px-3 md:flex-row md:gap-4 md:px-6 lg:gap-16 xl:px-0">
        <div className="flex flex-col gap-6 2xl:w-[550px]">
          <div>
            <div className="text-popco-foot mb-3 text-lg font-bold">HOT</div>
            <h1 className="gmarket break-keep text-2xl font-medium sm:text-3xl lg:text-4xl">
              POPCO의
              <br />
              HOT한 컬렉션을 만나보세요
            </h1>
          </div>
          <div className="min-w-[350px] break-keep text-base lg:min-w-[440px] lg:text-lg">
            보고 싶은 콘텐츠, 추천하고 싶은 시리즈, 그리고 나만의 테마까지!
            <br />
            POPCO에서 당신만의 OTT 컬렉션을 만들어 공유해보세요.
          </div>
          <button className="text-popco-foot border-popco-foot hidden w-fit rounded-full border-solid px-7 py-4 text-base md:block">
            View more +
          </button>
        </div>

        <div className="flex gap-5 px-4 pb-5 pt-12 md:p-0 lg:gap-12">
          {mockHotCollections.map((collection, index) => (
            <div key={collection.collectionId} className="relative">
              <span className="absolute -left-4 -top-6 z-10 font-mono text-[50px] font-bold text-transparent text-white drop-shadow-lg [-webkit-text-stroke:3px_#FFD751] lg:text-[70px]">
                {index + 1}
              </span>
              <HotCollection
                {...collection}
                isSaved={savedMap[collection.collectionId] ?? false}
                onSaveToggle={handleSaveToggle}
              />
            </div>
          ))}
        </div>

        <button className="text-popco-foot w-fit rounded-full border-solid px-7 py-4 text-base text-white md:hidden">
          View more +
        </button>
      </div>
    </section>
  );
};

export default HeroCollection;
