import React, { useState, useEffect } from "react";
import MovieCalendar from "./MovieCalendar";
import ReviewCard from "../common/ReviewCard";
import useAuthCheck from "@/hooks/useAuthCheck";
import { getMonthlyReviews } from "@/apis/userApi";
import {
  fetchMyCollections,
  fetchMyMarkedCollections,
} from "@/apis/collectionApi"; // 컬렉션 API import
import { SwiperNavigation } from "../common/SwiperButton";
import { Swiper as SwiperType } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import HotCollection from "../common/HotCollection"; // HotCollection import
import LikeContents from "./LikeContents";
import WantWatching from "./WantWatching";
import MyPageChart from "./MyPageChart";

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

interface ReviewData {
  movieTitle: string;
  score: number;
  reviewText: string;
  nickname: string;
  likeCount: number;
  isSpoiler: boolean;
  isOwnReview: boolean;
  isLiked: boolean;
  hasAlreadyReported: boolean;
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
}

const PageContents: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentMonth, setCurrentMonth] = useState<string>("");

  // 컬렉션 관련 상태
  const [collections, setCollections] = useState<Collection[]>([]);
  const [collectionsLoading, setCollectionsLoading] = useState(false);
  const [collectionsError, setCollectionsError] = useState<string | null>(null);
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize] = useState(20);
  const [hasMore, setHasMore] = useState(true);

  // 저장한 컬렉션 관련 상태
  const [markedCollections, setMarkedCollections] = useState<Collection[]>([]);
  const [markedCollectionsLoading, setMarkedCollectionsLoading] =
    useState(false);
  const [markedCollectionsError, setMarkedCollectionsError] = useState<
    string | null
  >(null);

  const [swiperInstance, setSwiperInstance] = useState<SwiperType | undefined>(
    undefined,
  );
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  const { accessToken, user } = useAuthCheck();
  const tabTitles = ["Calendar", "Collection", "MY"];

  // YYYY-MM 형식으로 변환하기
  const formatMonthForApi = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    return `${year}-${month}`;
  };

  const fetchMonthlyReviews = async (month: string) => {
    if (!accessToken || !user.isLoggedIn) {
      console.log("로그인이 필요합니다");
      setMovies([]);
      return;
    }

    try {
      setLoading(true);
      console.log(`API 요청: /reviews/my/monthly?month=${month}`);
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
  };

  // 컬렉션 목록 가져오기
  const fetchMyCollectionsData = async (page = 0, reset = false) => {
    if (!accessToken || !user.isLoggedIn || collectionsLoading) {
      return;
    }

    try {
      setCollectionsLoading(true);
      setCollectionsError(null);

      console.log(`컬렉션 API 요청: page=${page}, pageSize=${pageSize}`);
      const response = await fetchMyCollections(accessToken, page, pageSize);
      console.log("컬렉션 API 응답:", response);

      if (response.code === 200 && response.data) {
        const newCollections = response.data.collections;

        if (reset) {
          setCollections(newCollections);
        } else {
          setCollections((prev) => [...prev, ...newCollections]);
        }

        // 더 이상 데이터가 없으면 hasMore를 false로 설정
        setHasMore(newCollections.length === pageSize);
        setPageNumber(page);
      }
    } catch (err) {
      console.error("컬렉션 조회 실패:", err);
      setCollectionsError("컬렉션을 불러오는데 실패했습니다.");
    } finally {
      setCollectionsLoading(false);
    }
  };

  // 저장한 컬렉션 목록 가져오기
  const fetchMyMarkedCollectionsData = async () => {
    if (!accessToken || !user.isLoggedIn || markedCollectionsLoading) {
      return;
    }

    try {
      setMarkedCollectionsLoading(true);
      setMarkedCollectionsError(null);

      console.log("저장한 컬렉션 API 요청");
      const response = await fetchMyMarkedCollections(accessToken, 0, pageSize);
      console.log("저장한 컬렉션 API 응답:", response);

      if (response.code === 1073741824 && response.data) {
        setMarkedCollections(response.data.collections);
      }
    } catch (err) {
      console.error("저장한 컬렉션 조회 실패:", err);
      setMarkedCollectionsError("저장한 컬렉션을 불러오는데 실패했습니다.");
    } finally {
      setMarkedCollectionsLoading(false);
    }
  };

  // 컬렉션 저장/취소 토글
  const handleSaveToggle = async (collectionId: number) => {
    try {
      // 실제로는 저장/취소 API를 호출해야 합니다
      console.log("저장 토글:", collectionId);
      // API 호출 후 성공하면 상태 업데이트
      // await axios.post/delete('/collections/save', { collectionId }, { headers: { Authorization: `Bearer ${accessToken}` }});
    } catch (err) {
      console.error("저장 토글 실패:", err);
    }
  };

  const handleSwiperInit = (swiper: SwiperType) => {
    console.log("Swiper 초기화됨:", swiper);
    setSwiperInstance(swiper);
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  };

  const handleSlideChange = (swiper: SwiperType) => {
    console.log("슬라이드 변경:", swiper.activeIndex);
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  };

  // Movie 데이터를 ReviewCard가 요구하는 ReviewData 형태로 변환
  const convertToReviewData = (movie: Movie): ReviewData => {
    return {
      movieTitle: movie.title || "제목 없음",
      score: movie.score || 0,
      reviewText: movie.reviewText || "리뷰 내용이 없습니다",
      nickname: user.nickname || "익명",
      likeCount: 0,
      isSpoiler: false,
      isOwnReview: true,
      isLiked: false,
      hasAlreadyReported: false,
    };
  };

  // 컴포넌트 마운트 시 및 로그인 상태 변경 시 현재 월 데이터 가져오기
  useEffect(() => {
    const initialMonth = formatMonthForApi(new Date());
    setCurrentMonth(initialMonth);
    fetchMonthlyReviews(initialMonth);
  }, [accessToken, user.isLoggedIn]);

  // 컬렉션 탭이 활성화될 때 컬렉션 데이터 가져오기
  useEffect(() => {
    if (
      activeTab === 1 &&
      accessToken &&
      user.isLoggedIn &&
      collections.length === 0
    ) {
      fetchMyCollectionsData(0, true);
      fetchMyMarkedCollectionsData(); // 저장한 컬렉션도 함께 로드
    }
  }, [activeTab, accessToken, user.isLoggedIn]);

  // 달력에서 월이 변경될 때 호출될 함수
  const handleMonthChange = (activeStartDate: Date | null) => {
    if (activeStartDate) {
      const newMonth = formatMonthForApi(activeStartDate);
      if (newMonth !== currentMonth) {
        setCurrentMonth(newMonth);
        fetchMonthlyReviews(newMonth);
      }
    }
  };

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
              onClick={() => setActiveTab(i)}
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

              {/* 리뷰 카드 Swiper 섹션 */}
              <div className="mt-6">
                <div className="mb-4 flex items-center justify-between">
                  <h1 className="gmarket-bold py-2 text-base">
                    이달엔 이런 리뷰를 남겼어요
                  </h1>
                  {/* 네비게이션 버튼 */}
                  <SwiperNavigation
                    swiper={swiperInstance}
                    isBeginning={isBeginning}
                    isEnd={isEnd}
                  />
                </div>

                {/* 리뷰가 없을 때 */}
                {movies.length === 0 && !loading && (
                  <div className="flex h-32 items-center justify-center text-gray-500">
                    이번 달에는 작성한 리뷰가 없습니다.
                  </div>
                )}

                {/* 로딩 중 */}
                {loading && (
                  <div className="flex h-32 items-center justify-center text-gray-500">
                    리뷰를 불러오는 중...
                  </div>
                )}

                {/* Swiper 컨테이너 - 모바일 오버플로우 방지 */}
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
                      breakpoints={{
                        320: {
                          slidesPerView: 2,
                          spaceBetween: 12,
                        },
                        480: {
                          slidesPerView: 2,
                          spaceBetween: 12,
                        },
                        640: {
                          slidesPerView: 2,
                          spaceBetween: 14,
                        },
                        768: {
                          slidesPerView: 2.7,
                          spaceBetween: 16,
                        },
                        1024: {
                          slidesPerView: 3.9,
                          spaceBetween: 16,
                        },
                      }}
                      className="w-full overflow-hidden"
                    >
                      {movies.map((movie) => (
                        <SwiperSlide key={movie.reviewId} className="!h-auto">
                          <ReviewCard
                            reviewData={convertToReviewData(movie)}
                            contentId={movie.contentId}
                            contentType={movie.contentType}
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
              {/* 컬렉션 Swiper 섹션 */}
              <div className="mt-6">
                <div className="mb-4 flex items-center justify-between">
                  <h1 className="gmarket-bold py-2 text-base md:text-2xl">
                    내가 만든 컬렉션
                  </h1>
                  {/* 네비게이션 버튼 */}
                  <SwiperNavigation
                    swiper={swiperInstance}
                    isBeginning={isBeginning}
                    isEnd={isEnd}
                  />
                </div>

                {/* 로딩 상태 (첫 로드) */}
                {collectionsLoading && collections.length === 0 && (
                  <div className="flex h-32 items-center justify-center text-gray-500">
                    컬렉션을 불러오는 중...
                  </div>
                )}

                {/* 컬렉션이 없는 경우 */}
                {!collectionsLoading &&
                  collections.length === 0 &&
                  !collectionsError &&
                  user.isLoggedIn && (
                    <div className="flex h-32 items-center justify-center text-gray-500">
                      아직 만든 컬렉션이 없습니다.
                    </div>
                  )}

                {/* Swiper 컨테이너 - 모바일 오버플로우 방지 */}
                {collections.length > 0 && !collectionsLoading && (
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
                      breakpoints={{
                        320: {
                          slidesPerView: 1.2,
                          spaceBetween: 12,
                        },
                        480: {
                          slidesPerView: 1.5,
                          spaceBetween: 12,
                        },
                        640: {
                          slidesPerView: 2,
                          spaceBetween: 14,
                        },
                        768: {
                          slidesPerView: 2.5,
                          spaceBetween: 16,
                        },
                        1024: {
                          slidesPerView: 3,
                          spaceBetween: 16,
                        },
                      }}
                      className="w-full overflow-hidden pt-5"
                    >
                      {collections.map((collection) => (
                        <SwiperSlide
                          key={collection.collectionId}
                          className="!h-auto"
                        >
                          <HotCollection
                            collectionId={collection.collectionId}
                            title={collection.title}
                            posters={collection.contentPosters.map(
                              (poster) => poster.posterPath,
                            )}
                            saveCount={collection.saveCount || 0}
                            isSaved={false}
                            href={`/collections/${collection.collectionId}`}
                            onSaveToggle={handleSaveToggle}
                          />
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>
                )}
              </div>

              {/* 내가 저장한 컬렉션 */}
              <div className="mt-6">
                <div className="mb-4 flex items-center justify-between">
                  <h1 className="gmarket-bold py-2 text-base md:text-2xl">
                    내가 저장한 컬렉션
                  </h1>
                  {/* 네비게이션 버튼 */}
                  <SwiperNavigation
                    swiper={swiperInstance}
                    isBeginning={isBeginning}
                    isEnd={isEnd}
                  />
                </div>

                {/* 로딩 상태 (첫 로드) */}
                {markedCollectionsLoading && markedCollections.length === 0 && (
                  <div className="flex h-32 items-center justify-center text-gray-500">
                    저장한 컬렉션을 불러오는 중...
                  </div>
                )}

                {/* 컬렉션이 없는 경우 */}
                {!markedCollectionsLoading &&
                  markedCollections.length === 0 &&
                  !markedCollectionsError &&
                  user.isLoggedIn && (
                    <div className="flex h-32 items-center justify-center text-gray-500">
                      아직 저장한 컬렉션이 없습니다.
                    </div>
                  )}

                {/* Swiper 컨테이너 - 모바일 오버플로우 방지 */}
                {markedCollections.length > 0 && !markedCollectionsLoading && (
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
                      breakpoints={{
                        320: {
                          slidesPerView: 1.2,
                          spaceBetween: 12,
                        },
                        480: {
                          slidesPerView: 1.5,
                          spaceBetween: 12,
                        },
                        640: {
                          slidesPerView: 2,
                          spaceBetween: 14,
                        },
                        768: {
                          slidesPerView: 2.5,
                          spaceBetween: 16,
                        },
                        1024: {
                          slidesPerView: 3,
                          spaceBetween: 16,
                        },
                      }}
                      className="w-full overflow-hidden pt-5"
                    >
                      {markedCollections.map((collection) => (
                        <SwiperSlide
                          key={collection.collectionId}
                          className="!h-auto"
                        >
                          <HotCollection
                            collectionId={collection.collectionId}
                            title={collection.title}
                            posters={collection.contentPosters.map(
                              (poster) => poster.posterPath,
                            )}
                            saveCount={collection.saveCount || 0}
                            isSaved={true} // 저장한 컬렉션이므로 true
                            href={`/collections/${collection.collectionId}`}
                            onSaveToggle={handleSaveToggle}
                          />
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 2 && (
            <div>
              <div>
                <MyPageChart accessToken={accessToken} />
              </div>
              {/* 내가 보고싶어해요 */}
              <div>
                {accessToken ? (
                  <WantWatching userId={user.userId} />
                ) : (
                  <div className="flex h-32 items-center justify-center text-gray-500">
                    로그인이 필요합니다.
                  </div>
                )}
              </div>

              {/* 내가 좋아해요 */}
              <div>
                {accessToken ? (
                  <LikeContents accessToken={accessToken} />
                ) : (
                  <div className="flex h-32 items-center justify-center text-gray-500">
                    로그인이 필요합니다.
                  </div>
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
