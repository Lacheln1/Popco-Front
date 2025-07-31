import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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

  // 중복 실행 방지를 위한 ref
  const isCheckingAuth = useRef(false);
  const hasInitialized = useRef(false);

  useEffect(() => {
    // 이미 체크 중이거나 초기화 완료되었으면 실행하지 않음
    if (isCheckingAuth.current || hasInitialized.current) {
      return;
    }

    const checkAuth = async () => {
      // 중복 실행 방지 플래그 설정
      if (isCheckingAuth.current) return;
      isCheckingAuth.current = true;

      console.log("🔍 useAuthCheck 시작");
      const currentPath = location.pathname;
      const needsAuth = isProtectedRoute(currentPath);

      console.log("현재 경로:", currentPath);
      console.log("인증 필요 여부:", needsAuth);

      try {
        setIsLoading(true);
        console.log("1️⃣ validateAndRefreshTokens 호출");
        const result = await validateAndRefreshTokens();

        console.log("1️⃣ result:", result);
        console.log("1️⃣ result.result:", result?.result);
        console.log("1️⃣ result.data:", result?.data);

        if (result.result === "INVALID_REFRESH_TOKEN") {
          console.log("❌ 토큰 만료");

          // 로그인이 필요한 url에 있을 때만 로그인 페이지로 리디렉션
          if (needsAuth) {
            alert("로그인이 필요한 페이지입니다. 로그인 해주세요.");
            navigate("/login", {
              state: { from: currentPath }, // 로그인 후 돌아갈 경로 저장
            });
            return;
          }

          // 로그인이 필요없는 url에서는 그냥 상태만 초기화
          setUser({
            userId: 0,
            email: "",
            nickname: "",
            profileImageUrl: "",
            isLoggedIn: false,
          });
          setAccessToken(null);
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

            // 로그인이 필요한 url에서 사용자 정보 가져오기 실패시에만 로그인 페이지로
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

        // 로그인이 필요한 url에서만 로그인 페이지로 리디렉션
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
      } finally {
        setIsLoading(false);
        isCheckingAuth.current = false; // 플래그 해제
        hasInitialized.current = true; // 초기화 완료 표시
        console.log("🔍 useAuthCheck 완료");
      }
    };

    checkAuth();
  }, []); // 의존성 배열을 빈 배열로 변경하여 한 번만 실행

  // 경로 변경 시에만 별도로 체크
  useEffect(() => {
    if (!hasInitialized.current) return;

    const currentPath = location.pathname;
    const needsAuth = isProtectedRoute(currentPath);

    console.log("경로 변경됨:", currentPath, "인증 필요:", needsAuth);

    // 인증이 필요한 페이지인데 로그인되지 않은 경우
    if (needsAuth && !user.isLoggedIn && !isLoading) {
      console.log("인증 필요한 페이지로 이동했는데 로그인되지 않음");
      navigate("/login", { state: { from: currentPath } });
    }
  }, [location.pathname, user.isLoggedIn, isLoading, navigate]);

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

    // 4. 초기화 플래그 리셋
    hasInitialized.current = false;

    // 5. 현재 경로 확인하여 로그인이 필요한 url에 있을 때만 홈으로 이동
    const currentPath = location.pathname;
    const needsAuth = isProtectedRoute(currentPath);

    if (needsAuth) {
      // 로그인이 필요한 url에 있다면 홈으로 이동
      navigate("/");
    }
    // 로그인이 필요한 url에 있다면 그대로 머물기
  };

  return {
    user,
    accessToken,
    isLoading,
    logout,
  };
};

export default useAuthCheck;
