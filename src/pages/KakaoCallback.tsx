import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_BACK_URL;

const KakaoCallback: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [debugInfo, setDebugInfo] = useState<string[]>([]);

  // 디버그 로그 추가 함수
  const addDebugLog = (message: string) => {
    console.log(`[KAKAO_DEBUG] ${message}`);
    setDebugInfo((prev) => [
      ...prev,
      `${new Date().toLocaleTimeString()}: ${message}`,
    ]);
  };

  useEffect(() => {
    console.log("[KAKAO_DEBUG] useEffect 시작");
    addDebugLog("useEffect 시작");

    const handleKakaoCallback = async () => {
      try {
        addDebugLog("handleKakaoCallback 함수 시작");

        // URL 파라미터 파싱
        const urlParams = new URLSearchParams(location.search);
        const code = urlParams.get("code");
        const error = urlParams.get("error");
        const errorDescription = urlParams.get("error_description");

        addDebugLog(
          `URL 파라미터 파싱 완료 - code: ${code ? "존재" : "없음"}, error: ${error || "없음"}`,
        );
        addDebugLog(`현재 URL: ${location.pathname}${location.search}`);

        // 에러가 있는지 먼저 확인
        if (error) {
          addDebugLog(`카카오 인증 에러 발생: ${error} - ${errorDescription}`);
          console.log(`카카오 인증 에러: ${error} - ${errorDescription}`);
          alert(`카카오 인증 에러: ${error} - ${errorDescription}`);
          navigate("/login");
          return;
        }

        if (!code) {
          addDebugLog("인증 코드가 없습니다");
          console.log("인증 코드를 받지 못했습니다.");
          alert("인증 코드를 받지 못했습니다.");
          navigate("/login");
          return;
        }

        addDebugLog("백엔드 API 호출 시작");
        addDebugLog(`API_URL: ${API_URL}`);
        addDebugLog(`요청 URL: ${API_URL}/auth/kakao/login?code=${code}`);

        // 백엔드에 코드 전송
        const response = await axios.post(
          `${API_URL}/auth/kakao/login?code=${code}`,
        );

        addDebugLog("백엔드 API 호출 성공");
        const result = response.data;
        addDebugLog(`API 응답: ${JSON.stringify(result)}`);
        console.log(result);

        if (result.message == "SIGNUP") {
          addDebugLog("SIGNUP 플로우 진입");
          navigate("/test");
          console.log("signup됐음");
          return;
        }

        if (result.message == "LOGIN") {
          addDebugLog("LOGIN 플로우 진입");
          addDebugLog(`profileComplete: ${result.data.profileComplete}`);

          if (result.data.profileComplete) {
            addDebugLog("프로필 완료 상태 - 메인 페이지로 이동");
            navigate("/");
            window.location.reload(); // 중요: Layout의 useAuthCheck가 새로운 토큰으로 사용자 정보를 가져옴
          } else {
            addDebugLog("프로필 미완료 상태 - 테스트 페이지로 이동");
            navigate("/test");
          }
          return;
        }

        // 예상하지 못한 응답인 경우
        addDebugLog(`예상하지 못한 응답 메시지: ${result.message}`);
        console.warn("예상하지 못한 응답:", result);
      } catch (error) {
        addDebugLog(
          `에러 발생: ${error instanceof Error ? error.message : "알 수 없는 오류"}`,
        );

        if (axios.isAxiosError(error)) {
          addDebugLog(`HTTP 상태: ${error.response?.status}`);
          addDebugLog(`응답 데이터: ${JSON.stringify(error.response?.data)}`);
        }

        alert(
          `로그인에 실패했습니다: ${error instanceof Error ? error.message : "알 수 없는 오류"}`,
        );
        console.log("카카오로그인실패", error);
        navigate("/login");
      }
    };

    addDebugLog("handleKakaoCallback 함수 호출");
    handleKakaoCallback();
  }, [location, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="max-w-md text-center">
        <div className="mb-4">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
        </div>
        <h2 className="text-xl font-semibold text-gray-800">
          카카오 로그인 처리 중...
        </h2>
        <p className="text-gray-600">잠시만 기다려주세요.</p>

        {/* 디버그 정보 표시 (개발 환경에서만) */}
        {import.meta.env.DEV && (
          <div className="mt-4 rounded-lg bg-gray-200 p-4 text-left">
            <h3 className="mb-2 text-sm font-bold">디버그 로그:</h3>
            <div className="max-h-40 space-y-1 overflow-y-auto text-xs">
              {debugInfo.map((log, index) => (
                <div key={index} className="text-gray-700">
                  {log}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default KakaoCallback;
