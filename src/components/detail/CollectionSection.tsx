import React, { useState, useCallback, useMemo } from "react";
import { Dropdown, Empty } from "antd";
import type { MenuProps } from "antd";
import { useNavigate } from "react-router-dom";

// Swiper 라이브러리 관련 import
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperType } from "swiper";
import "swiper/css";

// 공통 컴포넌트 import
import NewCollection from "@/components/common/NewCollection";
import { SwiperNavigation } from "@/components/common/SwiperButton";
import Spinner from "@/components/common/Spinner";

// Hooks
import useAuthCheck from "@/hooks/useAuthCheck";
import {
  useFetchRelatedCollections,
  useToggleMarkCollection,
} from "@/hooks/useCollections";

// Constants & Types
import { TMDB_IMAGE_BASE_URL } from "@/constants/contents";
import { CollectionProps } from "@/types/Collection.types";

interface CollectionSectionProps {
  contentId: number;
  contentType: string;
}

const sortMenuItems: MenuProps["items"] = [
  { key: "latest", label: "최신순" },
  { key: "popular", label: "인기순" },
];

const CollectionSection: React.FC<CollectionSectionProps> = ({
  contentId,
  contentType,
}) => {
  const [swiper, setSwiper] = useState<SwiperType | undefined>(undefined);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(true);
  const [sortType, setSortType] = useState<"latest" | "popular">("latest");
  const navigate = useNavigate();

  // --- 데이터 페칭 ---
  const { accessToken } = useAuthCheck();
  const {
    data: apiData,
    isLoading,
    isError,
  } = useFetchRelatedCollections({
    contentId,
    contentType,
    sortType,
    accessToken,
  });
  const { mutate: toggleMark } = useToggleMarkCollection();

  const collections = useMemo(() => {
    if (!apiData?.collections) return [];
    return apiData.collections.map((collection: CollectionProps) => ({
      collectionId: collection.collectionId,
      userNickname: collection.userNickname,
      title: collection.title,
      description: collection.description,
      posters: collection.contentPosters
        .slice(0, 6)
        .map((p: any) => `${TMDB_IMAGE_BASE_URL}${p.posterPath}`),
      totalCount: collection.contentCount,
      isSaved: collection.isMarked,
      href: `/collections/${collection.collectionId}`,
    }));
  }, [apiData]);

  // --- 핸들러 ---
  const handleSlideChange = useCallback((swiperInstance: SwiperType) => {
    setIsBeginning(swiperInstance.isBeginning);
    setIsEnd(swiperInstance.isEnd);
  }, []);

  const handleSortChange = useCallback(({ key }: { key: string }) => {
    setSortType(key as "latest" | "popular");
  }, []);

  const handleSaveToggle = useCallback(
    (collectionId: number) => {
      if (!accessToken) {
        alert("로그인이 필요한 기능입니다.");
        navigate("/login");
        return;
      }
      toggleMark({ collectionId: String(collectionId), accessToken });
    },
    [accessToken, toggleMark, navigate],
  );

  // --- 렌더링 ---
  if (isLoading) {
    return (
      <div className="flex h-64 w-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-red-500">
        관련 컬렉션을 불러오는 데 실패했습니다.
      </div>
    );
  }

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-2xl font-bold">관련 컬렉션</h3>
      </div>

      <div className="mb-4 ml-1 flex items-center justify-between">
        <Dropdown
          menu={{ items: sortMenuItems, onClick: handleSortChange }}
          trigger={["click"]}
        >
          <button className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-gray-900">
            {sortType === "latest" ? "최신순" : "인기순"}
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

      {collections.length > 0 ? (
        <Swiper
          slidesPerView="auto"
          spaceBetween={64}
          onSwiper={setSwiper}
          onSlideChange={handleSlideChange}
          onUpdate={handleSlideChange}
          className="pb-2"
        >
          {collections.map((collection) => (
            <SwiperSlide key={collection.collectionId} className="!w-[350px]">
              <NewCollection
                {...collection}
                onSaveToggle={handleSaveToggle}
                size="small"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <div className="flex h-64 w-full items-center justify-center rounded-lg bg-gray-50">
          <Empty description="이 작품이 포함된 컬렉션이 아직 없습니다." />
        </div>
      )}
    </section>
  );
};

export default CollectionSection;
