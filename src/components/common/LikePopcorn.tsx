import { useState } from "react";

interface LikePopcornProps {
  isSelected: boolean;
  onClick: () => void;
}

const LikePopcorn = ({ isSelected, onClick }: LikePopcornProps) => {
  const [showPops, setShowPops] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  const handleClick = () => {
    if (isSelected) {
      onClick();
      return;
    }

    setIsDisabled(true);
    setShowPops(true);
    onClick();

    setTimeout(() => {
      setShowPops(false);
      setIsDisabled(false);
    }, 800);
  };

  return (
    <button
      onClick={handleClick}
      disabled={isDisabled}
      className="relative flex flex-col disabled:cursor-not-allowed"
    >
      {isSelected && (
        <div className="absolute left-1 top-2 z-0 h-10 w-10 rounded-full bg-green-700 blur-md" />
      )}

      <img
        className="relative z-10 h-12 w-auto"
        src="/images/components/like-popcorn.svg"
        alt="popcorn-bucket"
      />
      <div className="mt-1 text-center text-xs text-green-700">좋아요</div>

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

export default LikePopcorn;
