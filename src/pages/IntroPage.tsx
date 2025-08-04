import { useEffect, useRef } from "react";

const PopcoMorphAnimation = () => {
  const text1Ref = useRef<HTMLSpanElement | null>(null);
  const text2Ref = useRef<HTMLSpanElement | null>(null);
  const animationRef = useRef<number | null>(null);

  const texts = [
    "내일은",
    "뭐보지?",
    "시간 아까울까봐",
    "고민하게 되는 그 순간",
    "당신의 취향에 딱!",
    "POPCO",
  ];

  const textIndexRef = useRef<number>(texts.length - 1);
  const morphTime = 1.2;
  const cooldownTime = 1.2;

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

  const animate = () => {
    const newTime = new Date();
    const shouldIncrementIndex = cooldownRef.current > 0;
    const dt = (newTime.getTime() - timeRef.current.getTime()) / 1000;
    timeRef.current = newTime;

    cooldownRef.current -= dt;

    if (cooldownRef.current <= 0) {
      if (shouldIncrementIndex) {
        textIndexRef.current++;
      }
      doMorph();
    } else {
      doCooldown();
    }

    animationRef.current = requestAnimationFrame(animate);
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
    };
  }, []);

  return (
    <div className="popco-container">
      <style>{`
        @import url('https://fonts.googleapis.com/css?family=Raleway:900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@900&display=swap');

        .popco-container {
          margin: 0px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          overflow: hidden;
          position: relative;
        }

        .text-container {
          position: absolute;
          margin: auto;
          width: 100vw;
          height: 120pt;
          top: 0;
          bottom: 0;
          filter: url(#threshold) blur(0.6px);
        }

        .text-element {
          position: absolute;
          width: 100%;
          display: inline-block;
          font-family: 'Noto Sans KR', 'Raleway', sans-serif;
          font-size: 80pt;
          font-weight: 900;
          text-align: center;
          color: white;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
          user-select: none;
        }

        .popco {
          color: #FFD700 !important;
          font-size: 100pt !important;
          text-shadow: 3px 3px 6px rgba(0,0,0,0.5) !important;
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
          .popco { font-size: 70pt !important; }
          .chick { font-size: 40pt !important; }
        }

        @media (max-width: 480px) {
          .text-element { font-size: 35pt; }
          .popco { font-size: 50pt !important; }
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

export default PopcoMorphAnimation;
