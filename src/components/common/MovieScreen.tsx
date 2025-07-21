import React from "react";

interface MovieScreenProps {
  children: React.ReactNode;
}

const MovieScreen: React.FC<MovieScreenProps> = ({ children }) => {
  //오목한 모양을 정의
  const ScreenClipPath = () => (
    <svg width="0" height="0" style={{ position: "absolute" }}>
      <defs>
        <clipPath id="concaveScreenShape" clipPathUnits="objectBoundingBox">
          <path d="M 0,0 C 0.35,0.05 0.65,0.05 1,0 L 1,1 C 0.65,0.95 0.35,0.95 0,1 Z" />
        </clipPath>
      </defs>
    </svg>
  );

  return (
    <>
      <ScreenClipPath />

      <div
        className="relative h-[60vh] w-full rounded-lg bg-white/80 shadow-2xl shadow-blue-500/10 lg:h-[640px] lg:w-[1200px] lg:[clip-path:url(#concaveScreenShape)]" 
      >
        {/* 조명 효과 스크린내부로 줌. 외부로 주면 이상하게 깨져보임 */}
        <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.5)_0%,rgba(255,255,255,0)_70%)]"></div>

        <div className="relative z-20 h-full w-full overflow-y-auto p-8 text-black lg:p-12">
          {children}
        </div>
      </div>
    </>
  );
};

export default MovieScreen;
