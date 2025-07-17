import { useState } from "react";

interface HatePopcornProps {
  isSelected: boolean;
  onClick: () => void;
}

const HatePopcorn = ({ isSelected, onClick }: HatePopcornProps) => {
  const [isDisabled, setIsDisabled] = useState(false);

  const handleClick = () => {
    if (isSelected) {
      onClick();
      return;
    }

    setIsDisabled(true);
    onClick();

    setTimeout(() => {
      setIsDisabled(false);
    }, 500);
  };

  return (
    <button
      onClick={handleClick}
      disabled={isDisabled}
      className="relative flex flex-col items-center disabled:cursor-not-allowed"
    >
      {isSelected && (
        <div className="absolute left-2 top-2 z-0 h-11 w-11 rounded-full bg-red-600 blur-[7.5px]" />
      )}
      <img
        className={`relative z-10 h-14 w-auto transition-transform duration-500 ${
          isSelected ? "rotate-[90deg]" : ""
        }`}
        src="/images/components/hate-popcorn.svg"
        alt="popcorn-bucket"
      />
      <div className="mt-1 text-center text-sm text-red-600">싫어요</div>
    </button>
  );
};

export default HatePopcorn;
