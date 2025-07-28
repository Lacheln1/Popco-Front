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

interface RegisterFormProps {
  kakaoEmail?: string;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ kakaoEmail }) => {
  const [email, setEmail] = useState(kakaoEmail || "");
  const [password, setPassword] = useState("");
  const [checkPassword, setCheckPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [checkPasswordError, setCheckPasswordError] = useState("");

  const [checkEmailValue, setCheckEmailValue] = useState(false); // 이메일 중복 체크
  const isKakaoEmail = Boolean(kakaoEmail); //카카오 이메일 여부 확인

  const navigate = useNavigate();

  useEffect(() => {
    const resetCheckEmailValue = () => {
      setCheckEmailValue(false);
      if (kakaoEmail) {
        setCheckEmailValue(true);
        setEmailError("");
      }
    };
    resetCheckEmailValue();
  }, [kakaoEmail]);

  // 로그인 버튼 핸들러
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

    try {
      const result = await registerUser({ email, password });

      if (result.code == "200") {
        alert("회원가입이 완료되었습니다. 가입 한 계정으로 로그인 해주세요.");
        navigate("/login");
      }

      if (result.code == "409") {
        alert("이미 가입된 회원입니다");
        navigate("/login");
      }
    } catch (error) {
      console.log("회원가입 실패", error);
    }
  };

  // 이메일 중복 확인 핸들러
  const handleCheckEmail = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isKakaoEmail) {
      return; //카카오 이메일인 경우 중복확인 버튼 클릭 방지
    }

    if (!email) {
      alert("이메일을 입력해주세요.");
      return;
    }

    try {
      const result = await checkEmail({ email });
      if (result.data) {
        alert("이미 존재하는 이메일입니다");
      } else {
        alert("사용 가능한 이메일 입니다!");
        setCheckEmailValue(true);
      }
    } catch (error) {
      console.log("이메일 중복 확인 중 오류!", error);
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
              이메일 {isKakaoEmail && <span>&nbsp;(카카오)</span>}
            </label>
            <button
              type="button"
              className={`mb-2 mr-4 ${isKakaoEmail ? "cursor-not-allowed" : ""}`}
              onClick={handleCheckEmail}
              disabled={isKakaoEmail}
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
            } ${isKakaoEmail ? "cursor-not-allowed" : ""}`}
            onChange={(e) => {
              if (!isKakaoEmail) {
                setEmail(e.target.value);
                setCheckEmailValue(false);
                if (e.target.value) setEmailError("");
              }
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
