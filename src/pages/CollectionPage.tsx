import React, { useState, useEffect, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperType } from "swiper";
import { Navigation } from "swiper/modules";
import { useInView } from "react-intersection-observer";
import { useNavigate } from "react-router-dom";
import { App } from "antd";

import "swiper/css";
import "swiper/css/navigation";

// --- 컴포넌트 & 훅 ---
import PageLayout from "@/layout/PageLayout";
import SectionHeader from "@/components/common/SectionHeader";
import HotCollection from "@/components/common/HotCollection";
import NewCollection from "@/components/common/NewCollection";
import { SwiperNavigation } from "@/components/common/SwiperButton";
import HotCollectionSkeleton from "@/components/common/HotCollectionSkeleton";
import NewCollectionSkeleton from "@/components/common/NewCollectionSkeleton";
import useAuthCheck from "@/hooks/useAuthCheck";
import {
  useFetchCollections,
  useFetchCollectionsWeekly,
  useToggleMarkCollection,
} from "@/hooks/useCollections";
import { useSwiperResize } from "@/hooks/useSwiperResize";

// TMDB 이미지 기본 URL
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

const CollectionPage: React.FC = () => {
  const { message } = App.useApp();
  const { user, accessToken } = useAuthCheck();
  const navigate = useNavigate();

  // --- Swiper 상태 관리 ---
  const [swiper, setSwiper] = useState<SwiperType | null>(null);
  const { isBeginning, isEnd } = useSwiperResize(swiper);

  // --- 데이터 페칭 ---
  const { data: hotCollections, isLoading: isLoadingHot } =
    useFetchCollectionsWeekly(10, accessToken);

  const {
    data: newCollectionsData,
    fetchNextPage,
    hasNextPage,
    isLoading: isLoadingNew,
    isFetchingNextPage,
  } = useFetchCollections(10, accessToken);

  const { mutate: toggleMark } = useToggleMarkCollection();

  // --- 무한 스크롤 로직 ---
  const { ref, inView } = useInView({
    threshold: 0,
    triggerOnce: false,
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // --- 핸들러 ---
  const handleSaveToggle = useCallback(
    (collectionId: number) => {
      if (!user.isLoggedIn) {
        message.warning("로그인이 필요한 기능입니다.");
        return;
      }
      toggleMark({
        collectionId: String(collectionId),
        accessToken: accessToken!,
      });
    },
    [user.isLoggedIn, accessToken, toggleMark, message],
  );

  return (
    <PageLayout
      header={
        <SectionHeader
          title="컬렉션"
          description="보고 싶은 콘텐츠, 추천하고 싶은 시리즈, 그리고 나만의 테마까지 OTT 콘텐츠를 만들어 공유해보세요."
        />
      }
      floatingBoxContent={
        isLoadingHot ? (
          <section className="px-6 pt-4 sm:px-8">
            <div className="mb-4 h-8 w-16 animate-pulse rounded bg-gray-200"></div>
            <div className="flex gap-8 overflow-hidden pt-12">
              {Array.from({ length: 4 }).map((_, index) => (
                <HotCollectionSkeleton key={index} />
              ))}
            </div>
          </section>
        ) : (
          <section className="px-6 pt-4 sm:px-8">
            <h2 className="text-xl font-bold sm:text-2xl">HOT</h2>
            <div className="relative mt-4 h-[340px] md:ml-12 md:h-[360px]">
              <SwiperNavigation
                swiper={swiper}
                isBeginning={isBeginning}
                isEnd={isEnd}
                className="absolute right-0 top-0 z-10"
              />
              <Swiper
                modules={[Navigation]}
                onSwiper={setSwiper}
                slidesPerView="auto"
                spaceBetween={34}
                className="h-full"
              >
                {hotCollections?.map((collection) => (
                  <SwiperSlide
                    key={collection.collectionId}
                    className="flex w-auto items-center pt-12"
                  >
                    <HotCollection
                      collectionId={collection.collectionId}
                      title={collection.title}
                      posters={collection.contentPosters
                        .slice(0, 4)
                        .map((p) => `${IMAGE_BASE_URL}${p.posterPath}`)}
                      saveCount={collection.saveCount}
                      isSaved={collection.isMarked}
                      href={`/collections/${collection.collectionId}`}
                      onSaveToggle={() =>
                        handleSaveToggle(collection.collectionId)
                      }
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </section>
        )
      }
    >
      {isLoadingNew ? (
        <section>
          <div className="mb-10 flex items-center justify-between">
            <div className="h-8 w-20 animate-pulse rounded bg-gray-200"></div>
            <div className="h-10 w-32 animate-pulse rounded-3xl bg-gray-200"></div>
          </div>
          <div className="grid grid-cols-1 justify-items-center gap-x-24 gap-y-16 lg:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <NewCollectionSkeleton key={index} />
            ))}
          </div>
        </section>
      ) : (
        <section>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold sm:text-2xl">NEW</h2>
            <button
              type="button"
              onClick={() => navigate("/collections/create")}
              className="rounded-3xl bg-[var(--colorpopcoHairColor)] px-5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm transition hover:brightness-95"
            >
              컬렉션 만들기
            </button>
          </div>

          <div className="mt-10 grid grid-cols-1 justify-items-center gap-x-24 gap-y-16 lg:grid-cols-2">
            {newCollectionsData?.pages.map((page, i) => (
              <React.Fragment key={i}>
                {page.map((collection) => (
                  <NewCollection
                    key={collection.collectionId}
                    collectionId={collection.collectionId}
                    userNickname={collection.userNickname}
                    title={collection.title}
                    description={collection.description}
                    posters={collection.contentPosters
                      .slice(0, 6)
                      .map((p) => `${IMAGE_BASE_URL}${p.posterPath}`)}
                    totalCount={collection.contentCount}
                    isSaved={collection.isMarked}
                    href={`/collections/${collection.collectionId}`}
                    onSaveToggle={() =>
                      handleSaveToggle(collection.collectionId)
                    }
                  />
                ))}
              </React.Fragment>
            ))}
          </div>

          {/* 무한 스크롤 감지를 위한 요소 */}
          <div ref={ref} style={{ height: "50px" }} />
          {/* 추가 로딩 시 스켈레톤 표시 */}
          {isFetchingNextPage && (
            <div className="mt-16 grid grid-cols-1 justify-items-center gap-x-24 gap-y-16 lg:grid-cols-2">
              {Array.from({ length: 2 }).map((_, index) => (
                <NewCollectionSkeleton key={`loading-${index}`} />
              ))}
            </div>
          )}
        </section>
      )}
    </PageLayout>
  );
};

export default CollectionPage;
