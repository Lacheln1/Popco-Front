import React, { useEffect } from "react";
import { disconnectSocket } from "@/utils/socket";
import { useQuizStore } from "@/stores/useQuizStore";

export const FinalWinner = () => {
  const { reset } = useQuizStore();

  useEffect(() => {
    disconnectSocket();
    // 퀴즈 종료 후 상태 초기화
    reset();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center px-4 pt-20 text-center">
      <h2 className="mb-4 text-2xl font-bold text-green-600">🏆 축하합니다!</h2>
      <p className="mb-2 text-lg">당신은 최후의 1인입니다 🎉</p>
      <p className="text-sm text-gray-600">
        상품 수령 안내는 별도 공지로 드릴 예정입니다.
      </p>
    </div>
  );
};
