import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  lazy,
  Suspense,
} from "react";
import MovieCalendar from "./MovieCalendar";
import ReviewCard from "../common/ReviewCard";
import { getMonthlyReviews } from "@/apis/userApi";
import {
  fetchMyCollections,
  fetchMyMarkedCollections,
} from "@/apis/collectionApi"; // 컬렉션 API import
import { ReviewCardData } from "@/types/Reviews.types"; //리뷰타입 import

import { SwiperNavigation } from "../common/SwiperButton";
import { Swiper as SwiperType } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
const HotCollection = lazy(() => import("../common/HotCollection"));
const LikeContents = lazy(() => import("./LikeContents"));
const WantWatching = lazy(() => import("./WantWatching"));
const MyPageChart = lazy(() => import("./MyPageChart"));
import { App } from "antd";
import Spinner from "../common/Spinner";
import { useNavigate } from "react-router-dom";
import { useToggleMarkCollection } from "@/hooks/useCollections";

interface PageContentsProps {
  accessToken: string; // null이 아닌 string 타입 보장
  user: {
    userId: number;
    nickname: string;
    email: string;
    isLoggedIn: boolean;
  };
  isLoggedIn: boolean;
}

interface Movie {
  date: string;
  title: string;
  poster: string;
  reviewText: string;
  score: number;
  contentId: number;
  contentType: string;
  reviewId: number;
}

interface ContentPoster {
  contentId: number;
  contentType: string;
  posterPath: string;
  title: string;
}

interface Collection {
  collectionId: number;
  userId: number;
  userNickname: string;
  title: string;
  description: string;
  saveCount: number;
  contentCount: number;
  createdAt: string;
  updatedAt: string;
  contentPosters: ContentPoster[];
  isMarked?: boolean; // 저장 상태 추가
}

// YYYY-MM 형식으로 변환하기
const formatMonthForApi = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
};

const PageContents: React.FC<PageContentsProps> = ({
  accessToken,
  user,
  isLoggedIn,
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentMonth, setCurrentMonth] = useState<string>("");

  // 컬렉션 관련 상태를 객체로 그룹화
  const [collectionsState, setCollectionsState] = useState({
    collections: [] as Collection[],
    loading: false,
    error: null as string | null,
  });

  const [markedCollectionsState, setMarkedCollectionsState] = useState({
    collections: [] as Collection[],
    loading: false,
    error: null as string | null,
  });

  const [swiperInstance, setSwiperInstance] = useState<SwiperType | undefined>(
    undefined,
  );
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  const { message } = App.useApp();
  const navigate = useNavigate();

  const { mutate: toggleMark } = useToggleMarkCollection();

  const tabTitles = useMemo(() => ["Calendar", "Collection", "MY"], []);

  const swiperBreakpoints = useMemo(
    () => ({
      320: { slidesPerView: 1.45, spaceBetween: 12 },
      480: { slidesPerView: 2, spaceBetween: 12 },
      640: { slidesPerView: 2, spaceBetween: 14 },
      768: { slidesPerView: 2.7, spaceBetween: 16 },
      1024: { slidesPerView: 3.9, spaceBetween: 16 },
    }),
    [],
  );

  const collectionSwiperBreakpoints = useMemo(
    () => ({
      320: { slidesPerView: 1.45, spaceBetween: 12 },
      480: { slidesPerView: 2, spaceBetween: 12 },
      640: { slidesPerView: 2, spaceBetween: 14 },
      768: { slidesPerView: 3, spaceBetween: 16 },
      1024: { slidesPerView: 4.7, spaceBetween: 16 },
    }),
    [],
  );

  const markedCollectionSwiperBreakpoints = useMemo(
    () => ({
      320: { slidesPerView: 1.6, spaceBetween: 12 },
      480: { slidesPerView: 2, spaceBetween: 12 },
      640: { slidesPerView: 2, spaceBetween: 14 },
      768: { slidesPerView: 3, spaceBetween: 16 },
      1024: { slidesPerView: 4.7, spaceBetween: 16 },
    }),
    [],
  );

  const fetchMonthlyReviews = useCallback(
    async (month: string) => {
      if (!isLoggedIn) {
        console.log("로그인이 필요합니다");
        setMovies([]);
        return;
      }

      try {
        setLoading(true);
        const response = await getMonthlyReviews({ month }, accessToken);
        console.log("월별영화api응답==", response);

        if (response.data) {
          const movieData: Movie[] = response.data.map((review) => ({
            date: review.createdAt
              ? review.createdAt.split("T")[0]
              : new Date().toISOString().split("T")[0],
            title: review.title || "제목 없음",
            poster: review.posterPath || "",
            reviewText: review.text || "",
            score: review.score || 0,
            contentId: review.contentId || 0,
            contentType: review.contentType || "",
            reviewId: review.reviewId || 0,
          }));

          setMovies(movieData);
          console.log("변환된 영화 데이터:", movieData);
        }
      } catch (error) {
        console.error("영화api요청 실패", error);
        setMovies([]);
      } finally {
        setLoading(false);
      }
    },
    [isLoggedIn, accessToken],
  );

  // 수정된 컬렉션 데이터 가져오기 - 저장 상태 포함
  const fetchMyCollectionsData = useCallback(
    async (reset = false) => {
      if (!isLoggedIn || collectionsState.loading) {
        return;
      }

      try {
        setCollectionsState((prev) => ({
          ...prev,
          loading: true,
          error: null,
        }));

        // 내가 만든 컬렉션과 저장한 컬렉션을 동시에 가져오기
        const [myCollectionsResponse, markedCollectionsResponse] =
          await Promise.all([
            fetchMyCollections(accessToken, 0, 100),
            fetchMyMarkedCollections(accessToken),
          ]);

        console.log("컬렉션 API 응답:", myCollectionsResponse);
        console.log("저장한 컬렉션 API 응답:", markedCollectionsResponse);

        if (myCollectionsResponse?.collections) {
          // 저장한 컬렉션 ID 목록 추출
          const markedCollectionIds =
            markedCollectionsResponse.data?.collections?.map(
              (c: Collection) => c.collectionId,
            ) || [];

          // 각 컬렉션에 저장 상태 추가
          const newCollections = myCollectionsResponse.collections.map(
            (collection: Collection) => ({
              ...collection,
              isMarked: markedCollectionIds.includes(collection.collectionId),
            }),
          );

          setCollectionsState((prev) => ({
            ...prev,
            collections: reset
              ? newCollections
              : [...prev.collections, ...newCollections],
            loading: false,
          }));
        }
      } catch (err) {
        console.error("컬렉션 조회 실패:", err);
        setCollectionsState((prev) => ({
          ...prev,
          loading: false,
          error: "컬렉션을 불러오는데 실패했습니다.",
        }));
      }
    },
    [isLoggedIn, accessToken, collectionsState.loading],
  );

  const fetchMyMarkedCollectionsData = useCallback(async () => {
    if (!isLoggedIn || markedCollectionsState.loading) {
      return;
    }

    try {
      setMarkedCollectionsState((prev) => ({
        ...prev,
        loading: true,
        error: null,
      }));

      console.log("저장한 컬렉션 API 요청");
      const response = await fetchMyMarkedCollections(accessToken);
      console.log("저장한 컬렉션 API 응답:", response.data);

      if (response.code === 200 && response.data) {
        setMarkedCollectionsState((prev) => ({
          ...prev,
          collections: response.data.collections,
          loading: false,
        }));
      }
    } catch (err) {
      console.error("저장한 컬렉션 조회 실패:", err);
      setMarkedCollectionsState((prev) => ({
        ...prev,
        loading: false,
        error: "저장한 컬렉션을 불러오는데 실패했습니다.",
      }));
    }
  }, [isLoggedIn, accessToken, markedCollectionsState.loading]);

  // 저장 토글 핸들러
  const handleSaveToggle = useCallback(
    (collectionId: number) => {
      if (!user.isLoggedIn) {
        message.warning("로그인이 필요한 기능입니다.");
        return;
      }

      // API 호출
      toggleMark({
        collectionId: String(collectionId),
        accessToken: accessToken,
      });

      // API 호출 후 약간의 지연을 두고 데이터 새로고침
      setTimeout(() => {
        fetchMyCollectionsData(true);
        fetchMyMarkedCollectionsData();
      }, 100);
    },
    [
      user.isLoggedIn,
      accessToken,
      toggleMark,
      fetchMyCollectionsData,
      fetchMyMarkedCollectionsData,
      message,
    ],
  );

  const handleSwiperInit = useCallback((swiper: SwiperType) => {
    setSwiperInstance(swiper);
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  }, []);

  const handleSlideChange = useCallback((swiper: SwiperType) => {
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  }, []);


  // Movie 데이터를 ReviewCard가 요구하는 ReviewCardData 형태로 변환
  const convertMovieToReviewCardData = (movie: Movie): ReviewCardData => {
    return {
      // === 추후 수정 필요함!!!!!!! import도 수정!! ===
      reviewId: movie.reviewId,
      contentId: movie.contentId,
      contentType: movie.contentType,
      contentTitle: movie.title,
      authorNickname: user.nickname || "익명",
      score: movie.score,
      reviewText: movie.reviewText,
      status: "COMMON",

      likeCount: 0,
      isLiked: false,
      isOwnReview: true,
      hasAlreadyReported: false,

      posterPath: movie.poster,
    };
  };


  useEffect(() => {
    const initialMonth = formatMonthForApi(new Date());
    setCurrentMonth(initialMonth);
    fetchMonthlyReviews(initialMonth);
  }, [fetchMonthlyReviews]);

  useEffect(() => {
    if (
      activeTab === 1 &&
      isLoggedIn &&
      collectionsState.collections.length === 0
    ) {
      fetchMyCollectionsData(true);
      fetchMyMarkedCollectionsData();
    }
  }, [
    activeTab,
    isLoggedIn,
    collectionsState.collections.length,
    fetchMyCollectionsData,
    fetchMyMarkedCollectionsData,
  ]);

  const renderEmptyState = useCallback(
    (message: string) => (
      <div className="flex h-32 items-center justify-center text-gray-500">
        {message}
      </div>
    ),
    [],
  );

  const renderLoadingState = useCallback(
    (message: string) => (
      <div className="flex h-32 items-center justify-center text-gray-500">
        <Spinner /> {message}
      </div>
    ),
    [],
  );

  return (
    <div className="pretendard">
      <div>
        <div className="flex space-x-2 rounded-lg">
          {tabTitles.map((title, i) => (
            <button
              key={i}
              className={`pretendard-bold ml-2 w-24 rounded-t-[20px] bg-gray-100 px-4 py-2 text-sm transition-all md:w-36 md:text-xl ${
                activeTab === i
                  ? "bg-popco-main text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              } `}
              onClick={() => handleTabChange(i)}
            >
              {title}
            </button>
          ))}
        </div>

        <div className="rounded-b-[8px] border border-gray-200 bg-white p-6">
          {activeTab === 0 && (
            <div>
              <h1 className="gmarket-bold py-2 text-base md:text-2xl">
                이 달엔 이런 작품을 봤어요
              </h1>
              <MovieCalendar
                movies={movies}
                loading={loading}
                currentMonth={currentMonth}
                onMonthChange={handleMonthChange}
              />

              <div className="mt-6">
                <div className="mb-4 flex items-center justify-between">
                  <h1 className="gmarket-bold py-2 text-base md:text-2xl">
                    이달엔 이런 리뷰를 남겼어요
                  </h1>
                  <SwiperNavigation
                    swiper={swiperInstance}
                    isBeginning={isBeginning}
                    isEnd={isEnd}
                  />
                </div>

                {movies.length === 0 &&
                  !loading &&
                  renderEmptyState("이번 달에는 작성한 리뷰가 없습니다.")}

                {loading && renderLoadingState("리뷰를 불러오는 중...")}

                {movies.length > 0 && !loading && (
                  <div className="relative -mx-6 px-6 md:mx-0 md:px-0">
                    <Swiper
                      modules={[Navigation]}
                      spaceBetween={16}
                      slidesPerView={2}
                      onSwiper={handleSwiperInit}
                      onSlideChange={handleSlideChange}
                      navigation={{
                        prevEl: ".swiper-button-prev",
                        nextEl: ".swiper-button-next",
                      }}
                      breakpoints={swiperBreakpoints}
                      className="w-full overflow-hidden"
                    >
                      {movies.map((movie) => (
                        <SwiperSlide key={movie.reviewId} className="!h-auto">
                          <ReviewCard

                            // 리뷰카드 호출!!
                            reviewData={convertMovieToReviewCardData(movie)}

                          />
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 1 && (
            <div>
              <div className="mt-6">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex flex-col items-center gap-3 text-center sm:flex-row">
                    <h1 className="gmarket-bold mt-2 py-2 text-base md:text-2xl">
                      내가 만든 컬렉션
                    </h1>
                    <button
                      type="button"
                      onClick={handleCreateCollection}
                      className="h-8 rounded-3xl bg-[var(--colorpopcoHairColor)] px-5 text-sm font-semibold text-gray-900 shadow-sm transition hover:brightness-95"
                    >
                      컬렉션 만들기
                    </button>
                  </div>
                  <SwiperNavigation
                    swiper={swiperInstance}
                    isBeginning={isBeginning}
                    isEnd={isEnd}
                  />
                </div>

                {collectionsState.loading &&
                  collectionsState.collections.length === 0 &&
                  renderLoadingState("컬렉션을 불러우는 중...")}

                {!collectionsState.loading &&
                  collectionsState.collections.length === 0 &&
                  !collectionsState.error &&
                  isLoggedIn &&
                  renderEmptyState("아직 만든 컬렉션이 없습니다.")}

                {collectionsState.collections.length > 0 &&
                  !collectionsState.loading && (
                    <div className="relative -mx-6 px-6 md:mx-0 md:px-0">
                      <Swiper
                        modules={[Navigation]}
                        spaceBetween={16}
                        slidesPerView={2}
                        onSwiper={handleSwiperInit}
                        onSlideChange={handleSlideChange}
                        navigation={{
                          prevEl: ".swiper-button-prev",
                          nextEl: ".swiper-button-next",
                        }}
                        breakpoints={collectionSwiperBreakpoints}
                        className="w-full overflow-hidden pt-5"
                      >
                        {collectionsState.collections.map((collection) => (
                          <SwiperSlide
                            key={collection.collectionId}
                            className="!h-auto"
                          >
                            <Suspense fallback={<Spinner />}>
                              <HotCollection
                                collectionId={collection.collectionId}
                                title={collection.title}
                                posters={collection.contentPosters.map(
                                  (poster) => poster.posterPath,
                                )}
                                saveCount={collection.saveCount || 0}
                                isSaved={collection.isMarked || false} // 실제 저장 상태 사용
                                href={`/collections/${collection.collectionId}`}
                                onSaveToggle={() =>
                                  handleSaveToggle(collection.collectionId)
                                }
                              />
                            </Suspense>
                          </SwiperSlide>
                        ))}
                      </Swiper>
                    </div>
                  )}
              </div>

              <div className="mt-6">
                <div className="mb-4 flex items-center justify-between">
                  <h1 className="gmarket-bold mt-2 py-2 text-base md:text-2xl">
                    내가 저장한 컬렉션
                  </h1>
                  <SwiperNavigation
                    swiper={swiperInstance}
                    isBeginning={isBeginning}
                    isEnd={isEnd}
                  />
                </div>

                {markedCollectionsState.loading &&
                  markedCollectionsState.collections.length === 0 &&
                  renderLoadingState("저장한 컬렉션을 불러오는 중...")}

                {!markedCollectionsState.loading &&
                  markedCollectionsState.collections.length === 0 &&
                  !markedCollectionsState.error &&
                  isLoggedIn &&
                  renderEmptyState("아직 저장한 컬렉션이 없습니다.")}

                {markedCollectionsState.collections.length > 0 &&
                  !markedCollectionsState.loading && (
                    <div className="relative -mx-6 px-6 md:mx-0 md:px-0">
                      <Swiper
                        modules={[Navigation]}
                        spaceBetween={16}
                        slidesPerView={2}
                        onSwiper={handleSwiperInit}
                        onSlideChange={handleSlideChange}
                        navigation={{
                          prevEl: ".swiper-button-prev",
                          nextEl: ".swiper-button-next",
                        }}
                        breakpoints={markedCollectionSwiperBreakpoints}
                        className="w-full overflow-hidden pt-5"
                      >
                        {markedCollectionsState.collections.map(
                          (collection) => (
                            <SwiperSlide
                              key={collection.collectionId}
                              className="!h-auto"
                            >
                              <Suspense fallback={<Spinner />}>
                                <HotCollection
                                  collectionId={collection.collectionId}
                                  title={collection.title}
                                  posters={collection.contentPosters.map(
                                    (poster) => poster.posterPath,
                                  )}
                                  saveCount={collection.saveCount || 0}
                                  isSaved={collection.isMarked || true} // 저장한 컬렉션은 항상 저장됨
                                  href={`/collections/${collection.collectionId}`}
                                  onSaveToggle={() =>
                                    handleSaveToggle(collection.collectionId)
                                  }
                                />
                              </Suspense>
                            </SwiperSlide>
                          ),
                        )}
                      </Swiper>
                    </div>
                  )}
              </div>
            </div>
          )}

          {activeTab === 2 && (
            <div>
              <div>
                <Suspense fallback={<Spinner />}>
                  <MyPageChart accessToken={accessToken} />
                </Suspense>
              </div>
              <div>
                {isLoggedIn ? (
                  <Suspense fallback={<Spinner />}>
                    <WantWatching userId={user.userId} />
                  </Suspense>
                ) : (
                  renderEmptyState("로그인이 필요합니다.")
                )}
              </div>
              <div>
                {isLoggedIn ? (
                  <Suspense fallback={<Spinner />}>
                    <LikeContents accessToken={accessToken} />
                  </Suspense>
                ) : (
                  renderEmptyState("로그인이 필요합니다.")
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageContents;
