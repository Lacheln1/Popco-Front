import { useEffect, useRef, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Footer from "../components/common/Footer";
import Header from "@/components/common/Header";
import Spinner from "@/components/common/Spinner";
import useAuthCheck from "@/hooks/useAuthCheck";
import { EventSourcePolyfill } from "event-source-polyfill";

const Layout = () => {
  const [notification, setNotification] = useState<null | string>(null);
  const lastNotificationRef = useRef<string | null>(null);
  const { user, isLoading, logout, accessToken } = useAuthCheck();
  const navigate = useNavigate();

  const handleLogin = () => navigate("/login");
  const handleLogout = () => logout();

  useEffect(() => {
    if (!accessToken) return;

    const url = `${import.meta.env.VITE_BACK_URL}/notifications/stream`;
    const eventSource = new EventSourcePolyfill(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    });

    eventSource.onopen = () => {
      console.log("SSE 연결 성공");
    };

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const { title, remainMin, message } = data;

        if (title !== "퀴즈 시작 알림") return;

        const remain = Number(remainMin);

        if (remain === 0) {
          setNotification(null);
          lastNotificationRef.current = null;
        } else if (remain <= 10 && message !== lastNotificationRef.current) {
          setNotification(message);
          lastNotificationRef.current = message;
        }
      } catch (e) {
        console.error("SSE message parse error:", e);
      }
    };

    eventSource.onerror = (error) => {
      console.error("SSE 연결 오류:", error);
      eventSource.close();
    };

    return () => eventSource.close();
  }, [accessToken]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  const handleGoToEvent = () => {
    navigate("/event");
    setNotification(null); // 이동 시 수동으로도 제거 가능
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header user={user} onLogin={handleLogin} onLogout={handleLogout} />
      <main className="flex-grow">
        <Outlet />
      </main>
      {notification && (
        <button
          onClick={handleGoToEvent}
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
