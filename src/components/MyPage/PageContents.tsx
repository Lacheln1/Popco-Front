import React, { useState, useEffect } from "react";
import MovieCalendar from "./MovieCalendar";
import ReviewCard from "../common/ReviewCard";
import useAuthCheck from "@/hooks/useAuthCheck";
import { getMonthlyReviews } from "@/apis/userApi";

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

const PageContents: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentMonth, setCurrentMonth] = useState<string>("");

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

  // Movie 데이터를 ReviewCard가 요구하는 ReviewData 형태로 변환
  const convertToReviewData = (movie: Movie): ReviewData => {
    return {
      movieTitle: movie.title || "제목 없음",
      score: movie.score || 0,
      reviewText: movie.reviewText || "리뷰 내용이 없습니다",
      nickname: user.nickname || "익명",
      likeCount: 0, // API에 좋아요 수가 없으므로 기본값
      isSpoiler: false, // API에 스포일러 정보가 없으므로 기본값
      isOwnReview: true, // 내 리뷰이므로 true
      isLiked: false, // 내 리뷰이므로 좋아요 불가
      hasAlreadyReported: false,
    };
  };

  // 컴포넌트 마운트 시 및 로그인 상태 변경 시 현재 월 데이터 가져오기
  useEffect(() => {
    const initialMonth = formatMonthForApi(new Date());
    setCurrentMonth(initialMonth);
    fetchMonthlyReviews(initialMonth);
  }, [accessToken, user.isLoggedIn]);

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

              {/* 리뷰 카드들을 그리드로 표시 */}
              <div className="mt-6">
                <h2 className="mb-4 text-lg font-semibold">
                  이번 달 내 리뷰 ({movies.length}개)
                </h2>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                  {movies.map((movie) => (
                    <ReviewCard
                      key={movie.reviewId}
                      reviewData={convertToReviewData(movie)}
                      contentId={movie.contentId}
                      contentType={movie.contentType}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 1 && (
            <div>
              <h3 className="mb-4 text-lg font-semibold">제목2</h3>
              <p className="mb-2">두 번째 탭 내용 1</p>
              <p className="mb-2">두 번째 탭 내용 2</p>
              <p className="mb-2">두 번째 탭 내용 3</p>
              <p className="mb-2">두 번째 탭 내용 4</p>
              <p className="mb-2">두 번째 탭 내용 5</p>
            </div>
          )}

          {activeTab === 2 && (
            <div>
              <h3 className="mb-4 text-lg font-semibold">제목3</h3>
              <p className="mb-2">세 번째 탭 내용 1</p>
              <p className="mb-2">세 번째 탭 내용 2</p>
              <p className="mb-2">세 번째 탭 내용 3</p>
              <p className="mb-2">세 번째 탭 내용 4</p>
              <p className="mb-2">세 번째 탭 내용 5</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageContents;
