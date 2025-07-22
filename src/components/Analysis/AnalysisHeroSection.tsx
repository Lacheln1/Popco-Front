const AnalysisHeroSection = () => {
  return (
    <div>
      <div className="relative h-[300px] overflow-hidden xl:h-[650px]">
        <div
          className="bg-footerBlue absolute inset-0"
          style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 85%)" }} //왼쪽 상단을 기준으로(x,y), 오른쪽 상단(x,y), 오른쪽 하단, 왼쪽 하단
        >
          asdf
        </div>
      </div>
    </div>
  );
};

export default AnalysisHeroSection;
