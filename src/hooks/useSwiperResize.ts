import { useState, useEffect } from "react";
import { Swiper as SwiperType } from "swiper";

// Debounce 유틸리티 함수
const debounce = (func: (...args: any[]) => void, delay: number) => {
  let timeout: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
};

/**
 * Swiper 인스턴스의 resize 이벤트를 감지하여, 네비게이션 버튼의 '처음/끝' 상태를 반환하는 커스텀 훅
 * @param swiper - Swiper 인스턴스 상태
 * @returns `{ isBeginning: boolean, isEnd: boolean }`
 */
export const useSwiperResize = (swiper: SwiperType | null) => {
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  useEffect(() => {
    // swiper 인스턴스가 없으면 아무것도 하지 않음
    if (!swiper) return;

    // 초기 상태 설정
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);

    // 리사이즈 이벤트 발생 시 실행될 핸들러
    const handleResize = () => {
      swiper.update(); // Swiper 내부 상태 강제 업데이트
      setIsBeginning(swiper.isBeginning);
      setIsEnd(swiper.isEnd);
    };

    const debouncedHandleResize = debounce(handleResize, 200);

    window.addEventListener("resize", debouncedHandleResize);

    return () => {
      window.removeEventListener("resize", debouncedHandleResize);
    };
  }, [swiper]); // swiper 인스턴스가 변경될 때만 이 effect가 실행됨

  // 슬라이드 변경 시에도 상태를 업데이트
  useEffect(() => {
    if (!swiper) return;

    const handleSlideChange = () => {
      setIsBeginning(swiper.isBeginning);
      setIsEnd(swiper.isEnd);
    };

    swiper.on("slideChange", handleSlideChange);

    return () => {
      swiper.off("slideChange", handleSlideChange);
    };
  }, [swiper]);

  return { isBeginning, isEnd };
};
