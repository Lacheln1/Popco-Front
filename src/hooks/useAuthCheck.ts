<<<<<<< HEAD
// src/hooks/useAuthCheck.ts

=======
>>>>>>> e8b123ec49f1d1e732f452ac5971d6fb80037be5
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { App } from "antd";
import { validateAndRefreshTokens } from "@/apis/tokenApi";
import { getUserDetail } from "@/apis/userApi";

interface User {
  id: string;
  nickname: string;
  isLoggedIn: boolean;
}

const useAuthCheck = () => {
  const navigate = useNavigate();
<<<<<<< HEAD
  const { message } = App.useApp();
=======
  const [user, setUser] = useState<User>({
    id: "",
    nickname: "",
    isLoggedIn: false,
  });
>>>>>>> e8b123ec49f1d1e732f452ac5971d6fb80037be5
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      console.log("🔍 useAuthCheck 시작");

      try {
        setIsLoading(true);
        console.log("1️⃣ validateAndRefreshTokens 호출");
        const result = await validateAndRefreshTokens();

<<<<<<< HEAD
        if (result.result === "REFRESH_TOKEN_EXPIRED") {
          message.error(
            "로그인 세션이 만료되었습니다. 다시 로그인 해주세요.",
            2, // 2초 후 사라짐
            () => navigate("/login"), // 메시지 사라진 후 콜백으로 페이지 이동
          );
=======
        console.log("1️⃣ result:", result);
        console.log("1️⃣ result.result:", result?.result);
        console.log("1️⃣ result.data:", result?.data);

        if (result.result === "REFRESH_TOKEN_EXPIRED") {
          console.log("❌ 토큰 만료");
          alert(
            "로그인 세션이 만료되어 로그아웃되었습니다. 다시 로그인 해주세요.",
          );
          setUser({ id: "", nickname: "", isLoggedIn: false });
          setAccessToken(null);
          navigate("/login");
>>>>>>> e8b123ec49f1d1e732f452ac5971d6fb80037be5
          return;
        } else if (result.data.accessToken) {
          // 성공 시 access token을 state에 저장하여 반환
          setAccessToken(result.data.accessToken);
        } else {
<<<<<<< HEAD
          // 그 외의 실패 케이스
          throw new Error("유효한 토큰을 받지 못했습니다.");
        }
      } catch (error) {
        console.error("인증 확인 중 에러 발생:", error);
        navigate("/login"); // 인증 실패 시 로그인 페이지로 이동
=======
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
>>>>>>> e8b123ec49f1d1e732f452ac5971d6fb80037be5
      }
    };

    checkAuth();
<<<<<<< HEAD
  }, [navigate, message]);

  // 유효한 Access Token 또는 null을 반환
  return accessToken;
=======
  }, [navigate]);

  return { user, accessToken, isLoading };
>>>>>>> e8b123ec49f1d1e732f452ac5971d6fb80037be5
};

export default useAuthCheck;
