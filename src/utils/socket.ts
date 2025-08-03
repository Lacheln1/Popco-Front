import SockJS from "sockjs-client";
import { Client, IMessage } from "@stomp/stompjs";

// 전역으로 연결 객체와 구독 정보 보관
let stompClient: Client | null = null;
let currentSubscription: any = null;

// 1. 소켓 연결
export const connectSocket = (token: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const client = new Client({
      // SockJS 사용 시 brokerURL 대신 webSocketFactory 사용
      webSocketFactory: () => new SockJS("/ws-quiz"),
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      reconnectDelay: 5000, // 자동 재연결 옵션
      debug: (str) => {
        console.log("[STOMP DEBUG]:", str);
      },
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
    return;
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
      onMessage(data);
    } catch (e) {
      console.error("메시지 파싱 실패", e);
    }
  });

  console.log(`문제 구독 시작: ${topic}`);
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
