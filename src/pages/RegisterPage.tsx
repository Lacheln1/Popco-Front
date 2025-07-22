import React from "react";
import spotlightImg from "@/assets/spotlight.svg";
import spotlightWithLogoImg from "@/assets/spotlight-with-logo.svg";
import loginPopcoImg from "@/assets/login-popco.svg";
import RegisterForm from "@/components/LoginResgisterPage/RegisterForm";

const RegisterPage: React.FC = () => {
  return (
    <main className="relative h-full bg-[#0F1525]">
      {/* 데스크탑 */}
      <div className="mx-2 hidden min-h-screen justify-center lg:flex lg:items-start">
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
        <div className="flex w-full items-center justify-center lg:mt-[75px] xl:mr-32 xl:mt-[98px]">
          <div className="relative ml-4 flex h-full w-full max-w-[600px] flex-col items-center rounded-3xl bg-gray-100 p-6 opacity-95 shadow-2xl md:mt-8 md:h-[550px] md:max-w-[800px] lg:h-[680px]">
            <img
              src={spotlightImg}
              alt=""
              className="absolute left-1/2 w-[200px] -translate-x-1/2 object-cover lg:top-[-125px] lg:w-[440px] xl:top-[-150px] xl:w-[520px]"
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

              <RegisterForm />

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

            <RegisterForm />

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
