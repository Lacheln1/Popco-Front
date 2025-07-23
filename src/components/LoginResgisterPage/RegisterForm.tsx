import React, { useEffect, useState } from "react";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import {
  formVariants,
  itemVariants,
  shakeVariants,
} from "@/components/LoginResgisterPage/Animation";

const RegisterForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [checkPassword, setCheckPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [checkPasswordError, setCheckPasswordError] = useState("");

  const [checkEmailValue, setCheckEmailValue] = useState(false); // 이메일 중복 체크.

  useEffect(() => {
    const resetCheckEmailValue = () => {
      setCheckEmailValue(false);
    };
    resetCheckEmailValue();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
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

    if (!checkPassword) {
      setCheckPasswordError("비밀번호를 한번 더 입력해주세요.");
      hasError = true;
    } else {
      setCheckPasswordError("");
    }

    if (password != checkPassword) {
      setCheckPasswordError("비밀번호가 일치하지 않습니다.");
      hasError = true;
    } else {
      setCheckPasswordError("");
    }

    if (!checkEmailValue) {
      alert("이메일 중복확인을 해주세요.");
      hasError = true;
    } else {
      setCheckEmailValue(true);
    }

    if (hasError) return;

    if (!hasError) console.log("회원가입성공");

    //회원가입 로직
  };

  const handleCheckEmail = () => {
    if (!email) alert("이메일을 입력해주세요.");
    else {
      alert("중복확인완료");
      setCheckEmailValue(true);
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
          <div className="flex justify-between">
            <label className="mb-2 ml-4 block text-xs text-black md:text-base">
              이메일
            </label>
            <button
              type="button"
              className="mb-2 mr-4"
              onClick={handleCheckEmail}
            >
              중복 확인
            </button>
          </div>
          <input
            value={email}
            type="email"
            placeholder="Email Address"
            className={`white w-full rounded-[40px] border-0 px-3 py-3 font-medium text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ffd751] md:px-4 md:py-4 ${
              emailError ? "border-2 border-red-400" : ""
            }`}
            onChange={(e) => {
              setEmail(e.target.value);
              if (e.target.value) setEmailError("");
            }}
          />
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

        <motion.div className="w-full max-w-[500px]" variants={itemVariants}>
          <label className="mb-2 ml-4 block text-xs text-black md:text-base">
            비밀번호 확인
          </label>
          <motion.div
            animate={passwordError ? "shake" : undefined}
            variants={shakeVariants}
          >
            <input
              value={checkPassword}
              type="password"
              placeholder="Password"
              onChange={(e) => {
                setCheckPassword(e.target.value);
                if (e.target.value) setCheckPasswordError("");
              }}
              className={`} w-full rounded-[40px] border-0 bg-white px-3 py-3 text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ffd751] md:px-4 md:py-4`}
            />
          </motion.div>
          {checkPasswordError && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-popcorn-box ml-4 mt-2 flex justify-start text-xs"
            >
              <ExclamationCircleOutlined className="mr-1" />{" "}
              {checkPasswordError}
            </motion.p>
          )}
        </motion.div>

        <div className="w-full max-w-[500px] pt-3 md:pt-4">
          <button
            type="submit"
            className="bg-popco-main w-full rounded-[400px] px-4 py-3 text-xl font-medium text-black transition-colors hover:bg-yellow-400 md:py-4"
          >
            회원가입
          </button>
        </div>
      </motion.form>
    </>
  );
};

export default RegisterForm;
