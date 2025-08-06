import React, { useState, useEffect, useRef, useCallback } from "react";
import { IoTimeOutline } from "react-icons/io5";
import { FiUsers } from "react-icons/fi";
import useAuthCheck from "@/hooks/useAuthCheck";

// Types
interface QuizData {
  questionId: number;
  content: string;
  options: { id: number; content: string }[];
  firstCapacity: number;
}

interface ServerUpdate {
  remainingTime?: number;
  currentSurvivors?: number;
  maxSurvivors?: number;
  type?: "QUESTION_START" | "QUESTION_TIMEOUT";
}

interface SubmissionResult {
  survived: boolean;
}

interface SurvivorData {
  totalSurvivors: number;
  survivors: { rank: number; userId: string }[];
}

type SocketStatus = "connected" | "disconnected" | "connecting";

const Question: React.FC = () => {
  // State
  const { accessToken } = useAuthCheck();
  const [accessToken, setJwtToken] = useState<string>("");
  const [userTestId, setUserTestId] = useState<number>(1001);
  const [currentQuizId, setCurrentQuizId] = useState<number | null>(null);
  const [currentQuestionId, setCurrentQuestionId] = useState<number>(1);
  const [questionData, setQuestionData] = useState<QuizData | null>(null);
  const [socketStatus, setSocketStatus] =
    useState<SocketStatus>("disconnected");
  const [subscriptionStatus, setSubscriptionStatus] =
    useState<string>("구독: 없음");
  const [remainingTime, setRemainingTime] = useState<number>(0);
  const [isTimerActive, setIsTimerActive] = useState<boolean>(false);
  const [currentSurvivors, setCurrentSurvivors] = useState<number>(0);
  const [maxSurvivors, setMaxSurvivors] = useState<number>(0);
  const [survivorPercentage, setSurvivorPercentage] = useState<number>(0);
  const [connectionStatus, setConnectionStatus] =
    useState<string>("연결 대기중...");
  const [resultMessage, setResultMessage] = useState<string>(
    "설정을 완료하고 퀴즈를 시작하세요!",
  );
  const [resultType, setResultType] = useState<
    "success" | "fail" | "eliminated" | "info"
  >("info");
  const [logs, setLogs] = useState<
    Array<{ time: string; message: string; type: string }>
  >([]);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Refs
  const socketRef = useRef<any>(null);
  const stompClientRef = useRef<any>(null);
  const currentSubscriptionRef = useRef<any>(null);
  const logsRef = useRef<HTMLDivElement>(null);

  // Log function
  const addLog = useCallback((message: string, type: string = "info") => {
    const time = new Date().toLocaleTimeString();
    setLogs((prev) => [...prev, { time, message, type }]);
  }, []);

  // Scroll logs to bottom
  useEffect(() => {
    if (logsRef.current) {
      logsRef.current.scrollTop = logsRef.current.scrollHeight;
    }
  }, [logs]);

  // Get auth headers
  const getAuthHeaders = useCallback(() => {
    if (!accessToken.trim()) {
      throw new Error("JWT 토큰이 필요합니다");
    }
    return {
      Authorization: `Bearer ${accessToken.trim()}`,
      "Content-Type": "application/json",
    };
  }, [accessToken]);

  // Load latest quiz
  const loadLatestQuiz = useCallback(async () => {
    try {
      addLog("🔍 최신 퀴즈 ID 조회 중...");

      const response = await fetch("/quizzes/latest");
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();
      setCurrentQuizId(result.data);

      addLog(`✅ 최신 퀴즈 ID: ${result.data}`, "success");
    } catch (error: any) {
      addLog(`❌ 퀴즈 ID 조회 실패: ${error.message}`, "error");
    }
  }, [addLog]);

  // Load question data
  const loadQuestionData = useCallback(async () => {
    if (!currentQuizId) {
      addLog("먼저 퀴즈 ID를 로드하세요!", "warning");
      return;
    }

    try {
      addLog(
        `🔍 문제 데이터 로드 중... (퀴즈: ${currentQuizId}, 문제: ${currentQuestionId})`,
      );

      const response = await fetch(
        `/quizzes/${currentQuizId}/questions/${currentQuestionId}`,
      );
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();
      const data = result.data;

      // Transform options to match new UI structure
      const transformedData = {
        ...data,
        options: data.options.map((opt: any, index: number) => ({
          id: index + 1,
          content: opt.content,
        })),
      };

      setQuestionData(transformedData);
      setMaxSurvivors(data.firstCapacity);
      setCurrentSurvivors(0);

      addLog(`✅ 문제 데이터 로드 성공`, "success");
    } catch (error: any) {
      addLog(`❌ 문제 데이터 로드 실패: ${error.message}`, "error");
    }
  }, [currentQuizId, currentQuestionId, addLog]);

  // Connect socket
  const connectSocket = useCallback(() => {
    if (stompClientRef.current && stompClientRef.current.connected) {
      addLog("이미 소켓에 연결되어 있습니다.", "warning");
      return;
    }

    if (!currentQuizId) {
      addLog("먼저 퀴즈 ID를 로드하세요!", "warning");
      return;
    }

    if (!accessToken.trim()) {
      addLog("JWT 토큰을 입력해주세요!", "error");
      return;
    }

    setSocketStatus("connecting");
    addLog("소켓 연결 시도...");

    // Note: Using global variables for compatibility
    const SockJS = (window as any).SockJS;
    const Stomp = (window as any).Stomp;

    socketRef.current = new SockJS("/ws-quiz");
    stompClientRef.current = Stomp.over(socketRef.current);

    const headers = {
      Authorization: `Bearer ${accessToken.trim()}`,
    };

    stompClientRef.current.connect(
      headers,
      (frame: any) => {
        setSocketStatus("connected");
        addLog("✅ 소켓 연결 성공!", "success");
        setConnectionStatus("소켓 연결됨");
      },
      (error: any) => {
        setSocketStatus("disconnected");
        addLog("❌ 소켓 연결 실패: " + error, "error");
      },
    );
  }, [currentQuizId, accessToken, addLog]);

  // Start quiz
  const startQuiz = useCallback(async () => {
    // Subscribe to question
    subscribeToQuestion(1);

    // Request server to start question 1
    try {
      const response = await fetch(`/quizzes/${currentQuizId}/start`, {
        method: "POST",
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        addLog("🚀 문제1 타이머 시작 요청 완료!", "success");
      }
    } catch (error: any) {
      addLog("❌ 문제1 시작 실패: " + error.message, "error");
    }
  }, [currentQuizId, getAuthHeaders, addLog]);

  // Subscribe to question
  const subscribeToQuestion = useCallback(
    (questionId: number) => {
      const topic = `/topic/quiz/${currentQuizId}/question/${questionId}`;

      addLog(`📡 문제 ${questionId} 채널 구독 시작: ${topic}`);

      if (currentSubscriptionRef.current) {
        currentSubscriptionRef.current.unsubscribe();
      }

      currentSubscriptionRef.current = stompClientRef.current.subscribe(
        topic,
        (message: any) => {
          const data = JSON.parse(message.body);
          addLog(
            `📨 서버 브로드캐스트 수신: ${JSON.stringify(data).substring(0, 100)}...`,
          );
          handleServerUpdate(data);
        },
      );

      setSubscriptionStatus(`문제 ${questionId} 구독중`);
      setConnectionStatus(`문제 ${questionId} 구독중`);
    },
    [currentQuizId, addLog],
  );

  // Handle server update
  const handleServerUpdate = useCallback(
    (data: ServerUpdate) => {
      // Server timer update
      if (data.remainingTime !== undefined) {
        setRemainingTime(data.remainingTime);
        setIsTimerActive(data.remainingTime > 0);
      }

      // Survivors update
      if (
        data.currentSurvivors !== undefined &&
        data.maxSurvivors !== undefined
      ) {
        setCurrentSurvivors(data.currentSurvivors);
        setMaxSurvivors(data.maxSurvivors);
        const percentage =
          data.maxSurvivors > 0
            ? (data.currentSurvivors / data.maxSurvivors) * 100
            : 0;
        setSurvivorPercentage(percentage);
      }

      // Question start/end messages
      if (data.type === "QUESTION_START") {
        addLog("🚀 서버: 문제가 시작되었습니다!", "success");
        setResultMessage("🚀 문제가 시작되었습니다! 10초의 시간이 주어집니다.");
        setResultType("success");
      } else if (data.type === "QUESTION_TIMEOUT") {
        addLog("⏰ 서버: 시간이 종료되었습니다!", "warning");
        setResultMessage("⏰ 시간이 종료되었습니다!");
        setResultType("eliminated");
        setTimeout(() => {
          addLog("⏰ 타임아웃으로 소켓 연결을 해제합니다.", "warning");
          disconnectSocket();
        }, 5000);
      }
    },
    [addLog],
  );

  // Select answer
  const selectAnswer = useCallback(
    (optionId: number) => {
      if (!hasSubmitted && !isSubmitting) {
        setSelectedAnswer(optionId);
      }
    },
    [hasSubmitted, isSubmitting],
  );

  // Submit answer
  const submitAnswer = useCallback(async () => {
    if (hasSubmitted || isSubmitting || selectedAnswer === null) {
      return;
    }

    if (!currentQuizId) {
      addLog("퀴즈 ID가 설정되지 않았습니다.", "error");
      return;
    }

    try {
      setIsSubmitting(true);
      setHasSubmitted(true);

      addLog(
        `🚀 답안 제출 중... (퀴즈: ${currentQuizId}, 문제: ${currentQuestionId}, 선택: ${selectedAnswer})`,
      );

      const response = await fetch(
        `/quizzes/${currentQuizId}/questions/${currentQuestionId}`,
        {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify({
            optionId: selectedAnswer,
          }),
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      const data: SubmissionResult = result.data;

      addLog(`✅ 답안 제출 성공: ${JSON.stringify(data)}`, "success");

      handleSubmissionResult(data);
    } catch (error: any) {
      addLog(`❌ 답안 제출 실패: ${error.message}`, "error");
      setHasSubmitted(false);
    } finally {
      setIsSubmitting(false);
    }
  }, [
    hasSubmitted,
    isSubmitting,
    selectedAnswer,
    currentQuizId,
    currentQuestionId,
    getAuthHeaders,
    addLog,
  ]);

  // Handle submission result
  const handleSubmissionResult = useCallback(
    (data: SubmissionResult) => {
      if (data.survived) {
        // Survived → move to next question
        setTimeout(() => {
          moveToNextQuestion();
        }, 0);
      } else {
        // Eliminated → disconnect after 5 seconds
        setTimeout(() => {
          addLog("💀 탈락으로 소켓 연결을 해제합니다.", "warning");
          disconnectSocket();
        }, 5000);
      }
    },
    [addLog],
  );

  // Move to next question
  const moveToNextQuestion = useCallback(() => {
    setCurrentQuestionId((prev) => prev + 1);

    addLog(`➡️ 다음 문제 ${currentQuestionId + 1}로 이동합니다...`, "info");

    // Reset UI state
    setSelectedAnswer(null);
    setHasSubmitted(false);
    setIsSubmitting(false);
    setIsTimerActive(false);
    setRemainingTime(0);

    // Load question data and change subscription
    setTimeout(() => {
      loadQuestionData().then(() => {
        subscribeToQuestion(currentQuestionId + 1);

        setResultMessage("다음 문제가 로드되었습니다!");
        setResultType("info");
      });
    }, 100);
  }, [currentQuestionId, loadQuestionData, subscribeToQuestion, addLog]);

  // Load question status
  const loadQuestionStatus = useCallback(async () => {
    if (!currentQuizId) {
      addLog("퀴즈 ID가 설정되지 않았습니다.", "warning");
      return;
    }

    try {
      addLog(`🔍 서버 상태 조회 중...`);

      const response = await fetch(
        `/quizzes/${currentQuizId}/questions/${currentQuestionId}/status`,
      );
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();
      const data = result.data;

      addLog(
        `✅ 서버 상태: 생존자 ${data.currentSurvivors}/${data.maxSurvivors}, 남은시간 ${data.remainingTime}초`,
        "success",
      );

      handleServerUpdate(data);
    } catch (error: any) {
      addLog(`❌ 서버 상태 조회 실패: ${error.message}`, "error");
    }
  }, [currentQuizId, currentQuestionId, addLog, handleServerUpdate]);

  // Load survivors
  const loadSurvivors = useCallback(async () => {
    if (!currentQuizId) {
      addLog("퀴즈 ID가 설정되지 않았습니다.", "warning");
      return;
    }

    try {
      addLog(`🏆 생존자 순위 조회 중...`);

      const response = await fetch(
        `/quizzes/${currentQuizId}/questions/${currentQuestionId}/survivors?page=0&size=10`,
      );
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();
      const data: SurvivorData = result.data;

      addLog(
        `🏆 생존자 순위: 총 ${data.totalSurvivors}명, 1페이지 ${data.survivors.length}명 조회됨`,
        "success",
      );

      if (data.survivors.length > 0) {
        const top5 = data.survivors.slice(0, 5);
        const rankingText = top5
          .map((s) => `${s.rank}등: 사용자${s.userId}`)
          .join(", ");
        addLog(`Top 5: ${rankingText}`, "info");
      }
    } catch (error: any) {
      addLog(`❌ 생존자 순위 조회 실패: ${error.message}`, "error");
    }
  }, [currentQuizId, currentQuestionId, addLog]);

  // Disconnect socket
  const disconnectSocket = useCallback(() => {
    if (currentSubscriptionRef.current) {
      currentSubscriptionRef.current.unsubscribe();
      currentSubscriptionRef.current = null;
      setSubscriptionStatus("구독: 없음");
    }

    if (stompClientRef.current && stompClientRef.current.connected) {
      stompClientRef.current.disconnect();
      setSocketStatus("disconnected");
      setConnectionStatus("연결 해제됨");
    }

    addLog("🔌 소켓 연결이 해제되었습니다.", "warning");
  }, [addLog]);

  // Clear logs
  const clearLogs = useCallback(() => {
    setLogs([]);
  }, []);

  // Auto load latest quiz on mount
  useEffect(() => {
    addLog("🎯 실시간 선착순 퀴즈 테스트 페이지 로드됨");
    addLog(
      "💡 순서: 1) 최신 퀴즈 로드 → 2) 소켓 연결 → 3) 문제 데이터 로드 → 4) 퀴즈 시작",
      "info",
    );
    loadLatestQuiz();
  }, [addLog, loadLatestQuiz]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnectSocket();
    };
  }, [disconnectSocket]);

  // Get result message color
  const getResultColor = (type: string) => {
    switch (type) {
      case "success":
        return "text-green-600";
      case "fail":
        return "text-red-600";
      case "eliminated":
        return "text-orange-600";
      default:
        return "text-gray-700";
    }
  };

  // Get log color
  const getLogColor = (type: string) => {
    switch (type) {
      case "error":
        return "text-red-400";
      case "success":
        return "text-green-400";
      case "warning":
        return "text-orange-400";
      default:
        return "text-gray-300";
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-purple-800 font-sans text-white">
      <div className="mx-auto max-w-7xl p-5">
        {/* Background Setup Panel */}
        <div className="mb-5 rounded-3xl border border-white/20 bg-white/10 p-8 backdrop-blur-md">
          <h1 className="mb-8 text-center text-3xl font-bold">
            🎯 실시간 선착순 퀴즈 (실전 모드)
          </h1>

          {/* Auth Section */}
          <div className="mb-5 rounded-xl bg-black/30 p-4">
            <h3 className="mb-3 text-lg font-bold">🔐 인증 및 설정</h3>
            <input
              type="text"
              value={accessToken}
              onChange={(e) => setJwtToken(e.target.value)}
              className="mb-3 w-full rounded-lg bg-white/90 p-3 text-black placeholder-gray-600"
              placeholder="JWT 토큰을 입력하세요 (Bearer 없이)"
            />
            <div className="flex gap-3">
              <input
                type="number"
                value={userTestId}
                onChange={(e) => setUserTestId(Number(e.target.value))}
                className="flex-1 rounded-lg bg-white/90 p-3 text-black"
                placeholder="테스트용 사용자 ID"
              />
              <div className="flex-2 flex items-center gap-2">
                <span
                  className={`rounded-full px-3 py-2 text-xs ${
                    socketStatus === "connected"
                      ? "bg-green-500"
                      : socketStatus === "connecting"
                        ? "bg-orange-500"
                        : "bg-red-500"
                  }`}
                >
                  소켓:{" "}
                  {socketStatus === "connected"
                    ? "연결됨"
                    : socketStatus === "connecting"
                      ? "연결중"
                      : "연결안됨"}
                </span>
                <span className="rounded-full bg-blue-500 px-3 py-2 text-xs">
                  {subscriptionStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Quiz Info */}
          <div className="mb-4 rounded-xl border-l-4 border-blue-500 bg-blue-500/30 p-4">
            <strong>📋 현재 퀴즈 정보</strong>
            <br />
            {currentQuizId ? (
              <>
                퀴즈 ID: {currentQuizId} | 문제 ID: {currentQuestionId}
              </>
            ) : (
              <span className="italic text-orange-400">
                최신 퀴즈 정보를 로딩 중...
              </span>
            )}
          </div>

          {/* Controls */}
          <div className="mb-5 grid grid-cols-2 gap-2 md:grid-cols-4">
            {[
              { text: "최신 퀴즈 로드", onClick: loadLatestQuiz },
              { text: "소켓 연결", onClick: connectSocket },
              { text: "문제 데이터 로드", onClick: loadQuestionData },
              { text: "퀴즈 시작", onClick: startQuiz },
              { text: "상태 조회", onClick: loadQuestionStatus },
              { text: "생존자 순위", onClick: loadSurvivors },
              { text: "연결 해제", onClick: disconnectSocket },
              { text: "로그 지우기", onClick: clearLogs },
            ].map((btn, idx) => (
              <button
                key={idx}
                onClick={btn.onClick}
                className="cursor-pointer rounded-lg border border-white/30 bg-white/20 p-3 text-center text-xs text-white transition-all duration-300 hover:bg-white/30"
              >
                {btn.text}
              </button>
            ))}
          </div>

          {/* Result Message */}
          <div className="mb-4 rounded-xl bg-black/30 p-4 text-center">
            <div className={`text-lg font-bold ${getResultColor(resultType)}`}>
              {resultMessage}
            </div>
          </div>

          {/* Logs */}
          <div
            ref={logsRef}
            className="h-64 overflow-y-auto rounded-xl bg-black/50 p-4 font-mono text-xs"
          >
            {logs.map((log, index) => (
              <div key={index} className={getLogColor(log.type)}>
                [{log.time}] {log.message}
              </div>
            ))}
          </div>
        </div>

        {/* Modern Quiz UI Overlay */}
        {questionData && (
          <aside className="fixed left-1/2 top-1/2 z-50 flex w-[85%] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center break-keep rounded-2xl bg-white/95 px-4 py-8 shadow-2xl backdrop-blur-lg md:h-[520px] md:w-[800px] md:px-8">
            <div className="flex h-full w-full flex-col items-center justify-center p-4 text-center">
              {/* 상단 정보바 */}
              <div className="mb-6 flex w-full items-center justify-between">
                {/* 타이머 */}
                <div className="flex items-center gap-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-2 shadow-lg transition-all duration-300">
                  <IoTimeOutline className="h-6 w-6 text-white" />
                  <span className="text-lg font-bold text-white">
                    {isTimerActive ? `${remainingTime}초` : "대기 중"}
                  </span>
                </div>

                {/* 문제 번호 */}
                <div className="text-2xl font-bold text-gray-800">
                  Quiz {currentQuestionId} / 3
                </div>

                {/* 생존자 정보 */}
                <div className="flex flex-col items-end">
                  <div className="mb-2 flex items-center gap-2">
                    <FiUsers className="h-5 w-5 text-indigo-600" />
                    <span className="text-lg font-semibold text-gray-700">
                      생존자
                    </span>
                    <span className="text-2xl font-bold text-indigo-600">
                      {currentSurvivors.toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-500">
                      / {maxSurvivors.toLocaleString()}
                    </span>
                  </div>
                  <div className="h-3 w-32 overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-1000 ease-out"
                      style={{ width: `${survivorPercentage}%` }}
                    />
                  </div>
                  <div className="mt-1 text-sm text-gray-500">
                    {survivorPercentage.toFixed(1)}% 남음
                  </div>
                </div>
              </div>

              {/* 문제 */}
              <h3 className="my-6 text-xl leading-snug text-gray-800 lg:text-2xl">
                {questionData.content}
              </h3>

              {/* 선택지 */}
              <div className="mb-8 grid w-full max-w-2xl gap-3">
                {questionData?.options?.map((opt, index) => (
                  <button
                    key={opt.id}
                    onClick={() => selectAnswer(opt.id)}
                    disabled={hasSubmitted || isSubmitting}
                    className={`group relative transform overflow-hidden rounded-xl p-4 text-left font-medium transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100 ${
                      selectedAnswer === opt.id
                        ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg"
                        : "bg-gradient-to-r from-gray-800 to-gray-900 text-white shadow-md hover:from-purple-500 hover:to-purple-600 hover:shadow-lg"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-all ${
                          selectedAnswer === opt.id
                            ? "scale-110 bg-white/30"
                            : "bg-white/20 group-hover:scale-105 group-hover:bg-white/30"
                        }`}
                      >
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span className="text-base font-medium">
                        {opt.content}
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              {/* 제출 버튼 */}
              <button
                onClick={submitAnswer}
                disabled={
                  selectedAnswer === null || hasSubmitted || isSubmitting
                }
                className="transform rounded-full bg-gradient-to-r from-blue-600 to-blue-700 px-12 py-4 text-base font-bold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-blue-700 hover:to-blue-800 hover:shadow-xl active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    제출 중...
                  </div>
                ) : hasSubmitted ? (
                  "제출 완료!"
                ) : selectedAnswer === null ? (
                  "답을 선택해주세요"
                ) : (
                  "정답 제출하기"
                )}
              </button>
            </div>
          </aside>
        )}
      </div>

      {/* External Scripts */}
      <script src="https://cdnjs.cloudflare.com/ajax/libs/sockjs-client/1.6.1/sockjs.min.js"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/stomp.js/2.3.3/stomp.min.js"></script>
    </div>
  );
};

export default Question;
