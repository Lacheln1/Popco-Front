import { useEffect } from "react";
import { disconnectSocket } from "@/utils/socket";
import { useQuizStore } from "@/stores/useQuizStore";

export const Eliminated = () => {
  const { reset } = useQuizStore();

  useEffect(() => {
    disconnectSocket();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center px-4 pt-20 text-center">
      <h2 className="mb-4 text-2xl font-semibold text-red-500">
        😢 아쉽게도 탈락하셨습니다!
      </h2>
      <p className="mb-2">다음 기회에 도전해 주세요.</p>
      <p className="text-sm text-gray-500">참여해주셔서 감사합니다!</p>
    </div>
  );
};
