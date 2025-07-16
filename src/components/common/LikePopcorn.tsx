import { useState } from "react";

interface LikePopcornProps {
  isLiked: boolean;
  onClick: () => void;
}

const LikePopcorn = ({ isLiked, onClick }: LikePopcornProps) => {
  const [showPops, setShowPops] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  const handleClick = () => {
    if (isLiked) {
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
      {isLiked && (
        <div className="absolute left-2 top-2 z-0 h-11 w-11 rounded-full bg-[#ff8c00] blur-[7.5px]" />
      )}

      <img
        className="relative z-10 h-14 w-auto"
        src="/images/components/like-popcorn.svg"
        alt="popcorn-bucket"
      />
      <div className="mt-1 text-center text-sm text-green-700">좋아요</div>

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
