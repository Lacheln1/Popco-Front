import React, { useState } from "react";
const API_URL = import.meta.env.VITE_BACK_URL;
import { loginUser } from "@/apis/userApi.ts";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let hasError = false;

    if (!email) {
      setEmailError("ⓘ 이메일을 입력해주세요.");
      hasError = true;
    } else {
      setEmailError("");
    }

    if (!password) {
      setPasswordError("ⓘ 비밀번호를 입력해주세요.");
      hasError = true;
    } else {
      setPasswordError("");
    }

    if (hasError) return;

    try {
      const result = await loginUser({ email, password });

      if (result.resultCode === 200) {
        localStorage.setItem("accessToken", result.data.accessToken);
        // url이동이나 기타 액션
        console.log("로그인 성공");
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("로그인 오류", error);
      alert("로그인에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <>
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
        </div>

        <div className="w-full max-w-[500px] pt-3 md:pt-4">
          <button
            type="submit"
            className="bg-popco-main w-full rounded-[400px] px-4 py-3 text-xl font-medium text-black transition-colors hover:bg-yellow-400 md:py-4"
          >
            로그인
          </button>
        </div>
      </form>
    </>
  );
};

export default LoginForm;
