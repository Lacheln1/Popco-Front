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

// 2. 문제 채널 구독
export const subscribeToQuestion = (
  quizId: number,
  questionId: number,
  onMessage: (data: any) => void,
) => {
  if (!stompClient || !stompClient.connected) {
    console.warn("소켓이 아직 연결되지 않았습니다.");
    // null 대신 빈 함수를 반환
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

      if (data.status === "ACTIVE") {
        const { setQuestionId, setStep, setHasSubmitted } =
          useQuizStore.getState();

        console.log("📢 다음 문제로 이동:", data.questionId);

        setHasSubmitted(false);
        setQuestionId(data.questionId);
        setStep("question");
      }

      if (data.status === "FINISHED") {
        const { setStep } = useQuizStore.getState();
        console.log("🎉 퀴즈 종료!");
        setStep("winner");
      }

      // 추가적으로 onMessage 콜백도 호출
      onMessage(data);
    } catch (e) {
      console.error("이벤트 메시지 파싱 실패", e);
    }
  });

  console.log(`문제 구독 시작: ${topic}`);

  // unsubscribe 함수 반환 (항상 함수를 반환)
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
