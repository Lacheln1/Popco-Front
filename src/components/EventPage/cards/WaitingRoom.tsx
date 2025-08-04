import { useQuizStore } from "@/stores/useQuizStore";
import { useEffect } from "react";

export const WaitingRoom = () => {
  const { survivors, nextQuestion, setStep, questionId, quizId } =
    useQuizStore();

  useEffect(() => {
    if (survivors.current >= survivors.max) {
      nextQuestion();
      setStep("question");
    }
  }, [survivors]);

  return (
    <div className="flex flex-col items-center justify-center pt-20 text-center">
      <h2 className="mb-4 text-xl font-semibold">
        🎯 다음 라운드를 준비 중입니다
      </h2>
      <p className="text-lg">
        현재 정답자 {survivors.current} / {survivors.max}
      </p>
      <p className="mt-2 text-sm text-gray-500">
        다음 문제로 자동 이동됩니다...
      </p>
    </div>
  );
};
