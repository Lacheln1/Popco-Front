import React from "react";
import spotlightImg from "@/assets/spotlight.svg";
import spotlightWithLogoImg from "@/assets/spotlight-with-logo.svg";
import loginPopcoImg from "@/assets/login-popco.svg";
import kakaoSymbolImg from "@/assets/kakao-symbol.svg";
import naverLoginBtnImg from "@/assets/naver-login-btn-image.svg";

const RegisterPage: React.FC = () => {
  return (
    <main className="relative min-h-screen bg-[#0F1525]">
      {/* 데스크탑 */}
      <div className="mx-2 hidden min-h-screen justify-center lg:flex">
        {/* 이미지 영역 */}
        <div className="flex w-full justify-end">
          <div>
            <div className="flex justify-center">
              <a href="/">
                <img src={spotlightWithLogoImg} alt="로고with스포트라이트" />
              </a>
            </div>

            <div className="flex justify-center">
              <img src={loginPopcoImg} alt="로그인팝코이미지" />
            </div>
          </div>
        </div>

        {/* 회원가입 섹션 */}
        <div className="flex w-full items-center justify-start xl:mr-32">
          <div className="relative ml-4 flex w-full max-w-[800px] flex-col justify-center rounded-3xl bg-gray-100 p-6 opacity-95 shadow-2xl lg:mt-[62px] lg:h-[600px] xl:mt-16 xl:h-[770px]">
            <img
              src={spotlightImg}
              alt=""
              className="absolute left-1/2 w-[200px] -translate-x-1/2 -translate-y-1/2 object-cover lg:top-[50px] lg:w-[440px] xl:top-16 xl:w-[520px]"
            />
            <div className="relative z-10 w-full">
              <div className="mb-6 text-center md:mb-7 lg:mb-8">
                <h1 className="mb-2 break-all font-semibold text-gray-800 lg:text-3xl xl:text-[35px]">
                  POPCO 멤버가 되어 특별한 경험을 만나보세요.
                </h1>
                <p className="text-md text-gray-600 lg:text-base xl:text-xl">
                  회원가입 하시겠어요?
                </p>
              </div>

              <form className="flex flex-col items-center space-y-3 lg:space-y-4">
                <div className="w-full max-w-[500px]">
                  <label className="text mb-2 ml-4 block text-black lg:text-base">
                    이메일
                  </label>
                  <input
                    type="email"
                    placeholder="Email Address"
                    className="white w-full rounded-[40px] border-0 px-3 py-3 font-medium text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ffd751] md:px-4 md:py-4"
                  />
                </div>

                <div className="w-full max-w-[500px]">
                  <label className="mb-2 ml-4 block text-black lg:text-base">
                    비밀번호
                  </label>
                  <input
                    type="password"
                    placeholder="Password"
                    className="w-full rounded-[40px] border-0 bg-white px-3 py-3 text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ffd751] md:px-4 md:py-4"
                  />
                </div>

                <div className="w-full max-w-[500px]">
                  <label className="mb-2 ml-4 block text-black lg:text-base">
                    비밀번호 확인
                  </label>
                  <input
                    type="password"
                    placeholder="Password"
                    className="w-full rounded-[40px] border-0 bg-white px-3 py-3 text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ffd751] md:px-4 md:py-4"
                  />
                  <p className="text-popcorn-box ml-4 mt-2 lg:text-xs xl:text-sm">
                    일치하지 않습니다
                  </p>
                </div>

                <div className="w-full max-w-[500px] pt-3 lg:pt-4">
                  <button
                    type="submit"
                    className="bg-popco-main w-full rounded-[400px] px-4 py-3 text-xl font-medium text-black transition-colors hover:bg-yellow-400 md:py-4"
                  >
                    로그인
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
    </main>
  );
};

export default RegisterPage;
