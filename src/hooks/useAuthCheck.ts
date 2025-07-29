// src/hooks/useAuthCheck.ts

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { App } from "antd";
import { validateAndRefreshTokens } from "@/apis/tokenApi";

const useAuthCheck = () => {
  const navigate = useNavigate();
  const { message } = App.useApp();
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const result = await validateAndRefreshTokens();

        if (result.result === "REFRESH_TOKEN_EXPIRED") {
          message.error(
            "로그인 세션이 만료되었습니다. 다시 로그인 해주세요.",
            2, // 2초 후 사라짐
            () => navigate("/login"), // 메시지 사라진 후 콜백으로 페이지 이동
          );
          return;
        } else if (result.data.accessToken) {
          // 성공 시 access token을 state에 저장하여 반환
          setAccessToken(result.data.accessToken);
        } else {
          // 그 외의 실패 케이스
          throw new Error("유효한 토큰을 받지 못했습니다.");
        }
      } catch (error) {
        console.error("인증 확인 중 에러 발생:", error);
        navigate("/login"); // 인증 실패 시 로그인 페이지로 이동
      }
    };

    checkAuth();
  }, [navigate, message]);

  // 유효한 Access Token 또는 null을 반환
  return accessToken;
};

export default useAuthCheck;
