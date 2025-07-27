import React from "react";
import AverageDoubleDonutChart from "./AverageDoubleDonutChart";

const MyWatchingStyleBoard: React.FC = () => {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-footerBlue mt-10 flex w-full max-w-[1200px] flex-col overflow-hidden rounded-tl-3xl rounded-tr-3xl py-5 text-center">
        <div className="gmarket-medium sm: text-3xl text-white">
          <span>나의 시청 스타일이 궁금해?</span>
        </div>
      </div>
      <div
        className="pretendard flex w-full max-w-[1200px] flex-col items-center bg-slate-50 py-10"
        style={{ boxShadow: "0 0px 10px rgba(0, 0, 0, 0.1)" }}
      >
        <div className="flex">
          <div className="flex flex-col items-center">
            <span>평균 별점</span>
            <div>
              <AverageDoubleDonutChart />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyWatchingStyleBoard;
