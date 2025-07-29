import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { validateAndRefreshTokens } from "@/apis/tokenApi";
import { getUserDetail } from "@/apis/userApi";

interface User {
  userId: number;
  email: string;
  nickname: string;
  profileImageUrl: string;
  isLoggedIn: boolean;
}

//로그인이 필요한 url들
const PROTECTED_ROUTES = ["/analysis", "/mypage"];

const isProtectedRoute = (pathname: string): boolean => {
  return PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/"),
  );
};

const useAuthCheck = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<User>({
    userId: 0,
    email: "",
    nickname: "",
    profileImageUrl: "",
    isLoggedIn: false,
  });
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      console.log("🔍 useAuthCheck 시작");
      const currentPath = location.pathname;
      const needsAuth = isProtectedRoute(currentPath);

      try {
        setIsLoading(true);
        console.log("1️⃣ validateAndRefreshTokens 호출");
        const result = await validateAndRefreshTokens();

        console.log("1️⃣ result:", result);
        console.log("1️⃣ result.result:", result?.result);
        console.log("1️⃣ result.data:", result?.data);

        if (result.result === "INVALID_REFRESH_TOKEN") {
          console.log("❌ 토큰 만료");

          //로그인이 필요한 url에 있다면 로그인 페이지로 이동
          if (needsAuth) {
            alert("로그인이 필요한 페이지입니다. 로그인 해주세요.");
            navigate("/login", {
              state: { from: currentPath }, // 로그인 후 돌아갈 경로 저장
            });
            return;
          }
          alert(
            "로그인 세션이 만료되어 로그아웃되었습니다. 다시 로그인 해주세요.",
          );
          setUser({
            userId: 0,
            email: "",
            nickname: "",
            profileImageUrl: "",
            isLoggedIn: false,
          });
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
            console.log("3️⃣ userInfo.data:", userInfo.data);
            console.log("3️⃣ userInfo.data의 각 필드 확인:");
            console.log("  - userInfo.data.userId:", userInfo.data?.userId);
            console.log("  - userInfo.data.email:", userInfo.data?.email);
            console.log("  - userInfo.data.nickname:", userInfo.data?.nickname);
            console.log(
              "  - userInfo.data.profileImageUrl:",
              userInfo.data?.profileImageUrl,
            );

            const newUserState = {
              userId: userInfo.data?.userId || 0,
              email: userInfo.data?.email || "",
              nickname: userInfo.data?.nickname || "",
              profileImageUrl: userInfo.data?.profileImageUrl || "",
              isLoggedIn: true,
            };

            console.log("3️⃣ 설정할 user 상태:", newUserState);
            setUser(newUserState);
            console.log("✅ 사용자 정보 가져오기 성공", userInfo);
          } catch (userError) {
            console.error("❌ 사용자 정보 가져오기 실패:", userError);

            //로그인이 필요한 url에서 사용자 정보를 가져오지 못했을 경우에만 로그인 페이지로 이동
            if (needsAuth) {
              navigate("/login", { state: { from: currentPath } });
              return;
            }

            setUser({
              userId: 0,
              email: "",
              nickname: "",
              profileImageUrl: "",
              isLoggedIn: false,
            });
            setAccessToken(null);
          }
        }
      } catch (error) {
        console.error("❌ 토큰 확인 실패:", error);
        setUser({
          userId: 0,
          email: "",
          nickname: "",
          profileImageUrl: "",
          isLoggedIn: false,
        });
        setAccessToken(null);
      } finally {
        setIsLoading(false);
        console.log("🔍 useAuthCheck 완료");
      }
    };

    checkAuth();
  }, [navigate, location.pathname]);

  const logout = () => {
    // 1. 로그아웃 플래그 설정 (다음 useAuthCheck 실행을 막음)
    sessionStorage.setItem("isLoggedOut", "true");

    // 2. 토큰 제거
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("accessToken");

    // 3. 상태 초기화
    setUser({
      userId: 0,
      email: "",
      nickname: "",
      profileImageUrl: "",
      isLoggedIn: false,
    });
    setAccessToken(null);

    // 4. 로그인 페이지로 이동
    navigate("/login");
  };

  return {
    user,
    accessToken,
    isLoading,
    logout,
  };
};

export default useAuthCheck;
