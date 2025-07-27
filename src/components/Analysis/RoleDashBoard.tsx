import React from "react";
import GenderChart from "./GenderChart";
import AgeChart from "./AgeChart";

const RoleDashBoard: React.FC = () => {
  const movieList = [
    { rank: 1, title: "견우와직녀", image: "/images/testMovie.svg" },
    { rank: 1, title: "견우와직녀", image: "/images/testMovie.svg" },
    { rank: 1, title: "견우와직녀", image: "/images/testMovie.svg" },
    { rank: 1, title: "견우와직녀", image: "/images/testMovie.svg" },
  ];

  return (
    <div className="flex flex-col items-center">
      <div className="bg-footerBlue mt-10 flex w-full max-w-[1200px] flex-col overflow-hidden rounded-tl-3xl rounded-tr-3xl py-5 text-center">
        <div className="gmarket-medium sm: text-3xl text-white">
          <span>나와 같은&nbsp;</span>
          <span className="gmarket-bold">액션 헌터</span>
          <span>&nbsp;들은?</span>
        </div>
      </div>
      <div
        className="pretendard flex w-full max-w-[1200px] flex-col items-center bg-slate-50 py-10"
        style={{ boxShadow: "0 0px 10px rgba(0, 0, 0, 0.1)" }}
      >
        <div className="flex flex-col gap-8 pt-5 sm:flex-row sm:items-center sm:gap-28">
          <div className="flex flex-col items-center text-center">
            <span className="text-2xl">성별</span>
            <div>
              <GenderChart />
            </div>
          </div>
          <div className="flex flex-col items-center text-center">
            <span className="text-2xl">연령대</span>
            <div>
              <AgeChart />
            </div>
          </div>
        </div>
        <div className="mt-4 flex w-full max-w-[1200px] justify-center gap-3 text-center sm:gap-36 lg:gap-24">
          {/* 선호영화 */}
          <div className="flex flex-col items-center justify-center sm:mt-2 lg:mt-4">
            <span className="sm:text-3xl lg:text-4xl">선호영화</span>
            {/* 컨텐츠 */}
            <div className="mt-2 rounded-xl bg-white sm:mt-4">
              {movieList.map((movie, index) => (
                <div
                  key={index}
                  className="flex w-40 items-center justify-center gap-1 py-2 text-center text-base sm:w-64 sm:py-4 sm:text-2xl lg:w-80 lg:text-3xl"
                >
                  <span className="gmarket-bold">{movie.rank}</span>
                  <img
                    src={movie.image}
                    alt=""
                    className="w-6 object-contain lg:w-10"
                  />
                  <span>{movie.title}</span>
                </div>
              ))}
            </div>
          </div>
          {/* 선호 시리즈 */}
          <div className="flex flex-col items-center justify-center sm:mt-2 lg:mt-4">
            <span className="sm:text-3xl lg:text-4xl">선호 시리즈</span>
            {/* 컨텐츠 */}
            <div className="mt-2 rounded-xl bg-white sm:mt-4">
              {movieList.map((movie, index) => (
                <div
                  key={index}
                  className="flex w-40 items-center justify-center gap-1 py-2 text-center text-base sm:w-64 sm:py-4 sm:text-2xl lg:w-80 lg:text-3xl"
                >
                  <span className="gmarket-bold">{movie.rank}</span>
                  <img
                    src={movie.image}
                    alt=""
                    className="w-6 object-contain lg:w-10"
                  />
                  <span>{movie.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleDashBoard;
