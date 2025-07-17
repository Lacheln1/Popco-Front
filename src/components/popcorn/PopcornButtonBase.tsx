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
          className={`absolute left-1 top-2 z-0 h-10 w-10 rounded-full blur-md ${
            COLOR_MAP[color].split(" ")[0]
          }`}
        />
      )}

      <img className="relative z-10 h-12 w-auto" src={iconSrc} alt="popcorn" />
      <div
        className={`mt-1 text-center text-xs ${COLOR_MAP[color].split(" ")[1]}`}
      >
        {label}
      </div>

      {showPops && (
        <>
          <img
            className="absolute left-[10%] top-[10%] h-4 w-auto animate-popcorn1"
            src="/images/components/popcorn.svg"
            alt="pop1"
          />
          <img
            className="absolute left-[40%] top-[5%] h-4 w-auto animate-popcorn2"
            src="/images/components/popcorn.svg"
            alt="pop2"
          />
          <img
            className="absolute left-[60%] top-[12%] h-4 w-auto animate-popcorn3"
            src="/images/components/popcorn.svg"
            alt="pop3"
          />
        </>
      )}
    </button>
  );
};

export default PopcornButtonBase;
