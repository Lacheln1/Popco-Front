import { useState, useEffect } from "react";
import { PopcornButtonProps } from "@/types/Popcorn.types";

const COLOR_MAP = {
  green: "bg-green-700 text-green-700",
  red: "bg-red-600 text-red-600",
};

const PopcornButtonBase = ({
  isSelected,
  onClick,
  color,
  label,
  iconSrc,
  disabled = false, // disabled prop 추가
}: PopcornButtonProps) => {
  const [showPops, setShowPops] = useState(false);
  const [isInternalDisabled, setIsInternalDisabled] = useState(false);

  // 실제 disabled 상태는 외부 disabled prop 또는 내부 애니메이션 상태
  const isDisabled = disabled || isInternalDisabled;

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showPops) {
      timer = setTimeout(() => {
        setShowPops(false);
        setIsInternalDisabled(false);
      }, 800);
    }
    return () => clearTimeout(timer);
  }, [showPops]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    // disabled 상태면 클릭 무시
    if (isDisabled) return;

    if (isSelected) {
      onClick(e);
      return;
    }

    setIsInternalDisabled(true);
    setShowPops(true);
    onClick(e);
  };

  return (
    <button
      onClick={handleClick}
      disabled={isDisabled}
      className={`relative flex flex-col items-center transition-opacity duration-200 ${
        isDisabled
          ? "cursor-not-allowed opacity-50"
          : "cursor-pointer hover:scale-105"
      }`}
    >
      {isSelected && !disabled && (
        <div
          className={`absolute inset-0 bottom-[35%] left-0 right-0 top-0 z-0 rounded-full blur-md ${
            COLOR_MAP[color].split(" ")[0]
          }`}
        />
      )}
      <img
        className={`relative z-10 h-[clamp(2rem,2vw,2.5rem)] w-auto transition-transform duration-500 sm:h-10 ${
          isSelected && color === "red" && !disabled
            ? "rotate-[90deg] scale-110"
            : "rotate-0 scale-100"
        } ${disabled ? "grayscale" : ""}`}
        src={iconSrc}
        alt="popcorn"
      />
      <div
        className={`whitespace-nowrap text-center text-[clamp(0.7rem,2vw,0.9rem)] ${
          disabled ? "text-gray-400" : COLOR_MAP[color].split(" ")[1]
        }`}
      >
        {label}
      </div>

      {/* 로딩 표시 - disabled이면서 외부에서 온 경우 */}
      {disabled && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-3 w-3 animate-spin rounded-full border border-gray-400 border-t-transparent"></div>
        </div>
      )}

      {/* 팝콘 애니메이션 - disabled가 아닐 때만 */}
      {showPops && color === "green" && !disabled && (
        <>
          <img
            className="absolute left-[10%] top-[10%] h-3 w-auto animate-popcorn1 sm:h-4"
            src="/images/components/popcorn.svg"
            alt="pop1"
          />
          <img
            className="absolute left-[40%] top-[5%] h-3 w-auto animate-popcorn2 sm:h-4"
            src="/images/components/popcorn.svg"
            alt="pop2"
          />
          <img
            className="absolute left-[55%] top-[12%] h-3 w-auto animate-popcorn3 sm:h-4"
            src="/images/components/popcorn.svg"
            alt="pop3"
          />
        </>
      )}
    </button>
  );
};

export default PopcornButtonBase;
