import React, { useState, useEffect, useCallback } from "react";
import { Dropdown } from "antd";
import type { MenuProps } from "antd";

// Swiper 라이브러리 관련 import
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperType } from "swiper";
import "swiper/css";

// 공통 컴포넌트 import
import NewCollection from "@/components/common/NewCollection";
import { SwiperNavigation } from "@/components/common/SwiperButton";

/**
 * @interface CollectionData
 */
interface CollectionData {
  collectionId: number;
  userNickname: string;
  title: string;
  description: string;
  posters: string[];
  totalCount: number;
  isSaved: boolean;
  href: string;
}

const mockCollections: CollectionData[] = [
  {
    collectionId: 1,
    userNickname: "영화광",
    title: "여름밤에 보기 좋은 영화",
    description: "무더운 여름밤, 더위를 싹 가시게 해줄 영화들을 모아봤어요.",
    posters: [
      "https://placehold.co/400x600/3B82F6/FFFFFF?text=Poster+1",
      "https://placehold.co/400x600/10B981/FFFFFF?text=Poster+2",
      "https://placehold.co/400x600/F97316/FFFFFF?text=Poster+3",
      "https://placehold.co/400x600/6366F1/FFFFFF?text=Poster+4",
      "https://placehold.co/400x600/EC4899/FFFFFF?text=Poster+5",
      "https://placehold.co/400x600/8B5CF6/FFFFFF?text=Poster+6",
    ],
    totalCount: 12,
    isSaved: false,
    href: "/collection/1",
  },
  {
    collectionId: 2,
    userNickname: "액션매니아",
    title: "심장이 멎을 듯한 액션 명작선",
    description: "아드레날린 폭발! 최고의 액션 영화들을 만나보세요.",
    posters: [
      "https://placehold.co/400x600/EF4444/FFFFFF?text=Poster+A",
      "https://placehold.co/400x600/F59E0B/FFFFFF?text=Poster+B",
      "https://placehold.co/400x600/84CC16/FFFFFF?text=Poster+C",
      "https://placehold.co/400x600/06B6D4/FFFFFF?text=Poster+D",
      "https://placehold.co/400x600/D946EF/FFFFFF?text=Poster+E",
      "https://placehold.co/400x600/78716C/FFFFFF?text=Poster+F",
    ],
    totalCount: 25,
    isSaved: true,
    href: "/collection/2",
  },
  {
    collectionId: 3,
    userNickname: "SF덕후",
    title: "상상력의 한계를 넘어서",
    description: "우주와 미래, 그리고 미지의 세계로 떠나는 여행.",
    posters: [
      "https://placehold.co/400x600/1F2937/FFFFFF?text=Sci-Fi+1",
      "https://placehold.co/400x600/374151/FFFFFF?text=Sci-Fi+2",
      "https://placehold.co/400x600/4B5563/FFFFFF?text=Sci-Fi+3",
      "https://placehold.co/400x600/6B7280/FFFFFF?text=Sci-Fi+4",
      "https://placehold.co/400x600/9CA3AF/FFFFFF?text=Sci-Fi+5",
      "https://placehold.co/400x600/D1D5DB/FFFFFF?text=Sci-Fi+6",
    ],
    totalCount: 18,
    isSaved: false,
    href: "/collection/3",
  },
  {
    collectionId: 4,
    userNickname: "감성충만",
    title: "지브리 스튜디오 명작 컬렉션",
    description: "동심과 감동이 가득한 지브리의 세계로 초대합니다.",
    posters: [
      "https://placehold.co/400x600/22C55E/FFFFFF?text=Ghibli+1",
      "https://placehold.co/400x600/34D399/FFFFFF?text=Ghibli+2",
      "https://placehold.co/400x600/6EE7B7/FFFFFF?text=Ghibli+3",
      "https://placehold.co/400x600/A7F3D0/FFFFFF?text=Ghibli+4",
      "https://placehold.co/400x600/059669/FFFFFF?text=Ghibli+5",
      "https://placehold.co/400x600/047857/FFFFFF?text=Ghibli+6",
    ],
    totalCount: 15,
    isSaved: true,
    href: "/collection/4",
  },
];

// Dropdown 메뉴 아이템 (컴포넌트 외부에 선언하여 불필요한 리렌더링 방지)
const sortMenuItems: MenuProps["items"] = [
  { key: "recent", label: "최신순" },
  { key: "popular", label: "인기순" },
];

const CollectionSection: React.FC = () => {
  const [swiper, setSwiper] = useState<SwiperType | undefined>(undefined);
  const [collections, setCollections] = useState<CollectionData[]>([]);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(true);
  const [sortOrder, setSortOrder] = useState("최신순");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCollections = async () => {
      setIsLoading(true);
      setError(null);
      try {
        await new Promise((resolve) => setTimeout(resolve, 500)); // 0.5초의 로딩 지연 시뮬레이션

        const sortedData = [...mockCollections].sort((a, b) => {
          if (sortOrder === "인기순") {
            return b.totalCount - a.totalCount; // 인기순: totalCount 내림차순
          }
          return b.collectionId - a.collectionId; // 최신순: collectionId 내림차순
        });
        setCollections(sortedData);
      } catch (err) {
        setError("데이터를 불러오는 데 실패했습니다.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCollections();
  }, [sortOrder]);

  const handleSlideChange = useCallback((swiperInstance: SwiperType) => {
    setIsBeginning(swiperInstance.isBeginning);
    setIsEnd(swiperInstance.isEnd);
  }, []);

  const handleSortChange = useCallback(({ key }: { key: string }) => {
    setSortOrder(key === "recent" ? "최신순" : "인기순");
  }, []);

  const handleSaveToggle = useCallback((collectionId: number) => {
    setCollections((currentCollections) =>
      currentCollections.map((collection) => {
        if (collection.collectionId === collectionId) {
          return { ...collection, isSaved: !collection.isSaved };
        }
        return collection;
      }),
    );
  }, []);

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>에러: {error}</div>;

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-2xl font-bold">관련 컬렉션</h3>
      </div>

      <div className="mb-4 ml-1 flex items-center justify-between">
        {/* 정렬 순서 선택 드롭다운 */}
        <Dropdown
          menu={{ items: sortMenuItems, onClick: handleSortChange }}
          trigger={["click"]}
        >
          <button className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-gray-900">
            {sortOrder}
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
        {/* Swiper 좌/우 이동 버튼 */}
        <SwiperNavigation
          swiper={swiper}
          isBeginning={isBeginning}
          isEnd={isEnd}
        />
      </div>

      {/* 컬렉션 목록을 보여주는 Swiper */}
      <Swiper
        slidesPerView="auto" // 슬라이드 너비를 컨텐츠에 맞게 자동 조정
        spaceBetween={32}
        onSwiper={setSwiper} // Swiper 인스턴스를 state에 저장
        onSlideChange={handleSlideChange} // 슬라이드 변경 시 핸들러 연결
        onUpdate={handleSlideChange} // Swiper 상태 업데이트 시 핸들러 연결
        className="pb-2"
      >
        {collections.map((collection) => (
          <SwiperSlide key={collection.collectionId} className="!w-auto">
            <NewCollection {...collection} onSaveToggle={handleSaveToggle} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default CollectionSection;
