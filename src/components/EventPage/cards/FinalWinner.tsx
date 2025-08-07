import React, { useEffect } from "react";
import { disconnectSocket } from "@/utils/socket";
import { useQuizStore } from "@/stores/useQuizStore";
import { useNavigate } from "react-router-dom";

export const FinalWinner = () => {
  const { isConnected, setConnected, nickname } = useQuizStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isConnected) {
      disconnectSocket();
      setConnected(false);
    }
  }, [isConnected]);

  return (
    <aside className="absolute left-1/2 top-[31%] z-10 flex min-h-[550px] w-[85%] -translate-x-1/2 -translate-y-1/3 flex-col items-center justify-center gap-4 break-keep rounded-2xl bg-white/95 px-4 py-8 text-center shadow-2xl backdrop-blur-lg md:h-[520px] md:min-h-[520px] md:w-[800px] md:px-8">
      <h2 className="gmarket text-2xl font-normal text-green-900">
        🎉 우승을 축하합니다! 🎉
      </h2>
      <div className="justify-items-center">
        <img
          src="/images/popco/winner.svg"
          className="my-6 h-32 md:my-0 md:h-56"
          alt="winner popco"
        />
        <div className="flex flex-col text-center text-base">
          <p>{nickname}님 마지막 문제까지 생존하셨어요.</p>
          <p>오늘의 POPCO 챔피언입니다!</p>
        </div>
      </div>
      <button
        onClick={() => navigate("/")}
        className="bg-footerBlue w-1/2 rounded-lg py-4 text-white"
      >
        메인으로 이동
      </button>
    </aside>
  );
};
