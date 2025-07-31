import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./MovieCalendar.css";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

interface Movie {
  date: string;
  title: string;
  poster: string;
}

interface MovieCalendarProps {
  movies: Movie[];
  loading: boolean;
  currentMonth: string;
  onMonthChange: (activeStartDate: Date | null) => void;
}

const MovieCalendar: React.FC<MovieCalendarProps> = ({
  movies,
  loading,
  onMonthChange,
}) => {
  const [value, onChange] = useState<Value>(new Date());

  // 달력에서 월이 변경될 때마다 부모 컴포넌트에 알림
  const handleActiveStartDateChange = ({
    activeStartDate,
  }: {
    activeStartDate: Date | null;
  }) => {
    onMonthChange(activeStartDate);
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
        calendarType="gregory"
      />
    </div>
  );
};

export default MovieCalendar;
