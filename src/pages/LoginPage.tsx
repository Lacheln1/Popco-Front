import React from "react";
import spotlightImg from "@/assets/spotlight.svg";
import spotlightWithLogoImg from "@/assets/spotlight-with-logo.svg";
import loginPopcoImg from "@/assets/login-popco.svg";

const LoginPage: React.FC = () => {
  return (
    <main className="relative min-h-screen bg-slate-900">
      {/* 데스크탑 레이아웃 */}
      <div className="hidden min-h-screen justify-center md:flex">
        {/* 로그인 화면 왼쪽 팝콘 로고 + 캐릭터들 섹션 */}
        <div className="ml-8 flex w-full justify-end lg:ml-36">
          <div className="fixed flex flex-col items-center">
            <img
              src={spotlightWithLogoImg}
              alt=""
              className="w-[475px] object-cover"
            />

            <img src={loginPopcoImg} alt="" className="mr-3 mt-28 w-[675px]" />
          </div>
        </div>

        {/* 로그인 화면 오른쪽 로그인 폼 */}
        <div className="mr-8 flex w-full items-center justify-center lg:mr-36">
          <div className="flex h-[770px] w-[800px] flex-col justify-center rounded-3xl bg-white p-8 shadow-2xl">
            <div className="w-full">
              <div className="mb-8 text-center">
                <h1 className="mb-2 text-2xl font-bold text-gray-800">
                  지금 바로 POPCO에 입장해요 !
                </h1>
                <p className="text-base text-gray-600">로그인 하시겠어요?</p>
              </div>

              <form className="space-y-4">
                <div className="">
                  <label className="mb-2 block text-sm text-gray-700">
                    이메일
                  </label>
                  <input
                    type="email"
                    placeholder="Email Address"
                    className="w-full rounded-xl border-0 bg-gray-100 px-4 py-4 text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                </div>

                <div className="">
                  <label className="mb-2 block text-sm text-gray-700">
                    비밀번호
                  </label>
                  <input
                    type="password"
                    placeholder="Password"
                    className="w-full rounded-xl border-0 bg-gray-100 px-4 py-4 text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full rounded-xl bg-yellow-400 px-4 py-4 font-medium text-black transition-colors hover:bg-yellow-500"
                  >
                    로그인
                  </button>
                </div>
              </form>

              <div className="t mt-6">
                <p className="text-sm text-gray-600">
                  처음이 아니신가요?
                  <span className="ml-1 text-orange-500">회원가입 하기</span>
                </p>
              </div>

              <div className="mt-6 flex gap-3">
                <button className="flex flex-1 items-center justify-center rounded-xl bg-green-500 px-4 py-3 font-medium text-white transition-colors hover:bg-green-600">
                  <span className="mr-2 font-bold">N</span>
                  네이버 로그인
                </button>
                <button className="flex flex-1 items-center justify-center rounded-xl bg-yellow-400 px-4 py-3 font-medium text-black transition-colors hover:bg-yellow-500">
                  <span className="mr-2">💬</span>
                  카카오 로그인
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 모바일 레이아웃 */}
      <div className="flex min-h-screen flex-col md:hidden">
        {/* 상단 - 스포트라이트와 로고 */}
        <div className="relative flex flex-1 flex-col items-center justify-center">
          <img
            src={spotlightWithLogoImg}
            alt=""
            className="w-64 object-cover"
          />
        </div>

        {/* 중간 - 로그인 폼 */}
        <div className="px-4 pb-4">
          <div className="w-full rounded-3xl bg-white p-6 shadow-2xl">
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
                <span className="ml-1 text-orange-500">회원가입 하기</span>
              </p>
            </div>

            <div className="mt-4 flex gap-2">
              <button className="flex flex-1 items-center justify-center rounded-xl bg-green-500 px-3 py-2.5 text-xs font-medium text-white transition-colors hover:bg-green-600">
                <span className="mr-2 font-bold">N</span>
                네이버 로그인
              </button>
              <button className="flex flex-1 items-center justify-center rounded-xl bg-yellow-400 px-3 py-2.5 text-xs font-medium text-black transition-colors hover:bg-yellow-500">
                <span className="mr-2">💬</span>
                카카오 로그인
              </button>
            </div>
          </div>
        </div>

        {/* 하단 - 캐릭터들 */}
        <div className="flex flex-1 items-end justify-center pb-8">
          <img src={loginPopcoImg} alt="" className="w-72" />
        </div>
      </div>
    </main>
  );
};

export default LoginPage;
