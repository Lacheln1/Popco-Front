import { Outlet, useNavigate } from "react-router-dom";
import Footer from "../components/common/Footer";
import Header from "@/components/common/Header";
import useAuthCheck from "@/hooks/useAuthCheck";
import { clearTokens } from "@/apis/tokenApi";

const Layout = () => {
  const { user, accessToken, isLoading } = useAuthCheck();
  const navigate = useNavigate();

  // 로그인 핸들러
  const handleLogin = () => {
    navigate("/login");
  };

  // 로그아웃 핸들러
  const handleLogout = async () => {
    try {
      // 액세스 토큰과 함께 로그아웃 API 호출
      await clearTokens(accessToken || undefined);

      // 로그아웃 후 홈페이지로 이동하면서 상태 초기화
      window.location.href = "/";
    } catch (error) {
      console.error("로그아웃 실패:", error);

      // 에러가 발생해도 강제 로그아웃 진행
      window.location.href = "/";
    }
  };

  // 로딩 중일 때는 로딩 표시
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div>로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header user={user} onLogin={handleLogin} onLogout={handleLogout} />
      <main className="flex-grow">
        <Outlet />
      </main>
      <button className="fixed bottom-10 right-0 z-50 w-[80px] animate-bounce-chatbot sm:bottom-12 sm:right-10 sm:w-[130px] lg:right-28">
        <img src="/images/main/chatbot.svg" alt="chatbot" />
      </button>
      <Footer />
    </div>
  );
};

export default Layout;
