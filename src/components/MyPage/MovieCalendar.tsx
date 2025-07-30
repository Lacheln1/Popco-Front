import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./MovieCalendar.css";
import useAuthCheck from "@/hooks/useAuthCheck";
import { getMonthlyReviews } from "@/apis/userApi";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

interface Movie {
  date: string;
  title: string;
  poster: string;
}

// 간단한 달력 컴포넌트
const MovieCalendar: React.FC = () => {
  const [value, onChange] = useState<Value>(new Date());
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentMonth, setCurrentMonth] = useState<string>("");

  const { accessToken, user } = useAuthCheck();

  //YYYY-MM 형식으로 변환하기
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
          date: review.createdAt.split("T")[0], // 2025-07-30T02:34:05.047Z → 2025-07-30
          title: review.title,
          poster: review.posterPath,
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

  //컴포넌트 마운트 시 및 로그인 상태 변경 시 현재 월 데이터 가져오기
  useEffect(() => {
    const initialMonth = formatMonthForApi(new Date());
    setCurrentMonth(initialMonth);
    fetchMonthlyReviews(initialMonth);
  }, [accessToken, user.isLoggedIn]);

  //달력에서 월이 변경될 때마다 새로운 데이터 가져오기
  const handleActiveStartDateChange = ({
    activeStartDate,
  }: {
    activeStartDate: Date | null;
  }) => {
    if (activeStartDate) {
      const newMonth = formatMonthForApi(activeStartDate);
      if (newMonth !== currentMonth) {
        setCurrentMonth(newMonth);
        fetchMonthlyReviews(newMonth);
      }
    }
  };

  // 특정 날짜의 영화 찾기
  const getMovieForDate = (date: Date): Movie | undefined => {
    const dateString = date.toISOString().split("T")[0];
    return movies.find((movie) => movie.date === dateString);
  };

  // 각 날짜 타일에 표시할 내용
  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view !== "month") return null;

    const movie = getMovieForDate(date);
    if (movie) {
      return (
        <div className="mt-1 flex flex-col items-center">
          <img
            src={`https://image.tmdb.org/t/p/original${movie.poster}`}
            alt={movie.title}
            className="h-12 w-8 rounded object-cover shadow-sm"
            onError={(e) => {
              // 이미지 로드 실패시 대체 이미지 또는 숨김 처리
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
          <p className="mt-1 max-w-full truncate text-xs text-gray-700">
            {movie.title}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full">
      {loading && (
        <div className="mb-4 text-center text-sm text-gray-500">
          Loading reviews...
        </div>
      )}

      <Calendar
        onChange={onChange}
        value={value}
        tileContent={tileContent}
        locale="ko-KR"
        className="w-full border-none shadow-none"
        onActiveStartDateChange={handleActiveStartDateChange}
      />

      {/* 현재 로드된 월 정보 표시 (개발용) */}
      <div className="mt-4 text-xs text-gray-400">
        현재 로드된 월: {currentMonth} ({movies.length}개 리뷰)
      </div>
    </div>
  );
};

export default MovieCalendar;
