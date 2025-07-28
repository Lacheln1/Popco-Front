// hooks/useAuthCheck.ts
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { validateAndRefreshTokens } from "@/apis/tokenApi";

const useAuthCheck = () => {
  const navigate = useNavigate();
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const result = await validateAndRefreshTokens();

        if (result.result == "REFRESH_TOKEN_EXPIRED") {
          alert(
            "로그인 세션이 만료되어 로그아웃되었습니다. 다시 로그인 해주세요.",
          );
          navigate("/login");
          return;
        } else {
          const token = result.data.accessToken;
          setAccessToken(token);
        }
      } catch (error) {
        console.error("토큰이 없음:", error);
      }
    };

    checkAuth();
  }, [navigate]);
  return accessToken;
};

export default useAuthCheck;
