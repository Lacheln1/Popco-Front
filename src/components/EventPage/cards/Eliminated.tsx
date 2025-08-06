import { useEffect } from "react";
import { disconnectSocket } from "@/utils/socket";

export const Eliminated = () => {
  useEffect(() => {
    disconnectSocket();
  }, []);

  return (
    <aside className="absolute left-1/2 top-[31%] z-10 flex w-[85%] -translate-x-1/2 -translate-y-1/3 flex-col items-center justify-center break-keep rounded-2xl bg-white/95 px-4 py-8 shadow-2xl backdrop-blur-lg md:h-[520px] md:w-[800px] md:px-8">
      <h2 className="mb-4 text-2xl font-semibold text-red-500">
        아쉽게도 탈락하셨습니다!
      </h2>
      <div>
        <img src="/images/popco/incorrect.svg" alt="틀렸습니다" />
        <div>
          <p className="mb-2">아쉽지만 다음 기회에 도전해 주세요.</p>
          <p className="text-sm text-gray-500">참여해주셔서 감사합니다!</p>
        </div>
      </div>
    </aside>
  );
};
