// hooks/useAuthCheck.ts
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { validateAndRefreshTokens } from "@/apis/tokenApi";

const useAuthCheck = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      console.log("=== 페이지 토큰 검증 시작 ===");
      try {
        const result = await validateAndRefreshTokens();
        console.log("checkAuth훅의 result===", result);

        if (result.result == "REFRESH_TOKEN_EXPIRED") {
          alert(
            "로그인 세션이 만료되어 로그아웃되었습니다. 다시 로그인 해주세요.",
          );
          navigate("/login");
        }
      } catch (error) {
        console.error("토큰 검증 중 에러:", error);
        navigate("/login");
      }
    };

    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export default useAuthCheck;
