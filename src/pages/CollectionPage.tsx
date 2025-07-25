import React, { useState, useEffect, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperType } from "swiper";
import { Navigation } from "swiper/modules";

// Swiper 기본 스타일 import
import "swiper/css";
import "swiper/css/navigation";

import PageLayout from "@/layout/PageLayout";
import SectionHeader from "@/components/common/SectionHeader";
import HotCollection from "@/components/common/HotCollection";
import NewCollection from "@/components/common/NewCollection";
import { SwiperNavigation } from "@/components/common/SwiperButton"; // 스와이퍼 버튼 import
import { useSwiperResize } from "@/hooks/useSwiperResize";

import { HotCollectionProps } from "@/components/common/HotCollection";
import { NewCollectionProps } from "@/components/common/NewCollection";

const mockHotCollections: HotCollectionProps[] = [
  {
    collectionId: 101,
    title: "이번 주 저장수 TOP 4",
    posters: [
      "https://image.tmdb.org/t/p/w500/8UlWHLMpgZm9bx6QYh0NFoq67TZ.jpg",
      "https://image.tmdb.org/t/p/w500/9O1Iy9od7d1rA2v9AafBw2qaC2v.jpg",
      "https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg",
      "https://image.tmdb.org/t/p/w500/kqjL17yufvn9OVLyXYpvtyrFfak.jpg",
    ],
    saveCount: 128,
    isSaved: false,
    href: "/collection/101",
    onSaveToggle: () => {},
  },
  {
    collectionId: 102,
    title: "에디터 강력 추천",
    posters: [
      "https://image.tmdb.org/t/p/w500/6Wdl9N6dL0Hi0T1qJLWSz6gMLbd.jpg",
      "https://image.tmdb.org/t/p/w500/xBHvZcjRiWyobQ9kxBhO6B2dtRI.jpg",
      "https://image.tmdb.org/t/p/w500/cjr4NWURcVN3gW5FlHeabgBHLrY.jpg",
      "https://image.tmdb.org/t/p/w500/h4VB6m0RwcicVEZvzftYZyKXs6K.jpg",
    ],
    saveCount: 99,
    isSaved: true,
    href: "/collection/102",
    onSaveToggle: () => {},
  },
  {
    collectionId: 103,
    title: "눈과 귀가 즐거운 뮤지컬",
    posters: [
      "https://image.tmdb.org/t/p/w500/xCEg6KowNISWvMh8GvPSxtdf9TO.jpg",
      "https://image.tmdb.org/t/p/w500/eLT8Cu357VOwBVTitkmlDEg32Fs.jpg",
    ],
    saveCount: 77,
    isSaved: false,
    href: "/collection/103",
    onSaveToggle: () => {},
  },
  {
    collectionId: 104,
    title: "긴장감 폭발 스릴러",
    posters: [
      "https://image.tmdb.org/t/p/w500/sR0SpCrXamlIkYMdfz83sFn5JS6.jpg",
      "https://image.tmdb.org/t/p/w500/q719jXXEzOoYaps6babgKnONONX.jpg",
    ],
    saveCount: 72,
    isSaved: true,
    href: "/collection/104",
    onSaveToggle: () => {},
  },
  {
    collectionId: 105,
    title: "여행 가고 싶게 만드는 영화들",
    posters: [
      "https://image.tmdb.org/t/p/w500/sv1xJUazXeYqALzczSZ3O6nkH75.jpg",
      "https://image.tmdb.org/t/p/w500/1ZSKH5GGFlM8M32K34GMdaNS2Ew.jpg",
      "https://image.tmdb.org/t/p/w500/xRI636TOdS1K1GBqIBRSmfZ1T5x.jpg",
    ],
    saveCount: 65,
    isSaved: false,
    href: "/collection/105",
    onSaveToggle: () => {},
  },
  {
    collectionId: 106,
    title: "아이와 함께 보면 좋은 콘텐츠",
    posters: [
      "https://image.tmdb.org/t/p/w500/jlQJDD0L5ZojjlS0KYnApdO0n19.jpg",
      "https://image.tmdb.org/t/p/w500/mI9pB4cjcOMxKWEFOYVoJxFJa8Z.jpg",
    ],
    saveCount: 53,
    isSaved: false,
    href: "/collection/106",
    onSaveToggle: () => {},
  },
];
const mockNewCollections: NewCollectionProps[] = [
  {
    collectionId: 201,
    userNickname: "영화광",
    title: "주말 정주행 시리즈 모음",
    description: "정주행하다 밤샘할지도 몰라요.",
    posters: [
      "https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg",
      "https://image.tmdb.org/t/p/w500/y95lQLnuNKdPAzw9F9Ab8kJ80c3.jpg",
      "https://image.tmdb.org/t/p/w500/xBHvZcjRiWyobQ9kxBhO6B2dtRI.jpg",
    ],
    totalCount: 10,
    isSaved: true,
    href: "/collection/201",
    onSaveToggle: () => {},
  },
  {
    collectionId: 202,
    userNickname: "팝콘필수",
    title: "눈물주의 감성 드라마",
    description: "티슈 준비 필수! 감동주의 영화 모음.",
    posters: [
      "https://image.tmdb.org/t/p/w500/4ZocdxnOO6q2UbdKye2wgofLFhB.jpg",
      "https://image.tmdb.org/t/p/w500/4q2NNj4S5dG2RLF9CpXsej7yXl.jpg",
    ],
    totalCount: 6,
    isSaved: false,
    href: "/collection/202",
    onSaveToggle: () => {},
  },
  {
    collectionId: 203,
    userNickname: "액션러버",
    title: "액션 폭발 시리즈",
    description: "지루할 틈이 없는 고강도 액션 모음.",
    posters: [
      "https://image.tmdb.org/t/p/w500/xhMZyB78eoJ4jqxkL8U2y9j9g08.jpg",
      "https://image.tmdb.org/t/p/w500/2CAL2433ZeIihfX1Hb2139CX0pW.jpg",
      "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    ],
    totalCount: 8,
    isSaved: true,
    href: "/collection/203",
    onSaveToggle: () => {},
  },
  {
    collectionId: 204,
    userNickname: "로맨스킬러",
    title: "심장 폭행 로맨스",
    description: "설레는 장면만 골라 담았어요.",
    posters: [
      "https://image.tmdb.org/t/p/w500/tINT3GkX7S1r3o6lkh8jK9N7kPQ.jpg",
      "https://image.tmdb.org/t/p/w500/dIWwZW7dJJtqC6CgWzYkNVKIUm8.jpg",
    ],
    totalCount: 7,
    isSaved: false,
    href: "/collection/204",
    onSaveToggle: () => {},
  },
  {
    collectionId: 205,
    userNickname: "세계여행자",
    title: "세계 각국 영화 탐방",
    description: "영화를 통해 떠나는 문화 여행.",
    posters: [
      "https://image.tmdb.org/t/p/w500/hPea3Qy5Gd6z4kJLUruBbwAH8Rm.jpg",
      "https://image.tmdb.org/t/p/w500/mXLOHHc1Zeuwsl4xYKjKh2280oL.jpg",
    ],
    totalCount: 5,
    isSaved: false,
    href: "/collection/205",
    onSaveToggle: () => {},
  },
  {
    collectionId: 206,
    userNickname: "잉글리시마스터",
    title: "영어 공부에 도움 되는 콘텐츠",
    description: "재미도 잡고 공부도 잡는 일석이조 모음.",
    posters: [
      "https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg",
      "https://image.tmdb.org/t/p/w500/pZlo5zLIFW1DFLkwyA42A3bmQM6.jpg",
    ],
    totalCount: 9,
    isSaved: false,
    href: "/collection/206",
    onSaveToggle: () => {},
  },
];

const CollectionPage: React.FC = () => {
  const [swiper, setSwiper] = useState<SwiperType | null>(null);
  const { isBeginning, isEnd } = useSwiperResize(swiper); // 여기만 바뀜

  const [hotCollections, setHotCollections] = useState<HotCollectionProps[]>(
    [],
  );
  const [newCollections, setNewCollections] = useState<NewCollectionProps[]>(
    [],
  );

  useEffect(() => {
    setHotCollections(mockHotCollections);
    setNewCollections(mockNewCollections);
  }, [swiper]);

  const handleSaveToggle = useCallback(/* ... */);

  return (
    <PageLayout
      header={
        <SectionHeader
          title="컬렉션"
          description="보고 싶은 콘텐츠, 추천하고 싶은 시리즈, 그리고 나만의 테마까지 OTT 콘텐츠를 만들어 공유해보세요."
        />
      }
      floatingBoxContent={
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
              {hotCollections.map((collection) => (
                <SwiperSlide
                  key={collection.collectionId}
                  className="flex w-auto items-center pt-12"
                >
                  <HotCollection
                    {...collection}
                    onSaveToggle={() =>
                      handleSaveToggle(collection.collectionId, "hot")
                    }
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </section>
      }
    >
      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold sm:text-2xl">NEW</h2>
          <button
            type="button"
            className="rounded-3xl bg-[var(--colorpopcoHairColor)] px-5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm transition hover:brightness-95"
          >
            컬렉션 만들기
          </button>
        </div>
        <div className="mt-10 grid grid-cols-1 justify-items-center gap-x-6 gap-y-8 lg:grid-cols-2">
          {newCollections.map((collection) => (
            <NewCollection
              {...collection}
              key={collection.collectionId}
              onSaveToggle={() =>
                handleSaveToggle(collection.collectionId, "new")
              }
            />
          ))}
        </div>
      </section>
    </PageLayout>
  );
};

export default CollectionPage;
