import { useEffect, useRef, useState } from "react";

const IntroPage = () => {
  const text1Ref = useRef<HTMLSpanElement | null>(null);
  const text2Ref = useRef<HTMLSpanElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const redirectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 페이드아웃 상태 추가
  const [isTransitioning, setIsTransitioning] = useState(false);

  const texts = [
    "내일은",
    "뭐보지?",
    "시간 아까울까봐",
    "고민하게 되는 그 순간",
    "당신의 취향에 딱!",
    "POPCO",
  ];

  const textIndexRef = useRef<number>(texts.length - 1);
  const morphTime = 0.7;
  const cooldownTime = 1.0;

  const morphRef = useRef<number>(0);
  const cooldownRef = useRef<number>(cooldownTime);
  const timeRef = useRef<Date>(new Date());

  const doMorph = () => {
    morphRef.current -= cooldownRef.current;
    cooldownRef.current = 0;

    let fraction = morphRef.current / morphTime;

    if (fraction > 1) {
      cooldownRef.current = cooldownTime;
      fraction = 1;
    }
    setMorph(fraction);
  };

  const setMorph = (fraction: number) => {
    const text1 = text1Ref.current;
    const text2 = text2Ref.current;

    if (!text1 || !text2) return;

    text2.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
    text2.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;

    fraction = 1 - fraction;
    text1.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
    text1.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;

    const currentText = texts[textIndexRef.current % texts.length];
    const nextText = texts[(textIndexRef.current + 1) % texts.length];

    text1.textContent = currentText;
    text2.textContent = nextText;

    text1.className = currentText.includes("POPCO")
      ? "text-element popco"
      : "text-element";
    text2.className = nextText.includes("POPCO")
      ? "text-element popco"
      : "text-element";
  };

  const doCooldown = () => {
    morphRef.current = 0;

    const text1 = text1Ref.current;
    const text2 = text2Ref.current;

    if (!text1 || !text2) return;

    text2.style.filter = "";
    text2.style.opacity = "100%";
    text1.style.filter = "";
    text1.style.opacity = "0%";
  };

  // 부드러운 페이지 전환 함수
  const smoothTransition = () => {
    setIsTransitioning(true);

    // 1.5초 후에 실제 페이지 이동
    setTimeout(() => {
      window.location.href = "/";
    }, 1500);
  };

  const animate = () => {
    const newTime = new Date();
    const shouldIncrementIndex = cooldownRef.current > 0;
    const dt = (newTime.getTime() - timeRef.current.getTime()) / 1000;
    timeRef.current = newTime;

    cooldownRef.current -= dt;

    if (cooldownRef.current <= 0) {
      if (shouldIncrementIndex) {
        textIndexRef.current++;

        // POPCO가 표시되면 애니메이션 중단하고 전환 준비
        if (texts[textIndexRef.current % texts.length] === "POPCO") {
          // 애니메이션 중단
          if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
            animationRef.current = null;
          }

          // 2초 후에 부드러운 전환 시작
          redirectTimeoutRef.current = setTimeout(() => {
            smoothTransition();
          }, 2000);
          return; // 더 이상 애니메이션 진행하지 않음
        }
      }
      doMorph();
    } else {
      doCooldown();
    }

    // POPCO가 아닐 때만 애니메이션 계속
    if (animationRef.current !== null) {
      animationRef.current = requestAnimationFrame(animate);
    }
  };

  useEffect(() => {
    if (text1Ref.current && text2Ref.current) {
      text1Ref.current.textContent = texts[textIndexRef.current % texts.length];
      text2Ref.current.textContent =
        texts[(textIndexRef.current + 1) % texts.length];
    }

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (redirectTimeoutRef.current) {
        clearTimeout(redirectTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    localStorage.setItem("visitedDate", today);
  }, []);

  return (
    <div
      className={`popco-container ${isTransitioning ? "transitioning" : ""}`}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css?family=Raleway:900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@900&display=swap');

        .popco-container {
          margin: 0px;
          background: linear-gradient(135deg, #0f1525 0%, #44455a 100%);
          min-height: 100vh;
          overflow: hidden;
          position: relative;
          perspective: 1000px;
          transition: opacity 1.5s ease-out, filter 1.5s ease-out;
        }

        /* 전환 애니메이션 클래스 */
        .popco-container.transitioning {
          opacity: 0;
          filter: blur(10px);
        }

        /* 전환용 오버레이 */
        .popco-container.transitioning::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.8) 100%);
          z-index: 9999;
          animation: fadeToWhite 1.5s ease-out forwards;
        }

        @keyframes fadeToWhite {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }

        .text-container {
          position: absolute;
          margin: auto;
          width: 100vw;
          height: 120pt;
          top: 0;
          bottom: 0;
          filter: url(#threshold) blur(0.6px);
          transform-style: preserve-3d;
          transition: transform 1.5s ease-out;
        }

        .popco-container.transitioning .text-container {
          transform: scale(1.1) translateZ(50px);
        }

        .text-element {
          position: absolute;
          width: 100%;
          display: inline-block;
          font-family: 'Noto Sans KR', 'Raleway', sans-serif;
          font-size: 70pt;
          font-weight: 900;
          text-align: center;
          color: white;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
          user-select: none;
          transform-style: preserve-3d;
        }

        .popco {
          font-size: 110pt !important;
          background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4) !important;
          background-size: 300% 300% !important;
          -webkit-background-clip: text !important;
          -webkit-text-fill-color: transparent !important;
          background-clip: text !important;
          animation: balloon3D 6s ease-in-out infinite, gradientShift 4s ease-in-out infinite !important;
          filter: drop-shadow(0 15px 30px rgba(0,0,0,0.4)) 
                  drop-shadow(0 0 40px rgba(255,255,255,0.3))
                  drop-shadow(0 5px 15px rgba(255,107,107,0.4))
                  drop-shadow(0 -5px 15px rgba(78,205,196,0.4)) !important;
          font-weight: 900 !important;
          letter-spacing: 3px !important;
          transform-style: preserve-3d !important;
          will-change: transform !important;
          text-shadow: 
            0 1px 0 #ccc,
            0 2px 0 #c9c9c9,
            0 3px 0 #bbb,
            0 4px 0 #b9b9b9,
            0 5px 0 #aaa,
            0 6px 1px rgba(0,0,0,.1),
            0 0 5px rgba(0,0,0,.1),
            0 1px 3px rgba(0,0,0,.3),
            0 3px 5px rgba(0,0,0,.2),
            0 5px 10px rgba(0,0,0,.25),
            0 10px 10px rgba(0,0,0,.2),
            0 20px 20px rgba(0,0,0,.15) !important;
          position: relative;
        }

        .popco::before {
          content: '';
          position: absolute;
          top: -10px;
          left: -10px;
          right: -10px;
          bottom: -10px;
          background: radial-gradient(ellipse at center, rgba(255,255,255,0.1) 0%, transparent 70%);
          border-radius: 50%;
          z-index: -1;
          animation: balloonGlow 5s ease-in-out infinite;
          will-change: transform, opacity;
        }

        .popco::after {
          content: '';
          position: absolute;
          top: 20%;
          left: 30%;
          width: 30px;
          height: 40px;
          background: radial-gradient(ellipse, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.2) 40%, transparent 70%);
          border-radius: 50%;
          z-index: 1;
          animation: highlight 6s ease-in-out infinite;
          will-change: transform, opacity;
        }

        @keyframes balloon3D {
          0%, 100% { 
            transform: rotateX(0deg) rotateY(0deg) scale(1) translateZ(0px);
          }
          16.66% { 
            transform: rotateX(2deg) rotateY(-2deg) scale(1.02) translateZ(10px);
          }
          33.33% { 
            transform: rotateX(4deg) rotateY(-4deg) scale(1.04) translateZ(20px);
          }
          50% { 
            transform: rotateX(0deg) rotateY(8deg) scale(1.06) translateZ(30px);
          }
          66.66% { 
            transform: rotateX(-4deg) rotateY(4deg) scale(1.04) translateZ(20px);
          }
          83.33% { 
            transform: rotateX(-2deg) rotateY(2deg) scale(1.02) translateZ(10px);
          }
        }

        @keyframes balloonGlow {
          0%, 100% { 
            opacity: 0.3;
            transform: scale(1);
          }
          50% { 
            opacity: 0.6;
            transform: scale(1.1);
          }
        }

        @keyframes highlight {
          0%, 100% { 
            opacity: 0.6;
            transform: scale(1) rotate(0deg);
          }
          50% { 
            opacity: 0.9;
            transform: scale(1.2) rotate(5deg);
          }
        }

        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .chick {
          font-size: 60pt !important;
          margin-left: 20px;
          animation: bounce 2s ease-in-out infinite;
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        @media (max-width: 768px) {
          .text-element { font-size: 50pt; }
          .popco { 
            font-size: 70pt !important;
            letter-spacing: 2px !important;
          }
          .popco::after {
            width: 20px;
            height: 25px;
          }
          .chick { font-size: 40pt !important; }
        }

        @media (max-width: 480px) {
          .text-element { font-size: 35pt; }
          .popco { 
            font-size: 50pt !important;
            letter-spacing: 1px !important;
          }
          .popco::after {
            width: 15px;
            height: 20px;
          }
          .chick { font-size: 30pt !important; }
        }
      `}</style>
      <div className="text-container">
        <span ref={text1Ref} className="text-element"></span>
        <span ref={text2Ref} className="text-element"></span>
      </div>
      <svg id="filters" style={{ position: "absolute", width: 0, height: 0 }}>
        <defs>
          <filter id="threshold">
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="1 0 0 0 0
                      0 1 0 0 0
              0 0 1 0 0
                      0 0 0 255 -140"
            />
          </filter>
        </defs>
      </svg>
    </div>
  );
};

export default IntroPage;
