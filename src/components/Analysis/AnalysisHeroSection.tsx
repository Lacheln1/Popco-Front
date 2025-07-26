const AnalysisHeroSection = () => {
  return (
    <div className="pretendard">
      <div className="relative h-[380px] overflow-hidden md:h-[425px] lg:h-[480px]">
        <div
          className="bg-footerBlue absolute inset-0"
          style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 80%)" }} //왼쪽 상단을 기준으로(x,y), 오른쪽 상단(x,y), 오른쪽 하단, 왼쪽 하단
        ></div>

        {/* 컨텐츠 */}
        <div className="relative mx-auto h-full w-full">
          {/* 메인 텍스트 */}
          <div className="absolute left-1/2 top-32 w-60 -translate-x-1/2 transform md:w-full">
            <h1 className="gmarket-medium text-center text-2xl text-white md:text-3xl lg:text-4xl">
              POPCO가 알려주는 나의 OTT 취향은?
            </h1>
          </div>

          {/* 캐릭터 이미지 및 텍스트 */}
          <div className="flex pt-56">
            <div className="mx-auto flex">
              <div className="absolute flex -translate-x-[97px] -translate-y-10 flex-col pt-4 md:-translate-x-60 lg:-translate-x-80 xl:-translate-x-[450px] xl:pt-12">
                <span className="gmarket-medium md:bg-popco-main mb-2 whitespace-nowrap px-1 py-1 text-white md:text-xl md:text-black">
                  심장 쫄깃한 전개와 스케일 없는 세계관 없이는 못참아!
                </span>
                <img
                  src="/images/persona/Persona-text-line.svg"
                  alt="텍스트 라인"
                  className="hidden object-cover md:inline md:w-60 lg:ml-24 xl:ml-56"
                />
              </div>
              <img
                src="/images/persona/애기액션헌터.png"
                alt="캐릭터이미지"
                className="h-[150px] w-[150px] object-cover md:h-[200px] md:w-[200px] md:pt-10 lg:h-[220px] lg:w-[220px]"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="gmarket-medium flex justify-center text-3xl md:mt-8 md:text-4xl lg:mt-0">
        애기 액션 헌터
      </div>

      <div className="flex justify-around">
        <div className="mt-3 flex w-full items-center px-1 md:max-w-[700px] lg:max-w-[1200px]">
          <div>
            <div className="flex justify-center">
              <img
                src="/public/images/persona/애기액션헌터.png"
                alt="액션 헌터"
                className="h-16 w-16"
              />
            </div>
            <span className="text-sm md:text-lg lg:text-xl xl:text-2xl">
              액션 헌터
            </span>
          </div>
          <div className="mx-2 flex h-4 flex-1 overflow-hidden rounded-full bg-gray-200">
            <div className="h-full bg-red-400" style={{ width: "52%" }}></div>
            <div className="h-full bg-blue-400" style={{ width: "48%" }}></div>
          </div>
          <div className="">
            <div className="flex justify-center">
              <img
                src="/public/images/persona/무비셜록-아기.svg"
                alt="온기 수집가"
                className="h-16 w-16"
              />
            </div>
            <span className="text-sm md:text-lg lg:text-xl xl:text-2xl">
              온기 수집가
            </span>
          </div>
        </div>
      </div>
      <div className="flex justify-center">
        <div className="relative -top-5 flex w-full justify-around px-1 md:max-w-[700px] lg:max-w-[1200px]">
          <div className="md:text-lg lg:text-xl xl:text-2xl">52%</div>
          <div className="md:text-lg lg:text-xl xl:text-2xl">48%</div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisHeroSection;
