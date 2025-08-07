import { useEffect, useRef, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Footer from "../components/common/Footer";
import Header from "@/components/common/Header";
import Spinner from "@/components/common/Spinner";
import useAuthCheck from "@/hooks/useAuthCheck";
import { useQuizInfo } from "@/hooks/queries/quiz/useQuizInfo";
import dayjs from "dayjs";

const Layout = () => {
  const [notification, setNotification] = useState(false);
  const { user, isLoading, logout, accessToken } = useAuthCheck();
  const navigate = useNavigate();
  const location = useLocation();
  const eventSourceRef = useRef<EventSource | null>(null);
  const notificationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const handleLogin = () => navigate("/login");
  const handleLogout = () => logout();

  const { data: quizInfo } = useQuizInfo(accessToken);

  useEffect(() => {
    if (!quizInfo?.quizDetail) return;
    const { quizStartTime, serverTime } = quizInfo.quizDetail;

    const start = dayjs(quizStartTime);
    const server = dayjs(serverTime);
    const diffMin = start.diff(server, "minute");

    // 오늘 퀴즈고, 10분 미만 남았을 때 알림 표시
    if (diffMin >= 0 && diffMin < 10) {
      setNotification(true);
    }
  }, [quizInfo]);

  // 알림 타이머를 설정하는 함수
  const setNotificationTimer = (remainMin: number) => {
    // 기존 타이머 클리어
    if (notificationTimerRef.current) {
      clearTimeout(notificationTimerRef.current);
    }

    let timeoutDuration;
    if (remainMin > 0) {
      timeoutDuration = remainMin * 60 * 1000; // 분을 밀리초로 변환
    } else {
      timeoutDuration = 30 * 1000; // 30초
    }

    notificationTimerRef.current = setTimeout(() => {
      setNotification(false);
    }, timeoutDuration);
  };

  // 메시지 처리 함수
  const handleNotificationMessage = (data: any) => {
    if (data.type === "QUIZ_NOTIFICATION" || data.type === "EVENT_REMINDER") {
      setNotification(true);
      // 타이머 설정
      if (data.remainMin !== undefined) {
        setNotificationTimer(data.remainMin);
      } else {
        setNotificationTimer(0);
      }
    }
  };

  useEffect(() => {
    if (!accessToken) return;

    const url = `${import.meta.env.VITE_SOCKET_URL}/notifications/stream?token=${accessToken}`;

    // 기존 연결 정리
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    const eventSource = new EventSource(url);
    eventSourceRef.current = eventSource;

    // 단일 메시지 핸들러로 통합
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        handleNotificationMessage(data);
      } catch (err) {
        console.error("이벤트 데이터 파싱 오류:", err);
      }
    };

    // 커스텀 이벤트도 같은 핸들러 사용
    eventSource.addEventListener("notification", (event) => {
      try {
        const data = JSON.parse(event.data);
        handleNotificationMessage(data);
      } catch (err) {
        console.error("notification 데이터 파싱 오류:", err);
      }
    });

    // 연결 상태 관리
    eventSource.onopen = () => {
      console.log("알림 연결이 열렸습니다");
    };

    eventSource.onerror = (error) => {
      console.error("EventSource 오류:", error);
      if (eventSource.readyState === EventSource.CLOSED) {
        console.log("연결이 닫혔습니다");
      } else if (eventSource.readyState === EventSource.CONNECTING) {
        console.log("재연결 시도 중...");
      }
    };

    return () => {
      // 클린업
      if (notificationTimerRef.current) {
        clearTimeout(notificationTimerRef.current);
        notificationTimerRef.current = null;
      }

      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
  }, [accessToken]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  const handleGoToEvent = () => {
    navigate("/event");
    setNotification(false);

    // 타이머 클리어
    if (notificationTimerRef.current) {
      clearTimeout(notificationTimerRef.current);
      notificationTimerRef.current = null;
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header user={user} onLogin={handleLogin} onLogout={handleLogout} />
      <main className="flex-grow">
        <Outlet />
      </main>
      {notification && location.pathname !== "/event" && (
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
