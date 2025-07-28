import React from "react";
import AverageDoubleDonutChart from "./AverageDoubleDonutChart";

const MyWatchingStyleBoard: React.FC = () => {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-footerBlue mt-10 flex w-full max-w-[1200px] flex-col overflow-hidden rounded-tl-3xl rounded-tr-3xl py-5 text-center">
        <div className="gmarket-medium text-xl text-white md:text-3xl">
          <span>나의 시청 스타일이 궁금해?</span>
        </div>
      </div>
      <div
        className="pretendard flex w-full max-w-[1200px] flex-col items-center bg-slate-50 py-10"
        style={{ boxShadow: "0 0px 10px rgba(0, 0, 0, 0.1)" }}
      >
        <div className="flex md:text-2xl">
          <div className="flex flex-col items-center">
            <span>평균 별점</span>
            <div>
              <AverageDoubleDonutChart
                customerScore={3}
                averageScore={5}
                maxScore={10}
              />
            </div>
            <span>3점</span>
          </div>
          <div className="flex flex-col items-center">
            <span>이벤트 참여 수</span>
            <div>
              <AverageDoubleDonutChart
                customerScore={3}
                averageScore={5}
                maxScore={10}
              />
            </div>
            <span>4회</span>
          </div>
          <div className="flex flex-col items-center">
            <span>이번달 시청 컨텐츠</span>
            <div>
              <AverageDoubleDonutChart
                customerScore={3}
                averageScore={5}
                maxScore={10}
              />
              <div className="flex justify-center">
                <span>4회</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-[#FD6B94]"></div>
                <span>액션 헌터 평균</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-[#3BA8F0]"></div>
                <span>고객님</span>
              </div>
            </div>
          </div>
        </div>
        <div className="relative mx-2 mt-4 w-full max-w-[1200px] md:text-2xl">
          <div className="mx-3 flex justify-between">
            <div>
              <img
                src="/images/components/like-popcorn.svg"
                alt=""
                className="h-10 w-10 md:h-12 md:w-12"
              />
            </div>
            <div>
              <img
                src="/images/components/hate-popcorn.svg"
                alt=""
                className="h-10 w-10 rotate-90 md:h-12 md:w-12"
              />
            </div>
          </div>
          <div className="mx-3 flex overflow-hidden rounded-full bg-gray-200 md:h-8">
            <div
              className="relative flex items-center justify-center bg-yellow-400 font-medium text-gray-700"
              style={{ width: "67%" }}
            >
              <span className="text-sm font-bold">67%</span>
            </div>
            <div
              className="relative flex items-center justify-center bg-yellow-200 font-medium text-gray-700"
              style={{ width: "33%" }}
            >
              <span className="text-sm font-bold">33%</span>
            </div>
          </div>
          <div className="mx-3 flex justify-between">
            <span>좋아요</span>
            <span>싫어요</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyWatchingStyleBoard;
