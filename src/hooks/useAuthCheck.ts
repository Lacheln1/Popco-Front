import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { App } from "antd";
import { jwtDecode } from "jwt-decode";
import { validateAndRefreshTokens, clearTokens } from "@/apis/tokenApi";
import { getUserDetail } from "@/apis/userApi";

// 사용자 정보 인터페이스
interface User {
  userId: number;
  email: string;
  nickname: string;
  profileImageUrl: string;
  isLoggedIn: boolean;
  profileComplete: boolean;
}

// JWT 페이로드 인터페이스
interface JwtPayload {
  sub: string;
}

// 인증이 필요한 페이지 경로 목록
const PROTECTED_ROUTES = ["/analysis", "/mypage"];
const isProtectedRoute = (pathname: string): boolean => {
  return PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/"),
  );
};

const useAuthCheck = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { message } = App.useApp();

  const [user, setUser] = useState<User>({
    userId: 0,
    email: "",
    nickname: "",
    profileImageUrl: "",
    isLoggedIn: false,
    profileComplete: false,
  });
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      // --- 1. 수동 로그아웃 확인 ---
      if (sessionStorage.getItem("manualLogout") === "true") {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      // --- 2. 임시 상태 확인 ---
      const profileJustCompleted = sessionStorage.getItem("profileJustCompleted");
      const profileCompletedAtLogin = localStorage.getItem("profileComplete");
      const currentPath = location.pathname;
      const needsAuth = isProtectedRoute(currentPath);

      try {
        // --- 3. 토큰 확인 및 갱신 ---
        let token = localStorage.getItem("accessToken");

        if (!token) {
          const result = await validateAndRefreshTokens();
          if (result.result === "INVALID_REFRESH_TOKEN") {
            if (needsAuth) navigate("/login", { state: { from: currentPath } });
            return;
          }
          token = result.data?.accessToken;
          if (token) localStorage.setItem("accessToken", token);
        }

        if (token) {
          // 토큰 만료 시간 확인 및 필요시 갱신
          const decodedForExp = jwtDecode<{ exp?: number }>(token);
          if (decodedForExp.exp && decodedForExp.exp < Date.now() / 1000) {
            localStorage.removeItem("accessToken");
            const refreshResult = await validateAndRefreshTokens();
            token = refreshResult.data?.accessToken;
            if (token) localStorage.setItem("accessToken", token);
            else throw new Error("토큰 갱신 실패");
          }

          setAccessToken(token);
          const decoded = jwtDecode<JwtPayload>(token);
          const userIdFromToken = Number(decoded.sub);
          if (!userIdFromToken || isNaN(userIdFromToken)) throw new Error("토큰에서 유효한 사용자 ID(sub)를 찾을 수 없습니다.");
          
          // --- 4. 초기 상태 설정 및 리디렉션 ---
          const isProfileComplete = 
              profileCompletedAtLogin === "true" || 
              profileJustCompleted === "true";

          setUser(prev => ({
            ...prev, 
            userId: userIdFromToken, 
            isLoggedIn: true,
            profileComplete: isProfileComplete
          }));
          
          if (isProfileComplete && currentPath === "/test") {
            message.info("이미 취향 진단을 완료했습니다.");
            navigate("/");
          } else if (!isProfileComplete && currentPath !== "/test") {
            message.info("취향 진단을 먼저 완료해주세요.");
            navigate("/test");
          }

          // --- 5. 최종 사용자 정보 동기화 ---
          try {
            const userInfo = await getUserDetail(token);
            if (userInfo && userInfo.data) {
              setUser(prev => ({ 
                ...prev, 
                email: userInfo.data.email || "",
                nickname: userInfo.data.nickname || "",
                profileImageUrl: userInfo.data.profileImageUrl || "",
                profileComplete: userInfo.data.profileComplete 
              }));
              
              if(userInfo.data.profileComplete) {
                localStorage.removeItem("profileComplete");
                sessionStorage.removeItem("profileJustCompleted");
              }
            }
          } catch (userDetailError) {
              console.warn("사용자 상세 정보 가져오기 실패 (네트워크 등):", userDetailError);
          }
        } else {
          if (needsAuth) navigate("/login", { state: { from: currentPath } });
        }
      } catch (error) {
        console.error("❌ 인증 체크 중 예상치 못한 오류:", error);
        localStorage.removeItem("accessToken");
        if (needsAuth) navigate("/login", { state: { from: currentPath } });
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [location.pathname, navigate, message]);


  const logout = async () => {
    try {
      // 서버에 로그아웃 요청 (토큰 무효화 등)
      await clearTokens();
    } catch (error) {
      console.error("서버 로그아웃 실패:", error);
    } finally {
      // 클라이언트 측의 모든 인증 정보 제거
      localStorage.removeItem("accessToken");
      localStorage.removeItem("userId");
      localStorage.removeItem("profileComplete");
      sessionStorage.removeItem("profileJustCompleted");
      
      sessionStorage.setItem("manualLogout", "true");

      message.success("로그아웃되었습니다.");

      setTimeout(() => {
        window.location.href = "/";
      }, 500); 
    }
  };

  return { user, accessToken, isLoading, logout };
};

export default useAuthCheck;
