import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { App } from "antd";
import { validateAndRefreshTokens, clearTokens } from "@/apis/tokenApi";
import { getUserDetail } from "@/apis/userApi";

interface User {
  userId: number;
  email: string;
  nickname: string;
  profileImageUrl: string;
  isLoggedIn: boolean;
  profileComplete: boolean;
}

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
  const hasChecked = useRef(false);

  useEffect(() => {
    // 이미 검사를 실행했다면, 즉시 함수를 종료하여 중복 실행을 막음
    if (hasChecked.current) return;

    const checkAuth = async () => {
      // 검사를 시작했음을 기록
      hasChecked.current = true;
      
      const currentPath = location.pathname;
      const needsAuth = isProtectedRoute(currentPath);

      try {
        setIsLoading(true);
        const result = await validateAndRefreshTokens();

        if (result.result === "INVALID_REFRESH_TOKEN") {
          if (needsAuth) {
            alert("로그인이 필요한 페이지입니다. 로그인 해주세요.");
            navigate("/login", { state: { from: currentPath } });
          }
          return;
        }

        const token = result.data.accessToken;
        setAccessToken(token);

        if (token) {
          try {
            const userInfo = await getUserDetail(token);
            
            if (userInfo && userInfo.data) {
              const isProfileComplete = userInfo.data.profileComplete;
              setUser({
                userId: userInfo.data.userId || 0,
                email: userInfo.data.email || "",
                nickname: userInfo.data.nickname || "",
                profileImageUrl: userInfo.data.profileImageUrl || "",
                isLoggedIn: true,
                profileComplete: isProfileComplete,
              });

              // ✅ 임시 비활성화: 백엔드 오류로 취향 진단 페이지로 강제 이동하는 로직을 주석 처리합니다.
              // if (!isProfileComplete && currentPath !== "/test") {
              //   message.info("취향 진단을 먼저 완료해주세요.");
              //   navigate("/test");
              // }
            } else { // 신규 사용자
              setUser(prev => ({ ...prev, isLoggedIn: true, profileComplete: false }));
              // ✅ 임시 비활성화: 백엔드 오류로 취향 진단 페이지로 강제 이동하는 로직을 주석 처리합니다.
              // if (currentPath !== "/test") {
              //   message.info("환영합니다! 취향 진단을 먼저 진행해주세요.");
              //   navigate("/test");
              // }
            }
          } catch (userError) { // 신규 사용자
            console.error("사용자 정보 가져오기 실패 (신규 사용자일 수 있음):", userError);
            setUser(prev => ({ ...prev, isLoggedIn: true, profileComplete: false }));
            // ✅ 임시 비활성화: 백엔드 오류로 취향 진단 페이지로 강제 이동하는 로직을 주석 처리합니다.
            // if (currentPath !== "/test") {
            //   message.info("환영합니다! 취향 진단을 먼저 진행해주세요.");
            //   navigate("/test");
            // }
          }
        } else {
          throw new Error("유효한 accessToken을 받지 못했습니다.");
        }
      } catch (error) {
        console.error("❌ 토큰 확인 실패:", error);
        if (needsAuth) {
          navigate("/login", { state: { from: currentPath } });
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [navigate, location.pathname, message]);

  const logout = async () => {
    // 서버에 로그아웃 요청을 보내 HttpOnly 쿠키를 삭제
    await clearTokens();

    // 클라이언트 상태를 초기화
    setUser({
      userId: 0,
      email: "",
      nickname: "",
      profileImageUrl: "",
      isLoggedIn: false,
      profileComplete: false,
    });
    setAccessToken(null);
    
    // 다음 인증 검사가 정상적으로 실행되도록 ref를 초기화
    hasChecked.current = false;

    // 로그인이 필요한 페이지에 있었다면 메인으로 이동
    const currentPath = location.pathname;
    if (isProtectedRoute(currentPath)) {
      navigate("/");
    }
  };

  return { user, accessToken, isLoading, logout };
};

export default useAuthCheck;