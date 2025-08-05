import React, { useEffect, useState } from "react";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import {
  formVariants,
  itemVariants,
  shakeVariants,
} from "@/components/LoginResgisterPage/Animation";
import { checkEmail, registerUser } from "@/apis/userApi";
import { useNavigate } from "react-router-dom";
import { App } from "antd";

const RegisterForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [checkPassword, setCheckPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [checkPasswordError, setCheckPasswordError] = useState("");

  const [checkEmailValue, setCheckEmailValue] = useState(false); // 이메일 중복 체크

  const navigate = useNavigate();
  const { message } = App.useApp();

  useEffect(() => {
    const resetCheckEmailValue = () => {
      setCheckEmailValue(false);
    };
    resetCheckEmailValue();
  }, []);

  // 이메일 형식 검증 함수
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // 비밀번호 형식 검증 함수 (4자 이상 영문,숫자 혼합)
  const validatePassword = (password: string): boolean => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{4,}$/;
    return passwordRegex.test(password);
  };

  // 로그인 버튼 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let hasError = false;

    // 이메일 검증
    if (!email) {
      setEmailError("이메일을 입력해주세요.");
      hasError = true;
    } else if (!validateEmail(email)) {
      setEmailError("올바른 이메일 형식을 입력해주세요.");
      hasError = true;
    } else {
      setEmailError("");
    }

    // 비밀번호 검증
    if (!password) {
      setPasswordError("비밀번호를 입력해주세요.");
      hasError = true;
    } else if (!validatePassword(password)) {
      setPasswordError("비밀번호는 4자 이상 영문, 숫자 혼합으로 입력해주세요.");
      hasError = true;
    } else {
      setPasswordError("");
    }

    // 비밀번호 확인 검증
    if (!checkPassword) {
      setCheckPasswordError("비밀번호를 한번 더 입력해주세요.");
      hasError = true;
    } else if (password !== checkPassword) {
      setCheckPasswordError("비밀번호가 일치하지 않습니다.");
      hasError = true;
    } else {
      setCheckPasswordError("");
    }

    // 이메일 중복 확인 검증
    if (!checkEmailValue) {
      message.error("이메일 중복확인을 해주세요.");
      hasError = true;
    }

    if (hasError) return;

    try {
      const result = await registerUser({ email, password });

      if (result.code == "200") {
        message.success(
          "회원가입이 완료되었습니다. 가입 한 계정으로 로그인 해주세요.",
        );
        navigate("/login");
      }

      if (result.code == "409") {
        message.error("이미 가입된 회원입니다");
        navigate("/login");
      }
    } catch (error) {
      console.log("회원가입 실패", error);
      message.error("회원가입에 실패했습니다. 관리자에게 문의하세요.");
      return;
    }
  };

  // 이메일 중복 확인 핸들러
  const handleCheckEmail = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      message.error("이메일을 입력해주세요.");
      return;
    }

    if (!validateEmail(email)) {
      message.error("올바른 이메일 형식을 입력해주세요.");
      return;
    }

    try {
      const result = await checkEmail({ email });
      if (result.data) {
        message.error("이미 존재하는 이메일입니다");
      } else {
        message.success("사용 가능한 이메일 입니다!");
        setCheckEmailValue(true);
      }
    } catch (error) {
      console.log("이메일 중복 확인 중 오류!", error);
      message.error("이메일 중복 확인에 실패했습니다. 관리자에게 문의하세요.");
      return;
    }
  };

  // 이메일 입력 변경 핸들러
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    setCheckEmailValue(false);

    if (value && !validateEmail(value)) {
      setEmailError("올바른 이메일 형식을 입력해주세요.");
    } else {
      setEmailError("");
    }
  };

  // 비밀번호 입력 변경 핸들러
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);

    if (value && !validatePassword(value)) {
      setPasswordError("비밀번호는 4~6자 영문, 숫자 혼합으로 입력해주세요.");
    } else {
      setPasswordError("");
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
              className={`mb-2 mr-4`}
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
            } `}
            onChange={handleEmailChange}
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
            비밀번호 (4자 이상 영문,숫자 혼합)
          </label>
          <motion.div
            animate={passwordError ? "shake" : undefined}
            variants={shakeVariants}
          >
            <input
              value={password}
              type="password"
              placeholder="Password"
              onChange={handlePasswordChange}
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
            animate={checkPasswordError ? "shake" : undefined}
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
              className={`w-full rounded-[40px] border-0 bg-white px-3 py-3 text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ffd751] md:px-4 md:py-4 ${
                checkPasswordError ? "border-2 border-red-500" : ""
              }`}
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
