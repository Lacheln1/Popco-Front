import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";
const IntroPage = () => {
  const text1Ref = useRef<HTMLSpanElement | null>(null);
  const text2Ref = useRef<HTMLSpanElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const texts = [
    "내일은",
    "뭐보지?",
    "고민하게 되는 그 순간",
    "당신의 취향에 딱!",
    "POPCO",
  ];

  const navigate = useNavigate();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isIntroDone, setIsIntroDone] = useState(false);

  // 스크롤 진행도를 계산하는 함수
  const calculateScrollProgress = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    return Math.min(scrollTop / Math.max(scrollHeight, 1), 1);
  };

  // 텍스트 모프 효과 적용
  const setMorph = (fraction: number, textIndex: number) => {
    const text1 = text1Ref.current;
    const text2 = text2Ref.current;

    if (!text1 || !text2) return;

    // 다음 텍스트 블러 및 투명도
    text2.style.filter = `blur(${Math.min(8 / Math.max(fraction, 0.1) - 8, 100)}px)`;
    text2.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;

    // 현재 텍스트 블러 및 투명도
    const inverseFraction = 1 - fraction;
    text1.style.filter = `blur(${Math.min(8 / Math.max(inverseFraction, 0.1) - 8, 100)}px)`;
    text1.style.opacity = `${Math.pow(inverseFraction, 0.4) * 100}%`;

    const currentText = texts[textIndex % texts.length];
    const nextText = texts[(textIndex + 1) % texts.length];

    text1.textContent = currentText;
    text2.textContent = nextText;
  };

  const smoothTransition = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setIsIntroDone(true);
    }, 1500);
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollProgress = calculateScrollProgress();
      const totalSteps = texts.length - 1;
      const stepSize = 1 / totalSteps;

      // 현재 어떤 텍스트 단계인지 계산
      const currentStep = Math.floor(scrollProgress / stepSize);
      const stepProgress = (scrollProgress % stepSize) / stepSize;

      const textIndex = Math.min(currentStep, totalSteps - 1);

      // 모프 효과 적용
      setMorph(stepProgress, textIndex);

      // POPCO에 도달했을 때
      if (textIndex >= totalSteps - 1 && stepProgress > 0.8) {
        if (!isTransitioning && !isIntroDone) {
          setTimeout(() => {
            smoothTransition();
          }, 1000);
        }
      }
    };

    // 초기 설정
    if (text1Ref.current && text2Ref.current) {
      text1Ref.current.textContent = texts[0];
      text2Ref.current.textContent = texts[1];
      text1Ref.current.style.opacity = "100%";
      text2Ref.current.style.opacity = "0%";
    }

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isTransitioning, isIntroDone]);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    try {
      sessionStorage.setItem("visitedDate", today);
    } catch (e) {
      console.log("Storage not available");
    }
  }, []);

  useEffect(() => {
    if (isIntroDone) {
      navigate("/", { replace: true });
    }
  }, [isIntroDone]);

  return (
    <>
      <div
        ref={containerRef}
        className={`popco-container ${isTransitioning ? "transitioning" : ""}`}
      >
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

      {/* 스크롤을 위한 충분한 높이 제공 */}
      <div style={{ height: "400vh", background: "transparent" }}>
        <div
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            padding: "10px 20px",
            background: "rgba(255,255,255,0.1)",
            borderRadius: "20px",
            color: "white",
            fontSize: "14px",
            backdropFilter: "blur(10px)",
          }}
        >
          스크롤해보세요 ↓
        </div>
      </div>

      <style>{`
        .popco-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
    background: linear-gradient(135deg, #0f1525 0%, #44455a 100%);
          z-index: 10;
          transition: opacity 1.5s ease-in-out;
        }

        .popco-container.transitioning {
          opacity: 0;
        }

        .text-container {
          position: relative;
          font-size: 4rem;
          font-weight: bold;
          color: white;
          width: 100%;
          height: 100px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .text-element {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          white-space: nowrap;
          filter: url(#threshold);
          width: 100vw;
          text-align: center;
        }

        .text-element.popco {
          background: linear-gradient(
            45deg,
            #ff6b6b,
            #4ecdc4,
            #45b7d1,
            #96ceb4
          );
          background-size: 300% 300%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: gradientShift 2s ease-in-out infinite;
        }

        @keyframes gradientShift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        @media (max-width: 768px) {
          .text-container {
            font-size: 2.5rem;
          }
        }

        @media (max-width: 480px) {
          .text-container {
            font-size: 2rem;
          }
        }
      `}</style>
    </>
  );
};

export default IntroPage;
