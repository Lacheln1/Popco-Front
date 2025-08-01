import React from "react";
import AverageDoubleDonutChart from "./AverageDoubleDonutChart";

interface MyWatchingStyleBoardProps {
  ratingPercent: number[];
  eventPercent: number[];
  eventCount: number;
  reviewPercent: number[];
  myLikePercent: number[];
}

const MyWatchingStyleBoard: React.FC<MyWatchingStyleBoardProps> = ({
  ratingPercent,
  eventPercent,
  eventCount,
  reviewPercent,
  myLikePercent,
}) => {
  return (
    <div className="flex flex-col items-center px-3 md:px-8">
      <div className="bg-footerBlue mt-10 flex w-full max-w-[1200px] flex-col overflow-hidden rounded-tl-3xl rounded-tr-3xl py-5 text-center">
        <div className="gmarket-medium text-xl text-white md:text-3xl">
          <span>나의 시청 스타일이 궁금해?</span>
        </div>
      </div>
      <div
        className="pretendard flex w-full max-w-[1200px] flex-col items-center bg-slate-50 py-10"
        style={{ boxShadow: "0 0px 10px rgba(0, 0, 0, 0.1)" }}
      >
        <div className="flex sm:gap-10 sm:text-2xl lg:gap-32">
          <div className="flex flex-col items-center">
            <span>평균 별점</span>
            <div>
              <AverageDoubleDonutChart
                customerScore={ratingPercent[0]}
                averageScore={ratingPercent[1]}
                maxScore={5}
              />
            </div>
            <span>{ratingPercent[0]}/5 점</span>
          </div>
          <div className="flex flex-col items-center">
            <span>이벤트 참여 수</span>
            <div>
              <AverageDoubleDonutChart
                customerScore={eventPercent[0]}
                averageScore={eventPercent[1]}
                maxScore={eventCount}
              />
            </div>
            <span>
              {eventPercent[0]}/{eventCount} 회
            </span>
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
        <div className="mt-4 w-full md:w-[700px] lg:w-[900px] xl:w-[1000px]">
          <div className="flex flex-col">
            <div className="mx-3 flex justify-between">
              <div>
                <img
                  src="/images/components/like-popcorn.svg"
                  alt=""
                  className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 lg:h-11 lg:w-11 xl:h-12 xl:w-12"
                />
              </div>
              <div>
                <img
                  src="/images/components/hate-popcorn.svg"
                  alt=""
                  className="h-8 w-8 rotate-90 sm:h-9 sm:w-9 md:h-10 md:w-10 lg:h-11 lg:w-11 xl:h-12 xl:w-12"
                />
              </div>
            </div>
            <div className="mx-3 flex h-6 overflow-hidden rounded-full bg-gray-200 sm:h-7 md:h-8 lg:h-9 xl:h-10">
              <div
                className="relative flex items-center justify-center bg-yellow-400 font-medium text-gray-700"
                style={{ width: "67%" }}
              >
                <span className="text-xs font-bold sm:text-sm md:text-base lg:text-lg xl:text-xl">
                  67%
                </span>
              </div>
              <div
                className="relative flex items-center justify-center bg-yellow-200 font-medium text-gray-700"
                style={{ width: "33%" }}
              >
                <span className="text-xs font-bold sm:text-sm md:text-base lg:text-lg xl:text-xl">
                  33%
                </span>
              </div>
            </div>
            <div className="mx-3 flex justify-between text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl">
              <span>좋아요</span>
              <span>싫어요</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyWatchingStyleBoard;
