import React from "react";
import spotlightImg from "@/assets/spotlight.svg";
import spotlightWithLogoImg from "@/assets/spotlight-with-logo.svg";
import loginPopcoImg from "@/assets/login-popco.svg";
import kakaoSymbolImg from "@/assets/kakao-symbol.svg";
import naverLoginBtnImg from "@/assets/naver-login-btn-image.svg";

const LoginPage: React.FC = () => {
  return (
    <main className="relative min-h-screen bg-slate-900">
      {/* 데스크탑 레이아웃 */}
      <div className="mx-2 hidden min-h-screen justify-center lg:flex">
        {/* 로그인 화면 왼쪽 팝콘 로고 + 캐릭터들 섹션 */}
        <div className="flex w-full justify-end">
          <div>
            <div className="flex justify-center">
              <img
                src={spotlightWithLogoImg}
                alt=""
                className="object-cover md:h-[200px] lg:h-[280px] xl:h-[336px] xl:w-[471px]"
              />
            </div>

            <div className="flex justify-center">
              <img
                src={loginPopcoImg}
                alt=""
                className="object-cover md:mt-28 lg:mt-2 xl:mt-12 xl:h-[450px]"
              />
            </div>
          </div>
        </div>

        {/* 로그인 화면 오른쪽 로그인 폼 */}
        <div className="flex w-full items-start justify-start xl:mr-32">
          <div className="relative ml-4 flex w-full max-w-[600px] flex-col justify-center rounded-3xl bg-white p-6 shadow-2xl md:mt-8 md:h-[550px] md:max-w-[800px] lg:mt-12 lg:h-[600px] xl:mt-16 xl:h-[770px]">
            {/* 스포트라이트 */}
            <img
              src={spotlightImg}
              alt=""
              className="absolute left-1/2 w-[200px] -translate-x-1/2 -translate-y-1/2 object-cover md:top-12 md:w-[350px] lg:top-[50px] lg:w-[440px] xl:top-16 xl:w-[520px]"
            />
            <div className="relative z-10 w-full">
              <div className="mb-6 text-center md:mb-7 lg:mb-8">
                <h1 className="mb-2 font-semibold text-gray-800 lg:text-4xl xl:text-[40px]">
                  지금 바로 POPCO에 입장해요 !
                </h1>
                <p className="text-md text-gray-600 lg:text-lg xl:text-xl">
                  로그인 하시겠어요?
                </p>
              </div>

              <form className="flex flex-col items-center space-y-3 md:space-y-4">
                <div className="w-full max-w-[500px]">
                  <label className="mb-2 block text-xs text-gray-700 md:text-sm">
                    이메일
                  </label>
                  <input
                    type="email"
                    placeholder="Email Address"
                    className="w-full rounded-xl border-0 bg-gray-100 px-3 py-3 text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 md:px-4 md:py-4"
                  />
                </div>

                <div className="w-full max-w-[500px]">
                  <label className="mb-2 block text-xs text-gray-700 md:text-sm">
                    비밀번호
                  </label>
                  <input
                    type="password"
                    placeholder="Password"
                    className="w-full rounded-xl border-0 bg-gray-100 px-3 py-3 text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 md:px-4 md:py-4"
                  />
                </div>

                <div className="w-full max-w-[500px] pt-3 md:pt-4">
                  <button
                    type="submit"
                    className="w-full rounded-xl bg-yellow-400 px-4 py-3 text-sm font-medium text-black transition-colors hover:bg-yellow-500 md:py-4"
                  >
                    로그인
                  </button>
                </div>
              </form>

              <div className="t mt-4 flex justify-center md:mt-6">
                <p className="text-xs text-gray-600 md:text-sm">
                  처음이 아니신가요?
                  <span className="ml-1 text-orange-500">회원가입 하기</span>
                </p>
              </div>

              <div className="mt-4 flex w-full max-w-[500px] justify-center gap-2 md:mt-6 md:gap-3">
                <button className="flex flex-1 items-center justify-center rounded-xl bg-green-500 px-3 py-2.5 text-xs font-medium text-white transition-colors hover:bg-green-600 md:px-4 md:py-3 md:text-sm lg:text-base">
                  <span className="mr-2 font-bold">N</span>
                  네이버 로그인
                </button>
                <button className="flex flex-1 items-center justify-center rounded-xl bg-yellow-400 px-3 py-2.5 text-xs font-medium text-black transition-colors hover:bg-yellow-500 md:px-4 md:py-3 md:text-sm lg:text-base">
                  <div className="pr-4">
                    <img
                      src={kakaoSymbolImg}
                      alt="카카오심볼"
                      className="w-5 object-contain"
                    />
                  </div>
                  카카오 로그인
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 모바일 레이아웃 */}
      <div className="flex flex-col lg:hidden">
        {/* 상단 - 스포트라이트와 로고 */}
        <div className="relative flex flex-1 flex-col items-center justify-center">
          <img
            src={spotlightWithLogoImg}
            alt=""
            className="w-64 object-cover"
          />
        </div>

        {/* 중간 - 로그인 폼 */}
        <div className="flex justify-center px-4 pb-4 md:mx-10">
          <div className="w-[600px] rounded-3xl bg-white p-6 shadow-2xl md:mt-14">
            <div className="mb-6 text-center">
              <h1 className="mb-2 text-xl font-bold text-gray-800">
                지금 바로 POPCO에 입장해요 !
              </h1>
              <p className="text-sm text-gray-600">로그인 하시겠어요?</p>
            </div>

            <form className="space-y-3">
              <div>
                <label className="mb-2 block text-xs text-gray-700">
                  이메일
                </label>
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full rounded-xl border-0 bg-gray-100 px-3 py-3 text-sm text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs text-gray-700">
                  비밀번호
                </label>
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full rounded-xl border-0 bg-gray-100 px-3 py-3 text-sm text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full rounded-xl bg-yellow-400 px-4 py-3 text-sm font-medium text-black transition-colors hover:bg-yellow-500"
                >
                  로그인
                </button>
              </div>
            </form>

            <div className="mt-4 text-center">
              <p className="text-xs text-gray-600">
                처음이 아니신가요?
                <a href="/register" className="ml-1 text-orange-500">
                  회원가입 하기
                </a>
              </p>
            </div>

            <div className="mt-4 flex gap-2">
              <button className="flex flex-1 items-center justify-center rounded-xl bg-green-500 px-3 py-2.5 text-xs font-medium text-white transition-colors hover:bg-green-600">
                <span className="mr-2 font-bold">N</span>
                네이버 로그인
              </button>
              <button className="flex flex-1 items-center justify-center rounded-xl bg-yellow-400 px-3 py-2.5 text-xs font-medium text-black transition-colors hover:bg-yellow-500">
                <div className="pr-4">
                  <img
                    src={kakaoSymbolImg}
                    alt="카카오심볼"
                    className="w-5 object-contain"
                  />
                </div>
                카카오 로그인
              </button>
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

export default LoginPage;
