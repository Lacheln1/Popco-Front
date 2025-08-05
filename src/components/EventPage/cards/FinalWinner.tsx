import React, { useEffect } from "react";
import { disconnectSocket } from "@/utils/socket";
import { useQuizStore } from "@/stores/useQuizStore";

export const FinalWinner = () => {
  const { isConnected, setConnected } = useQuizStore();

  useEffect(() => {
    if (isConnected) {
      disconnectSocket();
      setConnected(false);
    }
  }, [isConnected]);

  return (
    <div className="flex flex-col items-center justify-center px-4 pt-24 text-center">
      <h2 className="mb-4 text-2xl font-bold text-green-600">
        🎉 우승을 축하합니다!
      </h2>
      <p className="mb-6 text-lg">
        마지막 문제까지 생존하셨어요. <br />
        오늘의 POPCO 챔피언입니다!
      </p>
      <img
        src="/images/popco/winner-popco.png"
        alt="winner popco"
        className="h-auto w-40"
      />
    </div>
  );
};
