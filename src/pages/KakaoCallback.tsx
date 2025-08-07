import axios from "axios";
// useRef를 import 목록에 추가합니다.
import React, { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Spin, App } from "antd";

const API_URL = import.meta.env.VITE_BACK_URL;

const KakaoCallback: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { message } = App.useApp();

  //이중 실행을 방지하기 위한 Ref
  const processingRef = useRef(false);

  useEffect(() => {
    const handleKakaoCallback = async () => {
      sessionStorage.removeItem("manualLogout");

      const urlParams = new URLSearchParams(location.search);
      const code = urlParams.get("code");

      if (!code) {
        message.error("카카오 인증 코드를 받지 못했습니다.");
        navigate("/login");
        return;
      }

      try {
        const response = await axios.post(
          `${API_URL}/auth/kakao/login?code=${code}`,
        );
        const result = response.data;

        if (result && result.result === "SUCCESS" && result.data) {
          const { userId, jwtResponseDto, profileComplete } = result.data;
          const accessToken = jwtResponseDto.accessToken;

          if (!accessToken || !userId) {
            throw new Error(
              "서버 응답에 accessToken 또는 userId가 누락되었습니다.",
            );
          }

          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("userId", String(userId));
          localStorage.setItem("profileComplete", String(profileComplete));

          if (result.message === "SIGNUP" || !profileComplete) {
            message.info("환영합니다! 취향 진단을 먼저 진행해주세요.");
            navigate("/test");
          } else {
            message.success("카카오로 로그인되었습니다!");
            navigate("/home");
          }
        } else {
          throw new Error(
            result.message || "알 수 없는 서버 오류가 발생했습니다.",
          );
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "알 수 없는 오류";
        console.error("카카오 로그인 처리 중 오류 발생:", errorMessage);
        message.error(`로그인 처리 중 오류가 발생했습니다: ${errorMessage}`);
        navigate("/login");
      }
    };

    if (processingRef.current) {
      return;
    }
    processingRef.current = true;
    handleKakaoCallback();
  }, [location, navigate, message]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Spin tip="카카오 로그인 처리 중..." size="large">
        <div className="p-12" />
      </Spin>
    </div>
  );
};

export default KakaoCallback;
