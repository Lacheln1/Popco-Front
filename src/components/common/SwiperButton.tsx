import React from "react";
import { Swiper as SwiperType } from "swiper";

//네비게이션 버튼 하나 (개별버튼)
interface NavigationButtonProps {
    direction: "prev" | "next";
    swiper?: SwiperType;
    disabled?: boolean;
    onClick?: () => void;
    className?: string;
}

//네비게이션 버튼 하나 (개별버튼)
const NavigationButton: React.FC<NavigationButtonProps> = ({
    direction,
    swiper,
    disabled = false,
    onClick,
    className = "",
}) => {
    const handleClick = () => {
        if (onClick) {
            onClick();
        } else if (swiper) {
            if (direction === "prev") {
                swiper.slidePrev();
                console.log("이전버튼누름");
            } else {
                swiper.slideNext();
                console.log("다음버튼누름");
            }
        } else {
            console.log("swiper가 없습니다!");
        }
    };

    return (
        <button
            type="button"
            onClick={handleClick}
            disabled={disabled}
            className={`
        inline-flex items-center justify-center
        w-8 h-8
        rounded-full
        bg-white
        border border-gray-200
        shadow-sm
        hover:bg-gray-50
        hover:shadow-md
        disabled:opacity-40 disabled:cursor-not-allowed
        transition-all duration-200
        ${className}
      `}
            aria-label={direction === "prev" ? "Previous slide" : "Next slide"}
        >
            {direction === "prev" ? (
                <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-gray-700"
                >
                    <path
                        d="M12.5 5L7.5 10L12.5 15"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            ) : (
                <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-gray-700"
                >
                    <path
                        d="M7.5 5L12.5 10L7.5 15"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            )}
        </button>
    );
};

//이전+다음 버튼 세트
interface SwiperNavigationProps {
    swiper?: SwiperType;
    isBeginning?: boolean;
    isEnd?: boolean;
    className?: string;
}

//이전+다음 버튼 세트
const SwiperNavigation: React.FC<SwiperNavigationProps> = ({
    swiper,
    isBeginning = false,
    isEnd = false,
    className = "",
}) => {
    return (
        <div className={`flex items-center space-x-2 ${className}`}>
            <NavigationButton direction="prev" swiper={swiper} disabled={isBeginning} />
            <NavigationButton direction="next" swiper={swiper} disabled={isEnd} />
        </div>
    );
};

export { NavigationButton, SwiperNavigation };
export type { NavigationButtonProps, SwiperNavigationProps };
