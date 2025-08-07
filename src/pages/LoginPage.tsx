import spotlightImg from "@/assets/spotlight.svg";
import spotlightWithLogoImg from "@/assets/spotlight-with-logo.svg";
import loginPopcoImg from "@/assets/login-popco.webp";
import kakaoSymbolImg from "@/assets/kakao-symbol.webp";
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
  const handleKakaoLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = KAKAO_LOGIN_URL;
  };

  return (
    <motion.main
      className="pretendard relative min-h-screen bg-[#0F1525]"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {/* 데스크탑 레이아웃 */}
      <div className="hidden min-h-screen lg:flex lg:items-center lg:justify-center lg:px-4">
        <div className="flex w-full max-w-7xl items-center justify-center gap-8 xl:gap-16">
          {/* 로그인 화면 왼쪽 팝콘 로고 + 캐릭터들 섹션 */}
          <div className="flex flex-1 flex-col items-center justify-center">
            <div className="mb-8">
              <Link to="/">
                <img
                  src={spotlightWithLogoImg}
                  alt=""
                  className="object-cover lg:h-[280px] xl:h-[336px] xl:w-[471px]"
                />
              </Link>
            </div>

            <div className="flex justify-center">
              <motion.img
                src={loginPopcoImg}
                alt=""
                className="object-cover xl:h-[450px]"
                variants={characterVariants}
                initial="hidden"
                animate="visible"
              />
            </div>
          </div>

          {/* 로그인 화면 오른쪽 로그인 폼 */}
          <div className="flex flex-1 items-center justify-center">
            <motion.div
              className="relative flex w-full max-w-[600px] flex-col items-center rounded-3xl bg-gray-100 p-8 opacity-95 shadow-2xl lg:h-[680px] lg:max-w-[500px] xl:max-w-[600px]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              {/* 스포트라이트 */}
              <img
                src={spotlightImg}
                alt=""
                className="absolute left-1/2 top-[-125px] w-[440px] -translate-x-1/2 object-cover xl:top-[-150px] xl:w-[520px]"
              />

              <div className="relative flex h-full w-full flex-col justify-center">
                <motion.div
                  className="mb-8 text-center"
                  variants={headerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <h1 className="mb-2 text-2xl font-semibold text-gray-800 lg:text-3xl xl:text-[30px]">
                    지금 바로 POPCO에 입장해요 !
                  </h1>
                  <p className="text-base text-gray-600 lg:text-lg xl:text-xl">
                    로그인 하시겠어요?
                  </p>
                </motion.div>

                <LoginForm />

                <motion.div
                  className="mt-6 flex justify-center"
                  variants={linkVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <p className="text-sm text-gray-600 md:text-base">
                    회원이 아니신가요?
                    <Link
                      to="/register"
                      className="ml-1 text-[#e54b2f] hover:text-[#d4452b]"
                    >
                      회원가입 하기
                    </Link>
                  </p>
                </motion.div>

                <div className="mt-6 flex w-full justify-center">
                  <motion.div
                    className="flex h-16 w-full max-w-[500px] gap-3"
                    variants={socialContainerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <motion.button
                      className="flex flex-1 items-center justify-center rounded-xl bg-[#FEE500] px-4 py-3 text-base font-medium text-black transition-colors lg:text-lg xl:text-xl"
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
      </div>

      {/* 모바일 레이아웃 */}
      <div className="flex min-h-screen flex-col lg:hidden">
        {/* 상단 - 스포트라이트와 로고 */}
        <div className="flex flex-1 items-center justify-center">
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
        <div className="flex justify-center px-4 pb-4">
          <motion.div
            className="w-full max-w-[600px] rounded-3xl bg-gray-100 p-6 opacity-95 shadow-2xl"
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

            <div className="mt-4 flex justify-center">
              <motion.div
                className="flex w-full max-w-[500px] gap-2"
                variants={socialContainerVariants}
                initial="hidden"
                animate="visible"
              >
                <button
                  className="flex flex-1 items-center justify-center rounded-xl bg-[#FEE500] px-3 py-4 text-xl font-medium text-black transition-colors"
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
        <div className="flex flex-shrink-0 justify-center pb-8">
          <img src={loginPopcoImg} alt="" className="w-[600px] max-w-full" />
        </div>
      </div>
    </motion.main>
  );
};

export default LoginPage;
