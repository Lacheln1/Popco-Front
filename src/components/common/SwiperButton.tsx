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
        w-10 h-10
        border border-gray-300
        bg-white
        hover:bg-gray-50
        disabled:opacity-50 disabled:cursor-not-allowed
        transition-colors duration-200
        ${className}
      `}
            aria-label={direction === "prev" ? "Previous slide" : "Next slide"}
        >
            {direction === "prev" ? (
                <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-gray-600"
                >
                    <path
                        d="M10 4L6 8L10 12"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            ) : (
                <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-gray-600"
                >
                    <path
                        d="M6 4L10 8L6 12"
                        stroke="currentColor"
                        strokeWidth="1.5"
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
