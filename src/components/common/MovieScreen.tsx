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
        className="relative h-[60vh] w-[calc(100%-2rem)] rounded-lg bg-white/80 shadow-2xl shadow-blue-500/10 lg:h-[640px] lg:w-[1200px] lg:[clip-path:url(#concaveScreenShape)]" 
      >
        <div className="h-full w-full overflow-y-auto p-8 text-black lg:p-12">
          {children}
        </div>
      </div>
    </>
  );
};

export default MovieScreen;
