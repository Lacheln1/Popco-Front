import React, { useState } from "react";
import { ExclamationCircleOutlined } from "@ant-design/icons";

const RegisterForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [checkPassword, setCheckPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    //회원가입 로직
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
    </>
  );
};

export default RegisterForm;
