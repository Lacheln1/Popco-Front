import { Outlet, useNavigate } from "react-router-dom";
import Footer from "../components/common/Footer";
import Header from "@/components/common/Header";
import useAuthCheck from "@/hooks/useAuthCheck";
import { clearTokens } from "@/apis/tokenApi";

const Layout = () => {
  const { user, accessToken, isLoading, logout } = useAuthCheck();
  const navigate = useNavigate();

  // 로그인 핸들러
  const handleLogin = () => {
    navigate("/login");
  };

  // 로그아웃 핸들러
  const handleLogout = async () => {
    try {
      if (accessToken) {
        await clearTokens(accessToken);
      }

      logout();
      setTimeout(() => {
        window.location.reload();
      }, 100);
    } catch (error) {
      console.error("서버 로그아웃 API 실패:", error);

      // 서버 API 실패해도 로컬 로그아웃은 진행
      logout();
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
