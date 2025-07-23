import { CollectionBase } from "@/types/collection";
import HotCollection from "../common/HotCollection";
import { useState } from "react";

const HeroCollection = () => {
  const [savedMap, setSavedMap] = useState<Record<string, boolean>>({
    "col-1": false,
  });
  const handleSaveToggle = (collectionId: string, isSaved: boolean) => {
    console.log(`${collectionId} is now ${isSaved ? "saved" : "unsaved"}`);
    setSavedMap((prev) => ({ ...prev, [collectionId]: isSaved }));
  };

  const mockCollection: CollectionBase = {
    collectionId: 1,
    title: "예시 컬렉션",
    posters: [
      "https://image.tmdb.org/t/p/original/bvVoP1t2gNvmE9ccSrqR1zcGHGM.jpg",
      "https://image.tmdb.org/t/p/original/bvVoP1t2gNvmE9ccSrqR1zcGHGM.jpg",
      "https://image.tmdb.org/t/p/original/bvVoP1t2gNvmE9ccSrqR1zcGHGM.jpg",
      "https://image.tmdb.org/t/p/original/bvVoP1t2gNvmE9ccSrqR1zcGHGM.jpg",
    ],
    isInitiallySaved: savedMap["col-1"] ?? false,
    href: "/collection/col-1",
  };

  return (
    <section>
      <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center justify-between overflow-x-hidden px-3 md:flex-row md:gap-0 md:px-6 lg:gap-16 xl:px-0">
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
        <div className="flex gap-5 px-4 pb-5 pt-12 sm:gap-12 md:p-0">
          <div className="relative">
            <span className="absolute -left-4 -top-6 z-10 font-mono text-[50px] font-bold text-transparent text-white drop-shadow-lg [-webkit-text-stroke:3px_#FFD751] sm:text-[70px]">
              1
            </span>
            <HotCollection
              {...mockCollection}
              saveCount={123}
              onSaveToggle={() => handleSaveToggle}
            />
          </div>
          <div className="relative">
            <span className="absolute -left-4 -top-6 z-10 font-mono text-[50px] font-bold text-transparent text-white drop-shadow-lg [-webkit-text-stroke:3px_#FFD751] sm:text-[80px] md:text-[70px]">
              2
            </span>
            <HotCollection
              {...mockCollection}
              saveCount={123}
              onSaveToggle={() => handleSaveToggle}
            />
          </div>
          <div className="relative">
            <span className="absolute -left-4 -top-6 z-10 font-mono text-[50px] font-bold text-transparent text-white drop-shadow-lg [-webkit-text-stroke:3px_#FFD751] sm:text-[80px] md:text-[70px]">
              3
            </span>
            <HotCollection
              {...mockCollection}
              saveCount={123}
              onSaveToggle={() => handleSaveToggle}
            />
          </div>
        </div>
        <button className="text-popco-foot w-fit rounded-full border-solid px-7 py-4 text-base text-white md:hidden">
          View more +
        </button>
      </div>
    </section>
  );
};

export default HeroCollection;
