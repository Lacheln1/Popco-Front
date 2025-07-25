import axios from "axios";
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_BACK_URL;

const KakaoCallback: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleKakaoCallback = async () => {
      try {
        const urlParams = new URLSearchParams(location.search);
        const code = urlParams.get("code");
        const error = urlParams.get("error");
        const errorDescription = urlParams.get("error_description");

        // 에러가 있는지 먼저 확인
        if (error) {
          throw new Error(`카카오 인증 에러: ${error} - ${errorDescription}`);
        }

        if (!code) {
          throw new Error("인증 코드를 받지 못했습니다.");
        }

        // 백엔드에 코드 전송
        const response = await axios.post(
          `${API_URL}/auth/kakao/login?code=${code}`,
        );
        const result = response.data;

        if (result.message == "SIGNUP") {
          navigate("/register", {
            state: {
              kakaoEmail: result.data.email,
            },
          });
        }

        if (result.message == "LOGIN") {
          if (result.data.profileComplete) {
            navigate("/");
          } else {
            navigate("/test");
          }
        }
      } catch (error) {
        alert(
          `로그인에 실패했습니다: ${error instanceof Error ? error.message : "알 수 없는 오류"}`,
        );
        navigate("/login");
      }
    };

    handleKakaoCallback();
  }, [location, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="mb-4">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
        </div>
        <h2 className="text-xl font-semibold text-gray-800">
          카카오 로그인 처리 중...
        </h2>
        <p className="text-gray-600">잠시만 기다려주세요.</p>
      </div>
    </div>
  );
};

export default KakaoCallback;
