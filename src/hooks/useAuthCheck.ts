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
      console.log("🔍 useAuthCheck 시작");

      try {
        setIsLoading(true);
        console.log("1️⃣ validateAndRefreshTokens 호출");
        const result = await validateAndRefreshTokens();

        console.log("1️⃣ result:", result);
        console.log("1️⃣ result.result:", result?.result);
        console.log("1️⃣ result.data:", result?.data);

        if (result.result === "INVALID_REFRESH_TOKEN") {
          console.log("❌ 토큰 만료");
          alert(
            "로그인 세션이 만료되어 로그아웃되었습니다. 다시 로그인 해주세요.",
          );
          setUser({ id: "", nickname: "", isLoggedIn: false });
          setAccessToken(null);
          navigate("/login");
          return;
        } else {
          console.log("2️⃣ result.data.accessToken:", result?.data?.accessToken);
          const token = result.data.accessToken;
          console.log("2️⃣ token:", token);
          setAccessToken(token);

          // 토큰이 있으면 사용자 정보 가져오기
          try {
            console.log("3️⃣ getUserDetail 호출");
            const userInfo = await getUserDetail(token);
            console.log("3️⃣ userInfo:", userInfo);

            setUser({
              id: userInfo.id || "",
              nickname: userInfo.nickname || "",
              isLoggedIn: true,
            });
            console.log("✅ 사용자 정보 가져오기 성공", userInfo);
          } catch (userError) {
            console.error("❌ 사용자 정보 가져오기 실패:", userError);
            setUser({ id: "", nickname: "", isLoggedIn: false });
            setAccessToken(null);
          }
        }
      } catch (error) {
        console.error("❌ 토큰 확인 실패:", error);
        setUser({ id: "", nickname: "", isLoggedIn: false });
        setAccessToken(null);
      } finally {
        setIsLoading(false);
        console.log("🔍 useAuthCheck 완료");
      }
    };

    checkAuth();
  }, [navigate]);

  return { user, accessToken, isLoading };
};

export default useAuthCheck;
