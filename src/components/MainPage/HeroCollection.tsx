import { useState, useCallback, useMemo } from "react";
import HotCollection from "../common/HotCollection";
import { useWeeklyCollections } from "@/hooks/queries/collections/useWeeklyCollections";
import { HotCollections } from "@/types/Collection.types";
import { TMDB_IMAGE_BASE_URL } from "@/constants/contents";

const HeroCollection = () => {
  const { data, isLoading, isError } = useWeeklyCollections(3);

  // 변환된 데이터를 캐싱 (메모이제이션)
  const hotCollections: HotCollections[] = useMemo(() => {
    if (!data) return [];
    return data.map((collection) => ({
      collectionId: collection.collectionId,
      title: collection.title,
      posters: collection.contentPosters
        .slice(-4)
        .reverse()
        .map((c) => `${TMDB_IMAGE_BASE_URL}${c.posterPath}`),
      href: `/collections/${collection.collectionId}`,
      saveCount: collection.saveCount,
    }));
  }, [data]);

  const [savedMap, setSavedMap] = useState<Record<number, boolean>>({});

  const handleSaveToggle = useCallback((collectionId: number) => {
    setSavedMap((prev) => ({
      ...prev,
      [collectionId]: !prev[collectionId],
    }));
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

        <div className="flex gap-3 px-4 pb-5 pt-12 sm:gap-6 md:gap-8 md:p-0 lg:gap-12">
          {isLoading ? (
            <div className="text-base text-gray-400">Loading...</div>
          ) : isError ? (
            <div className="text-base text-red-500">
              데이터를 불러오지 못했어요. 잠시 후 다시 시도해주세요.
            </div>
          ) : (
            hotCollections.map((collection, index) => (
              <div key={collection.collectionId} className="relative">
                <span className="absolute -left-4 -top-6 z-10 font-mono text-[50px] font-bold text-transparent text-white drop-shadow-lg [-webkit-text-stroke:3px_#FFD751] lg:text-[70px]">
                  {index + 1}
                </span>
                <HotCollection
                  {...collection}
                  isSaved={savedMap[collection.collectionId] ?? false}
                  onSaveToggle={handleSaveToggle}
                  size="small"
                />
              </div>
            ))
          )}
        </div>

        <button className="text-popco-foot w-fit rounded-full border-solid px-7 py-4 text-base text-white md:hidden">
          View more +
        </button>
      </div>
    </section>
  );
};

export default HeroCollection;
