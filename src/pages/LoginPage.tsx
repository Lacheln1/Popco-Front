import React, { useEffect } from "react";
import spotlightImg from "@/assets/spotlight.svg";
import spotlightWithLogoImg from "@/assets/spotlight-with-logo.svg";
import loginPopcoImg from "@/assets/login-popco.svg";
import kakaoSymbolImg from "@/assets/kakao-symbol.svg";
import LoginForm from "@/components/LoginResgisterPage/LoginForm";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  pageVariants,
  characterVariants,
  headerVariants,
  linkVariants,
  socialContainerVariants,
  socialButtonVariants,
} from "@/components/LoginResgisterPage/Animation";

const KAKAO_LOGIN_URL = `${import.meta.env.VITE_KAKAO_LOGIN_URL}`;

const LoginPage: React.FC = () => {
  useEffect(() => {
    console.log("VITE_BACK_URL:", import.meta.env.VITE_BACK_URL);
    console.log("VITE_KAKAO_LOGIN_URL:", import.meta.env.VITE_KAKAO_LOGIN_URL);
  }, []);

  const handleKakaoLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    window.location.href = KAKAO_LOGIN_URL;
  };

  return (
    <motion.main
      className="pretendard relative h-full bg-[#0F1525]"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {/* 데스크탑 레이아웃 */}
      <div className="mx-2 hidden min-h-screen justify-center lg:flex lg:items-start">
        {/* 로그인 화면 왼쪽 팝콘 로고 + 캐릭터들 섹션 */}
        <div className="flex w-full justify-end">
          <div>
            <div className="relative top-[-20px] flex justify-center">
              <Link to="/">
                <img
                  src={spotlightWithLogoImg}
                  alt=""
                  className="object-cover md:h-[200px] lg:h-[280px] xl:h-[336px] xl:w-[471px]"
                />
              </Link>
            </div>

            <div className="flex justify-center">
              <motion.img
                src={loginPopcoImg}
                alt=""
                className="lg:mt-18 object-cover md:mt-28 xl:mt-12 xl:h-[450px]"
                variants={characterVariants}
                initial="hidden"
                animate="visible"
              />
            </div>
          </div>
        </div>

        {/* 로그인 화면 오른쪽 로그인 폼 */}
        <div className="flex w-full justify-center lg:mt-[70px] xl:mr-32 xl:mt-[100px]">
          <motion.div
            className="relative ml-4 flex h-full w-full max-w-[600px] flex-col items-center rounded-3xl bg-gray-100 p-6 opacity-95 shadow-2xl md:mt-8 md:h-[550px] md:max-w-[800px] lg:h-[680px]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            {/* 스포트라이트 */}
            <img
              src={spotlightImg}
              alt=""
              className="absolute left-1/2 w-[200px] -translate-x-1/2 object-cover md:top-[-40px] md:w-[350px] lg:top-[-125px] lg:w-[440px] xl:top-[-150px] xl:w-[520px]"
            />
            <div className="relative flex h-full w-full flex-col justify-center">
              <motion.div
                className="mb-6 text-center md:mb-7 lg:mb-8"
                variants={headerVariants}
                initial="hidden"
                animate="visible"
              >
                <h1 className="mb-2 font-semibold text-gray-800 lg:text-3xl xl:text-[30px]">
                  지금 바로 POPCO에 입장해요 !
                </h1>
                <p className="text-md text-gray-600 lg:text-base xl:text-xl">
                  로그인 하시겠어요?
                </p>
              </motion.div>

              <LoginForm />

              <motion.div
                className="mt-4 flex justify-center md:mt-6"
                variants={linkVariants}
                initial="hidden"
                animate="visible"
              >
                <p className="text-xs text-gray-600 md:text-base">
                  회원이 아니신가요?
                  <Link
                    to="/register"
                    className="ml-1 text-[#e54b2f] hover:text-[#d4452b]"
                  >
                    회원가입 하기
                  </Link>
                </p>
              </motion.div>
              <div className="mt-4 flex w-full justify-center md:mt-6 md:pt-8">
                <motion.div
                  className="flex h-16 w-full max-w-[500px] gap-2 md:gap-3 xl:mt-5"
                  variants={socialContainerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <motion.button
                    className="flex flex-1 items-center justify-center rounded-xl bg-[#03c75a] px-3 py-2.5 text-xs font-medium text-white transition-colors md:px-4 md:py-3 md:text-sm lg:text-base xl:text-xl"
                    variants={socialButtonVariants}
                    whileTap="tap"
                  >
                    <span className="mr-2 font-bold">N</span>
                    네이버 로그인
                  </motion.button>
                  <motion.button
                    className="flex flex-1 items-center justify-center rounded-xl bg-[#FEE500] px-3 py-2.5 text-xs font-medium text-black transition-colors md:px-4 md:py-3 md:text-sm lg:text-base xl:text-xl"
                    variants={socialButtonVariants}
                    whileTap="tap"
                    onClick={handleKakaoLogin}
                  >
                    <div className="pr-4">
                      <img
                        src={kakaoSymbolImg}
                        alt="카카오심볼"
                        className="w-5 object-contain"
                      />
                    </div>
                    카카오 로그인
                  </motion.button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* 모바일 레이아웃 */}
      <div className="flex flex-col lg:hidden">
        {/* 상단 - 스포트라이트와 로고 */}
        <div className="relative flex flex-1 flex-col items-center justify-center">
          <Link to="/">
            <motion.img
              src={spotlightWithLogoImg}
              alt=""
              className="w-64 object-cover"
              variants={characterVariants}
              initial="hidden"
              animate="visible"
            />
          </Link>
        </div>

        {/* 중간 - 로그인 폼 */}
        <div className="flex justify-center px-4 pb-4 md:mx-10">
          <motion.div
            className="w-[600px] rounded-3xl bg-gray-100 p-6 opacity-95 shadow-2xl md:mt-14"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <motion.div
              className="mb-6 text-center"
              variants={headerVariants}
              initial="hidden"
              animate="visible"
            >
              <h1 className="mb-2 text-xl font-bold text-gray-800">
                지금 바로 POPCO에 입장해요 !
              </h1>
              <p className="text-sm font-medium text-gray-600">
                로그인 하시겠어요?
              </p>
            </motion.div>

            <LoginForm />

            <motion.div
              className="mt-4 text-center"
              variants={linkVariants}
              initial="hidden"
              animate="visible"
            >
              <p className="text-xs text-gray-600">
                회원이 아니신가요?
                <Link to="/register" className="ml-1 text-[#e54b2f]">
                  회원가입 하기
                </Link>
              </p>
            </motion.div>

            <div className="mt-4 flex w-full justify-center">
              <motion.div
                className="flex w-full max-w-[440px] gap-2"
                variants={socialContainerVariants}
                initial="hidden"
                animate="visible"
              >
                <button className="flex flex-1 items-center justify-center rounded-xl bg-green-500 px-3 py-2.5 text-xs font-medium text-white transition-colors">
                  <span className="mr-2 font-bold">N</span>
                  네이버 로그인
                </button>
                <button
                  className="flex flex-1 items-center justify-center rounded-xl bg-[#FEE500] px-3 py-2.5 text-xs font-medium text-black transition-colors"
                  onClick={handleKakaoLogin}
                >
                  <div className="pr-4">
                    <img
                      src={kakaoSymbolImg}
                      alt="카카오심볼"
                      className="w-5 object-contain"
                    />
                  </div>
                  카카오 로그인
                </button>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* 하단 - 캐릭터들 */}
        <div className="flex justify-center pb-8">
          <img src={loginPopcoImg} alt="" className="w-[600px]" />
        </div>
      </div>
    </motion.main>
  );
};

export default LoginPage;
