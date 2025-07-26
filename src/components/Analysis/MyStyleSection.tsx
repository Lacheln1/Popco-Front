import React from "react";

const MyStyleSection: React.FC = () => {
  return (
    <section className="pretendard flex">
      <div
        className="mx-1 flex w-full flex-col bg-slate-50 py-5 xl:h-80"
        style={{ boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)" }}
      >
        <div className="flex flex-col text-center text-base md:text-2xl">
          <span className="gmarket-medium">내 OTT 시청 스타일은</span>
          <span className="">상위 8.2% 의 #스릴러, 상위 8.3% 의 액션러!</span>
        </div>
        <div className="flex w-full justify-center gap-6 pt-4 md:text-xl">
          <div className="bg-popco-main flex h-8 w-16 items-center justify-center rounded-lg md:w-24">
            #액션
          </div>
          <div className="bg-popco-main flex h-8 w-16 items-center justify-center rounded-lg md:w-24">
            #스릴러
          </div>
          <div className="bg-popco-main flex h-8 w-16 items-center justify-center rounded-lg md:w-24">
            #모험
          </div>
        </div>
        <div className="mt-4 flex justify-center break-keep px-1 text-center">
          <span className="break-keep md:text-xl">
            당신은 숨쉴 틈 없는 전개와 화려한 액션을 즐기며,손에 땀을 쥐는
            긴장감과 거대한 스케일 속에 완전히 빠져드는 스타일이네요!
          </span>
        </div>
      </div>
    </section>
  );
};

export default MyStyleSection;
