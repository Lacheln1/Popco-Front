import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  lazy,
  Suspense,
  useRef,
} from "react";
import MovieCalendar from "./MovieCalendar";
import ReviewCard from "../common/ReviewCard";
import { getMonthlyReviews } from "@/apis/userApi";
import {
  fetchMyCollections,
  fetchMyMarkedCollections,
} from "@/apis/collectionApi";
import { ReviewCardData } from "@/types/Reviews.types";
import { SwiperNavigation } from "../common/SwiperButton";
import { Swiper as SwiperType } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
const HotCollection = lazy(() => import("../common/HotCollection"));
const LikeContents = lazy(() => import("./LikeContents"));
const WantWatching = lazy(() => import("./WantWatching"));
const MyPageChart = lazy(() => import("./MyPageChart"));
import { App, Form, Select } from "antd";
import Spinner from "../common/Spinner";
import { useNavigate } from "react-router-dom";
import { useToggleMarkCollection } from "@/hooks/useCollections";
import { useQueryClient } from "@tanstack/react-query";
import {
  useDeleteReview,
  useFetchDeclarationTypes,
  usePostReviewDeclaration,
  useToggleReviewReaction,
} from "@/hooks/useReviews";
import ReviewModal from "@/components/ReviewModal/ReviewModal";

interface PageContentsProps {
  accessToken: string;
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
  likeCount?: number;
  isLiked?: boolean;
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
  isMarked?: boolean;
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
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState(0);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [reportForm] = Form.useForm();

  // 현재 월을 안정적으로 관리
  const [currentMonth, setCurrentMonth] = useState(() =>
    formatMonthForApi(new Date()),
  );

  // API 요청 중복 방지를 위한 refs
  const collectionsRequestRef = useRef(false);
  const markedCollectionsRequestRef = useRef(false);
  const isInitializedRef = useRef(false);

  // 리뷰 모달 상태
  const [reviewModalState, setReviewModalState] = useState({
    isOpen: false,
    isWriting: true,
    editingData: null as ReviewCardData | null,
  });

  // 컬렉션 상태를 단순화
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

  // Swiper 상태를 하나의 객체로 관리
  const [swiperState, setSwiperState] = useState({
    instance: undefined as SwiperType | undefined,
    isBeginning: true,
    isEnd: false,
  });

  const { message, modal } = App.useApp();
  const navigate = useNavigate();

  const { mutate: toggleMark } = useToggleMarkCollection();

  // 리뷰 관련 훅들
  const { data: declarationTypes, isLoading: isDeclarationTypesLoading } =
    useFetchDeclarationTypes();

  // 현재 리뷰 컨텍스트 관리
  const [reviewContext, setReviewContext] = useState({
    contentId: 1,
    contentType: "movie",
  });

  const { mutate: deleteReview, isPending: isDeleting } = useDeleteReview(
    reviewContext.contentId,
    reviewContext.contentType,
  );

  const { mutate: reportReview, isPending: isReporting } =
    usePostReviewDeclaration(
      reviewContext.contentId,
      reviewContext.contentType,
    );

  const { mutate: toggleLikeReaction } = useToggleReviewReaction(
    reviewContext.contentId,
    reviewContext.contentType,
    "recent",
  );

  // 메모이제이션된 상수들
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

  // 월별 리뷰 fetch 함수 최적화
  const fetchMonthlyReviews = useCallback(
    async (month: string) => {
      if (!isLoggedIn || !accessToken) {
        setMovies([]);
        return;
      }

      try {
        setLoading(true);
        const response = await getMonthlyReviews({ month }, accessToken);

        if (response.data) {
          const movieData: Movie[] = response.data.map((review: any) => ({
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
            likeCount: review.likeCount || 0,
            isLiked: review.liked || false,
          }));

          setMovies(movieData);
        }
      } catch (error) {
        console.error("영화api요청 실패", error);
        setMovies([]);
      } finally {
        setLoading(false);
      }
    },
    [isLoggedIn, accessToken], // 의존성 최소화
  );

  // 컬렉션 데이터 fetch 함수 최적화
  const fetchMyCollectionsData = useCallback(
    async (reset = false) => {
      if (!isLoggedIn || !accessToken || collectionsRequestRef.current) {
        return;
      }

      try {
        collectionsRequestRef.current = true;

        setCollectionsState((prev) => ({
          ...prev,
          loading: true,
          error: null,
        }));

        const [myCollectionsResponse, markedCollectionsResponse] =
          await Promise.all([
            fetchMyCollections(accessToken, 0, 100),
            fetchMyMarkedCollections(accessToken),
          ]);

        if (myCollectionsResponse?.collections) {
          const markedCollectionIds =
            markedCollectionsResponse.data?.collections?.map(
              (c: Collection) => c.collectionId,
            ) || [];

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
      } finally {
        collectionsRequestRef.current = false;
      }
    },
    [isLoggedIn, accessToken],
  );

  // 저장한 컬렉션 fetch 함수 최적화
  const fetchMyMarkedCollectionsData = useCallback(async () => {
    if (!isLoggedIn || !accessToken || markedCollectionsRequestRef.current) {
      return;
    }

    try {
      markedCollectionsRequestRef.current = true;

      setMarkedCollectionsState((prev) => ({
        ...prev,
        loading: true,
        error: null,
      }));

      const response = await fetchMyMarkedCollections(accessToken);

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
    } finally {
      markedCollectionsRequestRef.current = false;
    }
  }, [isLoggedIn, accessToken]);

  // 로그인 필요 액션 핸들러 최적화
  const handleAuthRequiredAction = useCallback(
    (action: () => void) => {
      if (!accessToken || !isLoggedIn) {
        message.error("로그인이 필요한 기능입니다.");
        navigate("/login");
        return;
      }
      action();
    },
    [accessToken, isLoggedIn, message, navigate],
  );

  // 리뷰 모달 관련 핸들러들
  const openEditModal = useCallback((review: ReviewCardData) => {
    setReviewModalState({
      isOpen: true,
      isWriting: false,
      editingData: review,
    });
  }, []);

  const closeReviewModal = useCallback(() => {
    setReviewModalState({
      isOpen: false,
      isWriting: true,
      editingData: null,
    });
  }, []);

  const handleReviewUpdateSuccess = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: ["reviews"],
    });
    queryClient.invalidateQueries({
      queryKey: ["myReview"],
    });

    fetchMonthlyReviews(currentMonth);
    closeReviewModal();
  }, [queryClient, currentMonth, fetchMonthlyReviews, closeReviewModal]);

  // 리뷰 액션 핸들러들 최적화
  const handleLikeToggle = useCallback(
    (reviewId: number, contentId: number, contentType: string) => {
      handleAuthRequiredAction(() => {
        setReviewContext({ contentId, contentType });

        // 컨텍스트 업데이트 후 API 호출
        setTimeout(() => {
          toggleLikeReaction(
            { reviewId, token: accessToken },
            {
              onSuccess: () => {
                message.success("좋아요가 처리되었습니다.");
                fetchMonthlyReviews(currentMonth);
              },
              onError: () => {
                message.error("좋아요 처리에 실패했습니다.");
              },
            },
          );
        }, 50); // 딜레이 단축
      });
    },
    [
      handleAuthRequiredAction,
      toggleLikeReaction,
      accessToken,
      message,
      fetchMonthlyReviews,
      currentMonth,
    ],
  );

  const handleReport = useCallback(
    (reviewId: number, contentId: number, contentType: string) => {
      handleAuthRequiredAction(() => {
        setReviewContext({ contentId, contentType });

        const form = reportForm;
        form.resetFields();

        modal.confirm({
          title: "리뷰 신고하기",
          content: (
            <Form form={form} layout="vertical" className="mr-6 mt-4">
              <Form.Item
                name="declarationType"
                label="신고 유형"
                rules={[
                  { required: true, message: "신고 유형을 선택해주세요" },
                ]}
              >
                <Select
                  placeholder="신고 유형을 선택해주세요"
                  loading={isDeclarationTypesLoading}
                >
                  {declarationTypes?.map((type) => (
                    <Select.Option key={type.code} value={type.code}>
                      {type.description}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Form>
          ),
          okText: "신고",
          cancelText: "취소",
          okButtonProps: { loading: isReporting },
          onOk: async () => {
            try {
              const values = await form.validateFields();
              reportReview(
                {
                  reviewId,
                  body: {
                    declarationType: String(values.declarationType),
                    content: "",
                  },
                  token: accessToken,
                },
                {
                  onSuccess: () => {
                    message.success("신고가 접수되었습니다.");
                  },
                  onError: (error: any) => {
                    message.error(
                      error.message || "신고 처리 중 오류가 발생했습니다.",
                    );
                  },
                },
              );
            } catch (error) {
              console.error("신고 폼 검증 또는 제출 실패:", error);
              return Promise.reject(error);
            }
          },
        });
      });
    },
    [
      handleAuthRequiredAction,
      reportForm,
      modal,
      isDeclarationTypesLoading,
      declarationTypes,
      isReporting,
      reportReview,
      accessToken,
      message,
    ],
  );

  const handleEdit = useCallback(
    (review: ReviewCardData) => {
      handleAuthRequiredAction(() => {
        openEditModal(review);
      });
    },
    [handleAuthRequiredAction, openEditModal],
  );

  const handleDelete = useCallback(
    (reviewId: number, contentId: number, contentType: string) => {
      handleAuthRequiredAction(() => {
        setReviewContext({ contentId, contentType });

        modal.confirm({
          title: "리뷰 삭제",
          content: "정말로 리뷰를 삭제하시겠습니까?",
          okText: "삭제",
          cancelText: "취소",
          okButtonProps: { loading: isDeleting },
          async onOk() {
            deleteReview(
              {
                reviewId,
                token: accessToken,
              },
              {
                onSuccess: () => {
                  message.success("리뷰가 삭제되었습니다.");
                  fetchMonthlyReviews(currentMonth);
                },
                onError: (error) => {
                  console.error("리뷰 삭제 API 에러:", error);
                  message.error("리뷰 삭제에 실패했습니다.");
                },
              },
            );
          },
        });
      });
    },
    [
      handleAuthRequiredAction,
      modal,
      isDeleting,
      deleteReview,
      accessToken,
      message,
      fetchMonthlyReviews,
      currentMonth,
    ],
  );

  // 저장 토글 핸들러 최적화 - 양방향 상태 업데이트 + saveCount 반영
  const handleSaveToggle = useCallback(
    (collectionId: number) => {
      if (!user.isLoggedIn) {
        message.warning("로그인이 필요한 기능입니다.");
        return;
      }

      // 현재 컬렉션 정보 찾기
      const currentCollection =
        collectionsState.collections.find(
          (c) => c.collectionId === collectionId,
        ) ||
        markedCollectionsState.collections.find(
          (c) => c.collectionId === collectionId,
        );

      if (!currentCollection) return;

      const isCurrentlyMarked = currentCollection.isMarked;
      const countChange = isCurrentlyMarked ? -1 : 1; // 저장하면 +1, 해제하면 -1

      toggleMark({
        collectionId: String(collectionId),
        accessToken: accessToken,
      });

      // "내가 만든 컬렉션"에서 isMarked 상태 토글 + saveCount 업데이트
      setCollectionsState((prev) => ({
        ...prev,
        collections: prev.collections.map((collection) =>
          collection.collectionId === collectionId
            ? {
                ...collection,
                isMarked: !collection.isMarked,
                saveCount: Math.max(0, collection.saveCount + countChange), // 0 이하로 내려가지 않도록
              }
            : collection,
        ),
      }));

      // "내가 저장한 컬렉션" 목록 업데이트
      if (isCurrentlyMarked) {
        // 저장 해제: 저장한 컬렉션 목록에서 제거
        setMarkedCollectionsState((prev) => ({
          ...prev,
          collections: prev.collections.filter(
            (collection) => collection.collectionId !== collectionId,
          ),
        }));
      } else {
        // 저장 추가: 저장한 컬렉션 목록에 추가 (saveCount도 업데이트된 상태로)
        setMarkedCollectionsState((prev) => ({
          ...prev,
          collections: [
            ...prev.collections,
            {
              ...currentCollection,
              isMarked: true,
              saveCount: Math.max(0, currentCollection.saveCount + countChange),
            },
          ],
        }));
      }
    },
    [
      user.isLoggedIn,
      accessToken,
      toggleMark,
      message,
      collectionsState.collections,
      markedCollectionsState.collections,
    ],
  );

  // Swiper 핸들러들 최적화
  const handleSwiperInit = useCallback((swiper: SwiperType) => {
    setSwiperState({
      instance: swiper,
      isBeginning: swiper.isBeginning,
      isEnd: swiper.isEnd,
    });
  }, []);

  const handleSlideChange = useCallback((swiper: SwiperType) => {
    setSwiperState((prev) => ({
      ...prev,
      isBeginning: swiper.isBeginning,
      isEnd: swiper.isEnd,
    }));
  }, []);

  // Movie to ReviewCardData 변환 함수 최적화
  const convertMovieToReviewCardData = useCallback(
    (movie: Movie): ReviewCardData => {
      return {
        reviewId: movie.reviewId,
        contentId: movie.contentId,
        contentType: movie.contentType,
        contentTitle: movie.title,
        authorNickname: user.nickname || "익명",
        score: movie.score,
        reviewText: movie.reviewText,
        status: "COMMON",
        likeCount: movie.likeCount || 0,
        isLiked: movie.isLiked || false,
        isOwnReview: true,
        hasAlreadyReported: false,
        posterPath: movie.poster,
        reviewDate: movie.date,
      };
    },
    [user.nickname],
  );

  // 렌더링 함수들 최적화
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

  // 이벤트 핸들러들
  const handleTabChange = useCallback((index: number) => {
    setActiveTab(index);
  }, []);

  const handleMonthChange = useCallback(
    (activeStartDate: Date | null) => {
      if (activeStartDate) {
        const newMonth = formatMonthForApi(activeStartDate);
        if (newMonth !== currentMonth) {
          setCurrentMonth(newMonth);
          fetchMonthlyReviews(newMonth);
        }
      }
    },
    [currentMonth, fetchMonthlyReviews],
  );

  const handleCreateCollection = useCallback(() => {
    navigate("/collections/create");
  }, [navigate]);

  // 초기 데이터 로딩 - 한 번만 실행
  useEffect(() => {
    if (!isInitializedRef.current && isLoggedIn) {
      fetchMonthlyReviews(currentMonth);
      isInitializedRef.current = true;
    }
  }, [isLoggedIn, currentMonth, fetchMonthlyReviews]);

  // 컬렉션 탭 활성화 시 데이터 로딩 - 조건 최적화
  useEffect(() => {
    if (
      activeTab === 1 &&
      isLoggedIn &&
      collectionsState.collections.length === 0 &&
      !collectionsState.loading &&
      !collectionsRequestRef.current &&
      !markedCollectionsRequestRef.current
    ) {
      const timer = setTimeout(() => {
        fetchMyCollectionsData(true);
        fetchMyMarkedCollectionsData();
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [
    activeTab,
    isLoggedIn,
    collectionsState.collections.length,
    collectionsState.loading,
    fetchMyCollectionsData,
    fetchMyMarkedCollectionsData,
  ]);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      collectionsRequestRef.current = false;
      markedCollectionsRequestRef.current = false;
    };
  }, []);

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
                    swiper={swiperState.instance}
                    isBeginning={swiperState.isBeginning}
                    isEnd={swiperState.isEnd}
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
                            {...convertMovieToReviewCardData(movie)}
                            onLikeClick={() =>
                              handleLikeToggle(
                                movie.reviewId,
                                movie.contentId,
                                movie.contentType,
                              )
                            }
                            onReport={() =>
                              handleReport(
                                movie.reviewId,
                                movie.contentId,
                                movie.contentType,
                              )
                            }
                            onEdit={() =>
                              handleEdit(convertMovieToReviewCardData(movie))
                            }
                            onDelete={() =>
                              handleDelete(
                                movie.reviewId,
                                movie.contentId,
                                movie.contentType,
                              )
                            }
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
                    swiper={swiperState.instance}
                    isBeginning={swiperState.isBeginning}
                    isEnd={swiperState.isEnd}
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
                                isSaved={collection.isMarked || false}
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
                    swiper={swiperState.instance}
                    isBeginning={swiperState.isBeginning}
                    isEnd={swiperState.isEnd}
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
                                  isSaved={collection.isMarked || true}
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

      {/* 리뷰 모달 추가 */}
      {reviewModalState.isOpen && reviewModalState.editingData && (
        <ReviewModal
          isModalOpen={reviewModalState.isOpen}
          setIsModalOpen={closeReviewModal}
          isWriting={reviewModalState.isWriting}
          isAuthor={true}
          contentId={reviewModalState.editingData.contentId}
          contentType={reviewModalState.editingData.contentType}
          contentsTitle={reviewModalState.editingData.contentTitle}
          contentsImg={reviewModalState.editingData.posterPath || ""}
          popcorn={reviewModalState.editingData.score}
          reviewDetail={reviewModalState.editingData.reviewText}
          author={reviewModalState.editingData.authorNickname}
          token={accessToken}
          reviewId={reviewModalState.editingData.reviewId}
          onUpdateSuccess={handleReviewUpdateSuccess}
        />
      )}
    </div>
  );
};

export default PageContents;
