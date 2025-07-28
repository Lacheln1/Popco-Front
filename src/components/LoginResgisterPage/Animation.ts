import { Variants } from "framer-motion";
// 폼 컨테이너 애니메이션
export const formVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

// 폼 아이템 애니메이션
export const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24,
    },
  },
};

// 폼 입력 필드에 에러 발생 시 흔들림 효과
export const shakeVariants: Variants = {
  shake: {
    x: [0, -10, 10, -10, 10, 0],
    transition: { duration: 0.5 },
  },
};

// 버튼 애니메이션
export const buttonVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24,
      delay: 0.5,
    },
  },
  hover: {
    scale: 1.03,
    backgroundColor: "#ffcf20",
    transition: { duration: 0.2 },
  },
  tap: {
    scale: 0.98,
  },
  loading: {
    scale: [1, 1.02, 1],
    transition: {
      duration: 0.8,
      repeat: Infinity,
      repeatType: "reverse" as const,
    },
  },
};

// 페이지 전체 애니메이션
export const pageVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeInOut",
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.3,
    },
  },
};

// 로고 애니메이션
export const logoVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      delay: 0.2,
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

// 캐릭터 애니메이션
export const characterVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.4,
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

// 스포트라이트 애니메이션
export const spotlightVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      delay: 0.1,
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

// 헤더 애니메이션
export const headerVariants: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.4,
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

// 링크 애니메이션
export const linkVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delay: 0.6,
      duration: 0.5,
    },
  },
  hover: {
    color: "#d4452b",
    scale: 1.02,
    transition: { duration: 0.2 },
  },
};

// 소셜 로그인 버튼 컨테이너 애니메이션
export const socialContainerVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.7,
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

// 소셜 버튼 애니메이션
export const socialButtonVariants: Variants = {
  hover: {
    scale: 1.05,
    transition: { duration: 0.2 },
  },
  tap: {
    scale: 0.98,
    transition: { duration: 0.1 },
  },
};
