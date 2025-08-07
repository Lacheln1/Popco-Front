import SockJS from "sockjs-client";
import { Client, IMessage } from "@stomp/stompjs";
import { useQuizStore } from "@/stores/useQuizStore";

// 전역으로 연결 객체와 구독 정보 보관
let stompClient: Client | null = null;
let currentSubscription: any = null;

// stompClient getter 함수 추가 - 다른 컴포넌트에서 접근할 수 있도록
export const getStompClient = (): Client | null => {
  return stompClient;
};

// 대기 채널 구독 함수 추가
export const subscribeToWaiting = (
  quizId: number,
  onMessage: (data: any) => void,
) => {
  if (!stompClient || !stompClient.connected) {
    console.warn("소켓이 아직 연결되지 않았습니다.");
    return null;
  }

  const topic = `/topic/quiz/${quizId}/waiting`;

  const subscription = stompClient.subscribe(topic, (message: IMessage) => {
    try {
      const data = JSON.parse(message.body);
      onMessage(data);
    } catch (e) {
      console.error("대기 채널 메시지 파싱 실패", e);
    }
  });

  console.log(`대기 채널 구독 시작: ${topic}`);
  return subscription;
};

// 1. 소켓 연결
export const connectSocket = (token: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const client = new Client({
      // SockJS 사용 시 brokerURL 대신 webSocketFactory 사용
      webSocketFactory: () =>
        new SockJS("http://popco.site/api/client/ws-quiz"),
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      reconnectDelay: 5000, // 자동 재연결 옵션
      onConnect: () => {
        console.log("소켓 연결 성공");
        stompClient = client;
        resolve();
      },
      onStompError: (frame) => {
        console.error("STOMP 에러:", frame);
        reject(frame);
      },
      onWebSocketError: (event) => {
        console.error("WebSocket 에러:", event);
        reject(event);
      },
    });

    client.activate();
  });
};

// 개별 이벤트 핸들러 함수들
const handleQuestionStart = (data: any) => {
  const { setQuestionId, setStep, setHasSubmitted } = useQuizStore.getState();

  console.log("📢 문제 시작:", data.questionId);

  // 문제 시작 시 상태 초기화
  setHasSubmitted(false);
  if (data.questionId) {
    setQuestionId(data.questionId);
  }
  setStep("question");
};

const handleWinnerAnnounced = (data: any) => {
  const { setWinnerInfo, setStep } = useQuizStore.getState();

  console.log("🏆 우승자 발표:", data);

  if (data.winnerName && data.winnerRank) {
    setWinnerInfo({
      type: "WINNER_ANNOUNCED",
      winnerName: data.winnerName,
      winnerRank: data.winnerRank,
      message: data.message ?? "우승자가 결정되었습니다!",
    });
  }
  setStep("winner");

  // 구독 해제
  if (currentSubscription) {
    currentSubscription.unsubscribe();
    currentSubscription = null;
  }
};

const handleQuestionTimeout = () => {
  console.log("문제 시간 종료 ");
};

const handleQuizStatus = (data: any) => {
  console.log("퀴즈 상태 업데이트:", data);
};

// 2. 문제 채널 구독 (개선된 버전)
export const subscribeToQuestion = (
  quizId: number,
  questionId: number,
  onMessage: (data: any) => void,
) => {
  if (!stompClient || !stompClient.connected) {
    console.warn("소켓이 아직 연결되지 않았습니다.");
    return () => {
      console.log("소켓이 연결되지 않아 구독 해제할 것이 없습니다.");
    };
  }

  const topic = `/topic/quiz/${quizId}/question/${questionId}`;

  // 기존 구독 해제
  if (currentSubscription) {
    currentSubscription.unsubscribe();
    currentSubscription = null;
  }

  currentSubscription = stompClient.subscribe(topic, (message: IMessage) => {
    try {
      const data = JSON.parse(message.body);
      console.log("소켓 메시지 수신:", data);

      // type 필드로 먼저 구분
      switch (data.type) {
        case "QUESTION_START":
          handleQuestionStart(data);
          break;

        case "WINNER_ANNOUNCED":
          handleWinnerAnnounced(data);
          break;

        case "QUESTION_TIMEOUT":
          handleQuestionTimeout(data);
          break;

        default:
          // type이 없으면 QuizStatusResponseDto로 간주
          if (data.quizId && data.questionId) {
            handleQuizStatus(data);
          }
          break;
      }

      // 🚨 ACTIVE/FINISHED 상태 처리를 제거 - Question.tsx에서만 처리하도록
      // 기존 status 기반 처리 제거 (중복 방지)

      // 추가적으로 onMessage 콜백도 호출 (Question 컴포넌트의 세부 로직)
      onMessage(data);
    } catch (e) {
      console.error("이벤트 메시지 파싱 실패", e);
    }
  });

  console.log(`문제 구독 시작: ${topic}`);

  return () => {
    if (currentSubscription) {
      currentSubscription.unsubscribe();
      currentSubscription = null;
      console.log(`구독 해제: ${topic}`);
    }
  };
};

// 3. 소켓 해제
export const disconnectSocket = () => {
  if (currentSubscription) {
    currentSubscription.unsubscribe();
    currentSubscription = null;
  }

  if (stompClient) {
    stompClient.deactivate();
    stompClient = null;
    console.log("소켓 연결 해제");
  }
};
