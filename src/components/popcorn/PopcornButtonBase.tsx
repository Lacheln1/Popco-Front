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
}: PopcornButtonProps) => {
  const [showPops, setShowPops] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showPops) {
      timer = setTimeout(() => {
        setShowPops(false);
        setIsDisabled(false);
      }, 800);
    }
    return () => clearTimeout(timer);
  }, [showPops]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSelected) {
      onClick(e);
      return;
    }

    setIsDisabled(true);
    setShowPops(true);
    onClick(e);
  };

  return (
    <button
      onClick={handleClick}
      disabled={isDisabled}
      className="relative flex flex-col items-center disabled:cursor-not-allowed"
    >
      {isSelected && (
        <div
          className={`absolute inset-0 bottom-[35%] left-0 right-0 top-0 z-0 rounded-full blur-md ${
            COLOR_MAP[color].split(" ")[0]
          }`}
        />
      )}
      <img
        className={`relative z-10 h-[clamp(2rem,2vw,2.5rem)] w-auto transition-transform duration-500 sm:h-10 ${
          isSelected && color === "red"
            ? "rotate-[90deg] scale-110"
            : "rotate-0 scale-100"
        }`}
        src={iconSrc}
        alt="popcorn"
      />
      <div
        className={`whitespace-nowrap text-center text-[clamp(0.7rem,2vw,0.9rem)] ${COLOR_MAP[color].split(" ")[1]}`}
      >
        {label}
      </div>

      {showPops && color === "green" && (
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
