import React, { useState } from "react";
import { loginUser } from "@/apis/userApi.ts";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import {
  formVariants,
  itemVariants,
  shakeVariants,
  buttonVariants,
} from "@/components/LoginResgisterPage/Animation";
import { useNavigate } from "react-router-dom";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let hasError = false;

    if (!email) {
      setEmailError("이메일을 입력해주세요.");
      hasError = true;
    } else {
      setEmailError("");
    }

    if (!password) {
      setPasswordError("비밀번호를 입력해주세요.");
      hasError = true;
    } else {
      setPasswordError("");
    }

    if (hasError) return;

    try {
      const result = await loginUser({ email, password });

      if (result.data) {
        navigate("/");
        console.log("로그인 성공");
        console.log(result.data);
      } else {
        alert("아이디 또는 비밀번호 오류입니다");
      }
    } catch (error) {
      console.error("로그인 오류", error);
      alert("로그인에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <>
      <motion.form
        className="flex flex-col items-center space-y-3 md:space-y-4"
        variants={formVariants}
        initial="hidden"
        animate="visible"
        onSubmit={handleSubmit}
      >
        <motion.div className="w-full max-w-[500px]" variants={itemVariants}>
          <label className="mb-2 ml-4 block text-xs text-black md:text-base">
            이메일
          </label>
          <motion.div
            animate={emailError ? "shake" : undefined}
            variants={shakeVariants}
          >
            <input
              value={email}
              type="email"
              placeholder="Email Address"
              onChange={(e) => {
                setEmail(e.target.value);
                if (e.target.value) setEmailError("");
              }}
              className={`white w-full rounded-[40px] border-0 px-3 py-3 font-medium text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ffd751] md:px-4 md:py-4 ${
                emailError ? "border-2 border-red-400" : ""
              }`}
            />
          </motion.div>
          {emailError && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-popcorn-box ml-4 mt-2 flex justify-start text-xs"
            >
              <ExclamationCircleOutlined className="mr-1" /> {emailError}
            </motion.p>
          )}
        </motion.div>

        <motion.div className="w-full max-w-[500px]" variants={itemVariants}>
          <label className="mb-2 ml-4 block text-xs text-black md:text-base">
            비밀번호
          </label>
          <motion.div
            animate={passwordError ? "shake" : undefined}
            variants={shakeVariants}
          >
            <input
              value={password}
              type="password"
              placeholder="Password"
              onChange={(e) => {
                setPassword(e.target.value);
                if (e.target.value) setPasswordError("");
              }}
              className={`w-full rounded-[40px] border-0 bg-white px-3 py-3 text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ffd751] md:px-4 md:py-4 ${
                passwordError ? "border-2 border-red-500" : ""
              }`}
            />
          </motion.div>
          {passwordError && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-popcorn-box ml-4 mt-2 flex justify-start text-xs"
            >
              <ExclamationCircleOutlined className="mr-1" /> {passwordError}
            </motion.p>
          )}
        </motion.div>

        <motion.div
          className="w-full max-w-[500px] pt-3 md:pt-4"
          variants={itemVariants}
        >
          <motion.button
            type="submit"
            className="bg-popco-main pretendard w-full rounded-[400px] px-4 py-3 text-xl font-medium text-black transition-colors hover:bg-yellow-400 md:py-4"
            variants={buttonVariants}
            whileTap="tap"
          >
            로그인
          </motion.button>
        </motion.div>
      </motion.form>
    </>
  );
};

export default LoginForm;
