import React, { useEffect, useState } from "react";
import AgeChart from "./AgeChart";
import GenderChart from "./GenderChart";
import {
  getMovieRecommendations,
  getTvRecommendations,
} from "@/apis/contentsApi";
import { motion } from "framer-motion";
import {
  pageVariants,
  headerVariants,
  itemVariants,
  formVariants,
} from "@/components/LoginResgisterPage/Animation";
import Spinner from "../common/Spinner";

interface RoleDashBoardProps {
  genderPercent: number[];
  agePercent: number[];
  userId?: number;
  personaName?: string;
}

interface RecommendationItem {
  contentId: number;
  title: string;
  genres: string[];
  type: string;
  poster_path: string;
  predicted_rating: number;
  persona_genre_match: boolean | null;
}

// 로딩 스피너 컴포넌트
const LoadingSpinner = () => (
  <div className="flex items-center justify-center space-x-2">
    <span className="text-gray-600">
      <Spinner />
      가져오는 중...
    </span>
  </div>
);

// 로딩 중 섹션 컴포넌트
const LoadingSection: React.FC<{ title: string }> = ({ title }) => (
  <div className="flex flex-col items-center justify-center sm:mt-2 lg:mt-4">
    <span className="sm:text-3xl lg:text-4xl">{title}</span>
    <div className="mt-2 flex min-h-[200px] w-40 items-center justify-center rounded-xl bg-white sm:mt-4 sm:w-64 lg:w-80">
      <LoadingSpinner />
    </div>
  </div>
);

const RoleDashBoard: React.FC<RoleDashBoardProps> = ({
  genderPercent,
  agePercent,
  userId,
  personaName,
}) => {
  const [movieData, setMovieData] = useState<RecommendationItem[]>([]);
  const [seriesData, setSeriesData] = useState<RecommendationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 기본값 (API 실패시 또는 userId가 없을 때)
  const defaultMovieList: RecommendationItem[] = [
    {
      contentId: 0,
      title: "견우와직녀",
      genres: ["로맨스"],
      type: "movie",
      poster_path: "/images/testMovie.svg",
      predicted_rating: 4,
      persona_genre_match: null,
    },
    {
      contentId: 1,
      title: "견우와직녀",
      genres: ["로맨스"],
      type: "movie",
      poster_path: "/images/testMovie.svg",
      predicted_rating: 4,
      persona_genre_match: null,
    },
    {
      contentId: 2,
      title: "견우와직녀",
      genres: ["로맨스"],
      type: "movie",
      poster_path: "/images/testMovie.svg",
      predicted_rating: 4,
      persona_genre_match: null,
    },
    {
      contentId: 3,
      title: "견우와직녀",
      genres: ["로맨스"],
      type: "movie",
      poster_path: "/images/testMovie.svg",
      predicted_rating: 4,
      persona_genre_match: null,
    },
  ];

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!userId) {
        setMovieData(defaultMovieList);
        setSeriesData(defaultMovieList);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // 영화와 TV 시리즈 추천을 동시에 요청
        const [movieResponse, tvResponse] = await Promise.all([
          getMovieRecommendations(userId),
          getTvRecommendations(userId),
        ]);

        // 상위 5개만 사용 (UI에 맞춤)
        setMovieData(movieResponse.recommendations.slice(0, 5));
        setSeriesData(tvResponse.recommendations.slice(0, 5));
      } catch (error) {
        console.error("추천 데이터 가져오기 실패:", error);
        setError("추천 데이터를 불러오는데 실패했습니다.");
        // 에러 발생시 기본 데이터 사용
        setMovieData(defaultMovieList);
        setSeriesData(defaultMovieList);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [userId]);

  // 포스터 이미지 URL 생성 함수 (TMDB 이미지 URL 형식)
  const getPosterUrl = (posterPath: string) => {
    if (posterPath.startsWith("/images/")) {
      // 로컬 이미지인 경우
      return posterPath;
    }
    // TMDB 이미지인 경우
    return `https://image.tmdb.org/t/p/w200${posterPath}`;
  };

  return (
    <motion.div
      className="flex flex-col items-center px-3 md:px-8"
      variants={pageVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <motion.div
        className="bg-footerBlue mt-10 flex w-full max-w-[1200px] flex-col overflow-hidden rounded-tl-3xl rounded-tr-3xl py-5 pt-4 text-center"
        variants={headerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="gmarket-medium pt-2 text-xl text-white md:text-3xl">
          <span>나와 같은&nbsp;</span>
          <span className="gmarket-bold">{personaName}</span>
          <span>&nbsp;들은?</span>
        </div>
      </motion.div>

      <motion.div
        className="pretendard flex w-full max-w-[1200px] flex-col items-center bg-slate-50 py-10"
        style={{ boxShadow: "0 0px 10px rgba(0, 0, 0, 0.1)" }}
        variants={formVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.div
          className="flex flex-col gap-8 pt-5 sm:flex-row sm:items-center sm:gap-20"
          variants={formVariants}
        >
          <motion.div
            className="flex flex-col items-center text-center"
            variants={itemVariants}
          >
            <span className="text-base md:text-2xl">성별</span>
            <GenderChart genderPercent={genderPercent} />
          </motion.div>

          <motion.div
            className="flex flex-col items-center text-center"
            variants={itemVariants}
          >
            <span className="text-base md:text-2xl">연령대</span>
            <AgeChart agePercent={agePercent} />
          </motion.div>
        </motion.div>

        {error && !loading && (
          <motion.div
            className="mt-4 text-center text-red-500"
            variants={itemVariants}
          >
            <span>{error}</span>
          </motion.div>
        )}

        <motion.div
          className="mt-14 flex w-full max-w-[1200px] justify-center gap-3 text-center sm:gap-20 lg:gap-24"
          variants={formVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {loading ? (
            <LoadingSection title="선호영화" />
          ) : (
            <motion.div
              className="flex flex-col items-center justify-center sm:mt-2 lg:mt-4"
              variants={itemVariants}
            >
              <span className="text-base md:text-2xl">선호영화</span>
              <div className="mt-2 rounded-xl bg-white px-4 sm:mt-4 lg:px-7">
                {movieData.map((movie, index) => (
                  <div
                    key={movie.contentId}
                    className="flex w-40 items-center justify-start gap-1 py-2 text-center text-base sm:w-64 sm:py-4 sm:text-2xl lg:w-80 lg:gap-3 lg:text-2xl"
                  >
                    <span className="gmarket-bold">{index + 1}</span>
                    <img
                      src={getPosterUrl(movie.poster_path)}
                      alt={movie.title}
                      className="w-6 object-contain lg:w-10"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "/images/testMovie.svg";
                      }}
                    />
                    <span className="truncate">{movie.title}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {loading ? (
            <LoadingSection title="선호 시리즈" />
          ) : (
            <motion.div
              className="flex flex-col items-center justify-center sm:mt-2 lg:mt-4"
              variants={itemVariants}
            >
              <span className="text-base md:text-2xl">선호 시리즈</span>
              <div className="mt-2 rounded-xl bg-white px-4 sm:mt-4 lg:px-7">
                {seriesData.map((series, index) => (
                  <div
                    key={series.contentId}
                    className="flex w-40 items-center justify-start gap-1 py-2 text-center text-base sm:w-64 sm:py-4 sm:text-2xl lg:w-80 lg:gap-3 lg:text-2xl"
                  >
                    <span className="gmarket-bold">{index + 1}</span>
                    <img
                      src={getPosterUrl(series.poster_path)}
                      alt={series.title}
                      className="w-6 object-contain lg:w-10"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "/images/testMovie.svg";
                      }}
                    />
                    <span className="truncate">{series.title}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default RoleDashBoard;
