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
import { App, Form, Select } from "antd";
import Spinner from "../common/Spinner";
import { useNavigate } from "react-router-dom";
import { useToggleMarkCollection } from "@/hooks/useCollections";
import { useQueryClient } from "@tanstack/react-query";
// 리뷰 관련 훅 추가
import {
  useDeleteReview,
  useFetchDeclarationTypes,
  usePostReviewDeclaration,
  useToggleReviewReaction,
} from "@/hooks/useReviews";
// 리뷰 모달 추가
import ReviewModal from "@/components/ReviewModal/ReviewModal";

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
  likeCount?: number; // 좋아요 수 추가
  isLiked?: boolean; // 좋아요 상태 추가
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
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState(0);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentMonth, setCurrentMonth] = useState<string>("");
  const [reportForm] = Form.useForm();

  // API 요청 상태 추적을 위한 ref 추가
  const collectionsRequestRef = useRef(false);
  const markedCollectionsRequestRef = useRef(false);

  // 리뷰 모달 상태 추가
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isWritingReview, setIsWritingReview] = useState(true);
  const [editingReviewData, setEditingReviewData] =
    useState<ReviewCardData | null>(null);

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

  const { message, modal } = App.useApp();
  const navigate = useNavigate();

  const { mutate: toggleMark } = useToggleMarkCollection();

  // 리뷰별 좋아요 상태를 로컬에서 관리 (위치 이동)
  const [likedReviews, setLikedReviews] = useState<Set<number>>(new Set());

  // 리뷰 관련 훅들 추가
  const { data: declarationTypes, isLoading: isDeclarationTypesLoading } =
    useFetchDeclarationTypes();

  // 현재 선택된 리뷰의 contentId와 contentType을 위한 상태
  const [currentReviewContext, setCurrentReviewContext] = useState<{
    contentId: number;
    contentType: string;
  } | null>(null);

  // 각 리뷰별로 독립적인 훅을 사용하지 않고, 동적으로 API 호출하는 방식으로 변경
  const { mutate: deleteReview, isPending: isDeleting } = useDeleteReview(
    currentReviewContext?.contentId || 1, // 0 대신 1 사용 (유효한 기본값)
    currentReviewContext?.contentType || "movie",
  );

  const { mutate: reportReview, isPending: isReporting } =
    usePostReviewDeclaration(
      currentReviewContext?.contentId || 1,
      currentReviewContext?.contentType || "movie",
    );

  // 리뷰 좋아요 토글을 위한 별도의 훅 (기본값으로 초기화)
  const [likeContext, setLikeContext] = useState({
    contentId: 1,
    contentType: "movie",
  });

  const { mutate: toggleLikeReaction } = useToggleReviewReaction(
    likeContext.contentId,
    likeContext.contentType,
    "recent",
  );

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
        console.log("첫 번째 리뷰 데이터 구조:", response.data?.[0]); // 데이터 구조 확인

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
            likeCount: review.likeCount || 0, // API 응답의 likeCount
            isLiked: review.liked || false, // API 응답의 liked 필드 (not isLiked)
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
      // 이미 요청 중이거나 로그인하지 않은 경우 return
      if (!isLoggedIn || collectionsRequestRef.current) {
        return;
      }

      try {
        collectionsRequestRef.current = true; // 요청 시작 표시

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
      } finally {
        collectionsRequestRef.current = false; // 요청 완료 표시
      }
    },
    [isLoggedIn, accessToken], // loading 의존성 제거
  );

  const fetchMyMarkedCollectionsData = useCallback(async () => {
    if (!isLoggedIn || markedCollectionsRequestRef.current) {
      return;
    }

    try {
      markedCollectionsRequestRef.current = true; // 요청 시작 표시

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
    } finally {
      markedCollectionsRequestRef.current = false; // 요청 완료 표시
    }
  }, [isLoggedIn, accessToken]); // loading 의존성 제거

  // 로그인 필요 액션 핸들러
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

  // 리뷰 수정 모달 열기 핸들러
  const handleOpenEditModal = useCallback((review: ReviewCardData) => {
    setIsWritingReview(false);
    setEditingReviewData(review);
    setIsReviewModalOpen(true);
  }, []);

  // 리뷰 등록/수정 성공 콜백
  const handleReviewUpdateSuccess = useCallback(() => {
    // 관련 쿼리 무효화로 최신 데이터 요청
    queryClient.invalidateQueries({
      queryKey: ["reviews"],
    });
    queryClient.invalidateQueries({
      queryKey: ["myReview"],
    });

    // 현재 월의 리뷰 목록을 다시 불러오기
    fetchMonthlyReviews(currentMonth);

    setIsReviewModalOpen(false);
    setEditingReviewData(null);
  }, [queryClient, currentMonth, fetchMonthlyReviews]);

  // 리뷰 좋아요 토글 핸들러
  const handleLikeToggle = useCallback(
    (reviewId: number, contentId: number, contentType: string) => {
      handleAuthRequiredAction(() => {
        // 좋아요용 컨텍스트 업데이트
        setLikeContext({ contentId, contentType });

        // 상태 업데이트 후 API 호출
        setTimeout(() => {
          toggleLikeReaction(
            { reviewId, token: accessToken },
            {
              onSuccess: () => {
                message.success("좋아요가 처리되었습니다.");
                // 현재 월의 리뷰 목록을 다시 불러오기
                fetchMonthlyReviews(currentMonth);
              },
              onError: () => {
                message.error("좋아요 처리에 실패했습니다.");
              },
            },
          );
        }, 100);
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
  // 리뷰 신고 핸들러
  const handleReport = useCallback(
    (reviewId: number, contentId: number, contentType: string) => {
      handleAuthRequiredAction(() => {
        // 현재 리뷰 컨텍스트 설정
        setCurrentReviewContext({ contentId, contentType });

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

  // 리뷰 수정 핸들러 - DetailPage 패턴과 동일하게 수정
  const handleEdit = useCallback(
    (review: ReviewCardData) => {
      handleAuthRequiredAction(() => {
        handleOpenEditModal(review);
      });
    },
    [handleAuthRequiredAction, handleOpenEditModal],
  );

  // 리뷰 삭제 핸들러
  const handleDelete = useCallback(
    (reviewId: number, contentId: number, contentType: string) => {
      handleAuthRequiredAction(() => {
        // 현재 리뷰 컨텍스트 설정
        setCurrentReviewContext({ contentId, contentType });

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
                  // 현재 월의 리뷰 목록을 다시 불러오기
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

  // 저장 토글 핸들러 수정
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

      // API 호출 후 적절한 딜레이를 두고 데이터 새로고침
      // 하지만 무한 요청을 방지하기 위해 ref 체크 추가
      setTimeout(() => {
        if (
          !collectionsRequestRef.current &&
          !markedCollectionsRequestRef.current
        ) {
          fetchMyCollectionsData(true);
          fetchMyMarkedCollectionsData();
        }
      }, 500); // 딜레이를 좀 더 늘림
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
    // 로컬 상태에서 토글된 적이 있는지 확인
    const hasBeenToggled = likedReviews.has(movie.reviewId);
    // 토글된 적이 있으면 원래 상태의 반대, 없으면 서버 상태 그대로
    const currentLikedState = hasBeenToggled
      ? !(movie.isLiked || false)
      : movie.isLiked || false;

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
      isLiked: currentLikedState,
      isOwnReview: true,
      hasAlreadyReported: false,
      posterPath: movie.poster,
      reviewDate: movie.date,
    };
  };

  // 컴포넌트 마운트 시 및 로그인 상태 변경 시 현재 월 데이터 가져오기
  useEffect(() => {
    const initialMonth = formatMonthForApi(new Date());
    setCurrentMonth(initialMonth);
    fetchMonthlyReviews(initialMonth);
  }, [fetchMonthlyReviews]);

  // useEffect 수정 - 더 엄격한 조건 추가
  useEffect(() => {
    // 컬렉션 탭이고, 로그인 상태이며, 컬렉션이 없고, 현재 요청 중이 아닐 때만 실행
    if (
      activeTab === 1 &&
      isLoggedIn &&
      collectionsState.collections.length === 0 &&
      !collectionsRequestRef.current &&
      !markedCollectionsRequestRef.current
    ) {
      // 컴포넌트가 마운트된 후 약간의 딜레이를 두고 요청
      const timer = setTimeout(() => {
        fetchMyCollectionsData(true);
        fetchMyMarkedCollectionsData();
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [
    activeTab,
    isLoggedIn,
    collectionsState.collections.length, // 이 의존성은 유지
    fetchMyCollectionsData,
    fetchMyMarkedCollectionsData,
  ]);

  // 컴포넌트 언마운트 시 요청 상태 정리
  useEffect(() => {
    return () => {
      collectionsRequestRef.current = false;
      markedCollectionsRequestRef.current = false;
    };
  }, []);

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

  const handleTabChange = (index: number) => {
    setActiveTab(index);
  };

  const handleMonthChange = (activeStartDate: Date | null) => {
    if (activeStartDate) {
      const newMonth = formatMonthForApi(activeStartDate);
      if (newMonth !== currentMonth) {
        setCurrentMonth(newMonth);
        fetchMonthlyReviews(newMonth);
      }
    }
  };

  const handleCreateCollection = () => {
    navigate("/collections/create"); // 새 컬렉션 만들기 페이지로 이동
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
                            {...convertMovieToReviewCardData(movie)}
                            // 실제 기능을 가진 핸들러들로 교체
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

      {/* 리뷰 모달 추가 */}
      {isReviewModalOpen && editingReviewData && (
        <ReviewModal
          isModalOpen={isReviewModalOpen}
          setIsModalOpen={setIsReviewModalOpen}
          isWriting={isWritingReview}
          isAuthor={true}
          contentId={editingReviewData.contentId}
          contentType={editingReviewData.contentType}
          contentsTitle={editingReviewData.contentTitle}
          contentsImg={editingReviewData.posterPath || ""}
          popcorn={editingReviewData.score}
          reviewDetail={editingReviewData.reviewText}
          author={editingReviewData.authorNickname}
          token={accessToken}
          reviewId={editingReviewData.reviewId}
          onUpdateSuccess={handleReviewUpdateSuccess}
        />
      )}
    </div>
  );
};

export default PageContents;
