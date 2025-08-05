import { Outlet, useNavigate } from "react-router-dom";
import Footer from "../components/common/Footer";
import Header from "@/components/common/Header";
import useAuthCheck from "@/hooks/useAuthCheck";
import Spinner from "@/components/common/Spinner";
import { useEffect, useState } from "react";

const Layout = () => {
  const [notification, setNotification] = useState<null | string>(null);
  const { user, isLoading, logout } = useAuthCheck();
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  const handleLogout = () => {
    logout();
  };

  useEffect(() => {
    if (!user?.userId) return;

    const eventSource = new EventSource(
      `/notifications/stream?clientId=${user.userId}`,
    );

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setNotification(data.message);
    };

    eventSource.onerror = (error) => {
      console.error("SSE 연결 오류:", error);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [user?.userId]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header user={user} onLogin={handleLogin} onLogout={handleLogout} />
      <main className="flex-grow">
        <Outlet />
      </main>
      {notification && (
        <button
          onClick={() => navigate("/event")}
          className="fixed bottom-10 right-0 z-50 w-[80px] animate-bounce-chatbot sm:bottom-12 sm:right-10 sm:w-[130px] lg:right-28"
        >
          <img src="/images/popco/quiz.svg" alt="quiz" />
        </button>
      )}
      <Footer />
    </div>
  );
};

export default Layout;
