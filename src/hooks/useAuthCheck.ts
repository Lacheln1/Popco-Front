import { useEffect, useState, useRef } from "react";
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
  exp?: number;
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
  const hasInitialized = useRef(false);

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
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const checkAuth = async () => {
      if (sessionStorage.getItem("manualLogout") === "true") {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      const currentPath = location.pathname;
      const needsAuth = isProtectedRoute(currentPath);

      try {
        let token = localStorage.getItem("accessToken");

        if (!token) {
          const result = await validateAndRefreshTokens();
          if (
            result?.result === "INVALID_REFRESH_TOKEN" ||
            !result?.data?.accessToken
          ) {
            if (needsAuth) navigate("/login", { state: { from: currentPath } });
            return;
          }
          token = result.data.accessToken;
          if (token) localStorage.setItem("accessToken", token);
        }

        //  token이 존재하는 경우만 처리
        if (!token) {
          if (needsAuth) navigate("/login", { state: { from: currentPath } });
          return;
        }

        //  새 변수에 string 타입으로 저장
        const validToken: string = token;

        // 토큰 만료 시간 확인 및 필요시 갱신
        const decodedForExp = jwtDecode<JwtPayload>(validToken);
        if (decodedForExp.exp && decodedForExp.exp < Date.now() / 1000) {
          localStorage.removeItem("accessToken");
          const refreshResult = await validateAndRefreshTokens();
          if (refreshResult?.data?.accessToken) {
            const newToken = refreshResult.data.accessToken;
            localStorage.setItem("accessToken", newToken);

            //  새 토큰으로 계속 진행
            setAccessToken(newToken);
            const decoded = jwtDecode<JwtPayload>(newToken);
            const userIdFromToken = Number(decoded.sub);

            if (!userIdFromToken || isNaN(userIdFromToken)) {
              throw new Error(
                "토큰에서 유효한 사용자 ID(sub)를 찾을 수 없습니다.",
              );
            }

            // 프로필 완료 상태 확인
            let profileComplete = false;
            const justCompleted =
              sessionStorage.getItem("profileJustCompleted") === "true";
            const loginProfileComplete =
              localStorage.getItem("profileComplete") === "true";
            profileComplete = justCompleted || loginProfileComplete;

            try {
              const userInfo = await getUserDetail(newToken);

              if (userInfo && userInfo.data) {
                setUser({
                  userId: userIdFromToken,
                  email: userInfo.data.email || "",
                  nickname: userInfo.data.nickname || "",
                  profileImageUrl: userInfo.data.profileImageUrl || "",
                  isLoggedIn: true,
                  profileComplete: profileComplete,
                });
              } else {
                setUser({
                  userId: userIdFromToken,
                  email: "",
                  nickname: "",
                  profileImageUrl: "",
                  isLoggedIn: true,
                  profileComplete: profileComplete,
                });
              }
            } catch (userDetailError) {
              console.error(
                "🔍 사용자 상세 정보 가져오기 실패:",
                userDetailError,
              );
              setUser({
                userId: userIdFromToken,
                email: "",
                nickname: "",
                profileImageUrl: "",
                isLoggedIn: true,
                profileComplete: profileComplete,
              });
            }

            if (profileComplete) {
              if (currentPath === "/test") {
                message.info("이미 취향 진단을 완료했습니다.");
                navigate("/home");
                return;
              }
              sessionStorage.removeItem("profileJustCompleted");
            } else {
              if (currentPath !== "/test") {
                console.log(
                  "🔍 미완료 사용자 다른 페이지 접근 - 테스트로 이동",
                );
                message.info("취향 진단을 먼저 완료해주세요.");
                navigate("/test");
                return;
              }
            }
          } else {
            if (needsAuth) navigate("/login", { state: { from: currentPath } });
            return;
          }
        } else {
          //  토큰이 유효한 경우
          setAccessToken(validToken);
          const decoded = jwtDecode<JwtPayload>(validToken);
          const userIdFromToken = Number(decoded.sub);

          if (!userIdFromToken || isNaN(userIdFromToken)) {
            throw new Error(
              "토큰에서 유효한 사용자 ID(sub)를 찾을 수 없습니다.",
            );
          }

          // 프로필 완료 상태 확인
          let profileComplete = false;
          const justCompleted =
            sessionStorage.getItem("profileJustCompleted") === "true";
          const loginProfileComplete =
            localStorage.getItem("profileComplete") === "true";
          profileComplete = justCompleted || loginProfileComplete;

          try {
            const userInfo = await getUserDetail(validToken);

            if (userInfo && userInfo.data) {
              setUser({
                userId: userIdFromToken,
                email: userInfo.data.email || "",
                nickname: userInfo.data.nickname || "",
                profileImageUrl: userInfo.data.profileImageUrl || "",
                isLoggedIn: true,
                profileComplete: profileComplete,
              });
            } else {
              setUser({
                userId: userIdFromToken,
                email: "",
                nickname: "",
                profileImageUrl: "",
                isLoggedIn: true,
                profileComplete: profileComplete,
              });
            }
          } catch (userDetailError) {
            console.error(
              "🔍 사용자 상세 정보 가져오기 실패:",
              userDetailError,
            );
            setUser({
              userId: userIdFromToken,
              email: "",
              nickname: "",
              profileImageUrl: "",
              isLoggedIn: true,
              profileComplete: profileComplete,
            });
          }

          if (profileComplete) {
            if (currentPath === "/test") {
              message.info("이미 취향 진단을 완료했습니다.");
              navigate("/home");
              return;
            }
            sessionStorage.removeItem("profileJustCompleted");
          } else {
            if (currentPath !== "/test") {
              console.log("🔍 미완료 사용자 다른 페이지 접근 - 테스트로 이동");
              message.info("취향 진단을 먼저 완료해주세요.");
              navigate("/test");
              return;
            }
          }
        }
      } catch (error) {
        console.error("❌ 인증 체크 중 오류:", error);
        localStorage.removeItem("accessToken");

        setUser({
          userId: 0,
          email: "",
          nickname: "",
          profileImageUrl: "",
          isLoggedIn: false,
          profileComplete: false,
        });
        setAccessToken(null);

        if (needsAuth) navigate("/login", { state: { from: currentPath } });
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [location.pathname, navigate, message]);

  // 경로가 변경될 때 추가 체크
  useEffect(() => {
    if (!hasInitialized.current || isLoading) return;

    const currentPath = location.pathname;

    if (user.isLoggedIn) {
      if (user.profileComplete && currentPath === "/test") {
        message.info("이미 취향 진단을 완료했습니다.");
        navigate("/home");
      } else if (!user.profileComplete && currentPath !== "/test") {
        message.info("취향 진단을 먼저 완료해주세요.");
        navigate("/test");
      }
    }
  }, [
    location.pathname,
    user.isLoggedIn,
    user.profileComplete,
    navigate,
    message,
    isLoading,
  ]);

  const logout = async () => {
    try {
      if (accessToken) {
        await clearTokens(accessToken);
      }
    } catch (error) {
      console.error("서버 로그아웃 실패:", error);
    } finally {
      // 모든 상태 초기화
      localStorage.removeItem("accessToken");
      localStorage.removeItem("userId");
      sessionStorage.removeItem("profileJustCompleted");

      setUser({
        userId: 0,
        email: "",
        nickname: "",
        profileImageUrl: "",
        isLoggedIn: false,
        profileComplete: false,
      });
      setAccessToken(null);
      hasInitialized.current = false;

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
