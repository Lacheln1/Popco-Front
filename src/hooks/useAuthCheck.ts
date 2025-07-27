import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { validateAndRefreshTokens } from "@/apis/tokenApi";
import { getUserDetail } from "@/apis/userApi";

interface User {
  id: string;
  nickname: string;
  isLoggedIn: boolean;
}

const useAuthCheck = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User>({
    id: "",
    nickname: "",
    isLoggedIn: false,
  });
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        const result = await validateAndRefreshTokens();

        if (result.result === "REFRESH_TOKEN_EXPIRED") {
          alert(
            "로그인 세션이 만료되어 로그아웃되었습니다. 다시 로그인 해주세요.",
          );
          setUser({ id: "", nickname: "", isLoggedIn: false });
          setAccessToken(null);
          navigate("/login");
          return;
        } else {
          const token = result.data.accessToken;
          setAccessToken(token);

          // 토큰이 있으면 사용자 정보 가져오기
          try {
            const userInfo = await getUserDetail(token);
            setUser({
              id: userInfo.id || "",
              nickname: userInfo.nickname || "",
              isLoggedIn: true,
            });
          } catch (userError) {
            console.error("사용자 정보 가져오기 실패:", userError);
            setUser({ id: "", nickname: "", isLoggedIn: false });
            setAccessToken(null);
          }
        }
      } catch (error) {
        console.error("토큰 확인 실패:", error);
        setUser({ id: "", nickname: "", isLoggedIn: false });
        setAccessToken(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  return { user, accessToken, isLoading };
};

export default useAuthCheck;
