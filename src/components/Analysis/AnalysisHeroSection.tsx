const AnalysisHeroSection = () => {
  return (
    <div>
      <div className="relative h-[300px] overflow-hidden xl:h-[650px]">
        <div
          className="bg-footerBlue absolute inset-0"
          style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 85%)" }} //왼쪽 상단을 기준으로(x,y), 오른쪽 상단(x,y), 오른쪽 하단, 왼쪽 하단
        ></div>

        {/* 컨텐츠 */}
        <div className="relative mx-auto h-full w-full">
          {/* 메인 텍스트 */}
          <div className="absolute left-1/2 top-32 -translate-x-1/2 transform">
            <h1 className="gmarket-medium text-4xl text-white">
              POPCO가 알려주는 나의 OTT 취향은?
            </h1>
          </div>

          {/* 캐릭터 이미지 및 텍스트 */}
          <div className="flex justify-center pt-56">
            <div className="flex flex-col pt-4">
              <span className="bg-popco-main gmarket-medium mb-2 px-2">
                심장 쫄깃한 전개와 스케일 없는 세계관 없이는 못참아!
              </span>
              <img
                src="/images/persona/Persona-text-line.svg"
                alt="텍스트 라인"
              />
            </div>
            <div className="flex justify-center">
              <img
                src="/images/persona/애기액션헌터.png"
                alt="캐릭터이미지"
                className="h-[350px] w-[350px] object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisHeroSection;
