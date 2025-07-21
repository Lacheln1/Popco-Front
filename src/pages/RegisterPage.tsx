import React from "react";
import spotlightImg from "@/assets/spotlight.svg";
import spotlightWithLogoImg from "@/assets/spotlight-with-logo.svg";
import loginPopcoImg from "@/assets/login-popco.svg";
import { ExclamationCircleOutlined } from "@ant-design/icons";

const RegisterPage: React.FC = () => {
  return (
    <main className="relative min-h-screen bg-[#0F1525]">
      {/* 데스크탑 */}
      <div className="mx-2 hidden min-h-screen justify-center lg:flex">
        {/* 이미지 영역 */}
        <div className="flex w-full justify-end">
          <div>
            <div className="relative top-[-20px] flex justify-center">
              <a href="/">
                <img
                  src={spotlightWithLogoImg}
                  alt="로고with스포트라이트"
                  className="object-cover md:h-[200px] lg:h-[280px] xl:h-[336px] xl:w-[471px]"
                />
              </a>
            </div>

            <div className="flex justify-center">
              <img
                src={loginPopcoImg}
                alt="로그인팝코이미지"
                className="obejct-cover lg:mt-18 md:mt-28 xl:mt-12 xl:h-[450px]"
              />
            </div>
          </div>
        </div>

        {/* 회원가입 섹션 */}
        <div className="flex w-full items-center justify-start xl:mr-32">
          <div className="relative ml-4 flex w-full max-w-[600px] flex-col justify-center rounded-3xl bg-gray-100 p-6 opacity-95 shadow-2xl md:mt-8 md:h-[550px] md:max-w-[800px] lg:h-[710px] xl:mt-16">
            <img
              src={spotlightImg}
              alt=""
              className="absolute left-1/2 w-[200px] -translate-x-1/2 -translate-y-1/2 object-cover md:top-12 md:w-[350px] lg:top-[-22px] lg:w-[440px] xl:top-[-20px] xl:w-[520px]"
            />
            <div className="relative z-10 w-full">
              <div className="mb-6 mt-4 text-center md:mb-7">
                <h1 className="mb-2 break-all font-semibold text-gray-800 lg:text-3xl xl:text-[30px]">
                  POPCO 멤버가 되어 특별한 경험을 만나보세요.
                </h1>
                <p className="text-md text-gray-600 lg:text-base xl:text-xl">
                  회원가입 하시겠어요?
                </p>
              </div>

              <form className="flex flex-col items-center space-y-3 md:space-y-4">
                <div className="w-full max-w-[500px]">
                  <label className="mb-2 ml-4 block text-xs text-black md:text-base">
                    이메일
                  </label>
                  <input
                    type="email"
                    placeholder="Email Address"
                    className="white w-full rounded-[40px] border-0 px-3 py-3 font-medium text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ffd751] md:px-4 md:py-4"
                  />
                  <p className="text-popcorn-box ml-4 mt-2 flex justify-start text-xs">
                    <ExclamationCircleOutlined className="mr-1" />
                    올바른 형식이 아닙니다
                  </p>
                </div>

                <div className="w-full max-w-[500px]">
                  <label className="mb-2 ml-4 block text-xs text-black md:text-base">
                    비밀번호
                  </label>
                  <input
                    type="password"
                    placeholder="Password"
                    className="w-full rounded-[40px] border-0 bg-white px-3 py-3 text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ffd751] md:px-4 md:py-4"
                  />
                  <p className="text-popcorn-box ml-4 mt-2 flex justify-start text-xs">
                    <ExclamationCircleOutlined className="mr-1" />
                    올바른 형식이 아닙니다
                  </p>
                </div>

                <div className="w-full max-w-[500px]">
                  <label className="mb-2 ml-4 block text-xs text-black md:text-base">
                    비밀번호 확인
                  </label>
                  <input
                    type="password"
                    placeholder="Password"
                    className="w-full rounded-[40px] border-0 bg-white px-3 py-3 text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ffd751] md:px-4 md:py-4"
                  />
                  <p className="text-popcorn-box ml-4 mt-2 flex justify-start text-xs">
                    <ExclamationCircleOutlined className="mr-1" />
                    일치하지 않습니다
                  </p>
                </div>

                <div className="w-full max-w-[500px] pt-3 md:pt-4">
                  <button
                    type="submit"
                    className="bg-popco-main w-full rounded-[400px] px-4 py-3 text-xl font-medium text-black transition-colors hover:bg-yellow-400 md:py-4"
                  >
                    회원가입
                  </button>
                </div>
              </form>

              <div className="mt-4 flex justify-center lg:mt-6">
                <p className="text-xs text-gray-600 lg:text-base">
                  이미 회원이신가요?{" "}
                  <a
                    href="/login"
                    className="text-sunglasses-deepBlue ml-1 hover:text-[#142c44]"
                  >
                    로그인 하기
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 모바일 */}
      <div className="flex flex-col lg:hidden">
        {/* 로고 이미지 */}
        <div className="relative flex flex-1 flex-col items-center justify-center">
          <a href="/">
            <img
              src={spotlightWithLogoImg}
              alt="스포트라이트로고"
              className="w-64 object-cover"
            />
          </a>
        </div>

        {/* 회원가입 섹션 */}
        <div className="flex justify-center px-4 pb-4 md:mx-10">
          <div className="b-gray-100 w-[600px] rounded-3xl bg-gray-100 p-6 opacity-95 shadow-2xl md:mt-14">
            <div className="mb-6 text-center">
              <h1 className="text-xl font-bold text-gray-800">
                POPCO 멤버가 되어
              </h1>
              <h1 className="mb-2 text-xl font-bold text-gray-800">
                특별한 경험을 만나보세요.
              </h1>
              <p className="text-sm text-gray-600">회원가입 하시겠어요?</p>
            </div>

            <form className="flex flex-col items-center space-y-3">
              <div className="w-full max-w-[440px]">
                <label className="mb-2 ml-4 block text-sm text-black">
                  이메일
                </label>
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full rounded-[40px] border-0 bg-white px-3 py-3 text-sm text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ffd751]"
                />
                <p className="text-popcorn-box ml-4 mt-2 flex justify-start text-xs">
                  <ExclamationCircleOutlined className="mr-1" />
                  올바른 형식이 아닙니다
                </p>
              </div>

              <div className="w-full max-w-[440px]">
                <label className="mb-2 ml-4 block text-sm text-black">
                  비밀번호
                </label>
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full rounded-[40px] border-0 bg-white px-3 py-3 text-sm text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ffd751]"
                />
                <p className="text-popcorn-box ml-4 mt-2 flex justify-start text-xs">
                  <ExclamationCircleOutlined className="mr-1" />
                  올바른 형식이 아닙니다
                </p>
              </div>

              <div className="w-full max-w-[440px]">
                <label className="mb-2 ml-4 block text-sm text-black">
                  비밀번호 확인
                </label>
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full rounded-[40px] border-0 bg-white px-3 py-3 text-sm text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ffd751]"
                />

                <p className="text-popcorn-box ml-4 mt-2 flex justify-start text-xs">
                  <ExclamationCircleOutlined className="mr-1" />
                  일치하지 않습니다
                </p>
              </div>

              <div className="w-full max-w-[500px] pt-3 md:pt-4">
                <button
                  type="submit"
                  className="bg-popco-main w-full rounded-[400px] px-4 py-3 text-xl font-medium text-black transition-colors hover:bg-yellow-400 md:py-4"
                >
                  회원가입
                </button>
              </div>
            </form>
            <div className="mt-4 flex justify-center lg:mt-6">
              <p className="text-xs text-gray-600 lg:text-base">
                이미 회원이신가요?{" "}
                <a
                  href="/login"
                  className="text-sunglasses-deepBlue ml-1 hover:text-[#142c44]"
                >
                  로그인 하기
                </a>
              </p>
            </div>
          </div>
        </div>
        {/* 하단 - 캐릭터들 */}
        <div className="flex justify-center pb-8">
          <img src={loginPopcoImg} alt="" className="w-[600px]" />
        </div>
      </div>
    </main>
  );
};

export default RegisterPage;
