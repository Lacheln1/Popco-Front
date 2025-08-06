import { useQuizStore } from "@/stores/useQuizStore";
import { subscribeToQuestion } from "@/utils/socket";
import { useEffect } from "react";

const WaitingRoom = () => {
  const { quizId, questionId } = useQuizStore();

  useEffect(() => {
    if (!quizId || !questionId) return;

    const handleServerMessage = (data: any) => {
      if (data.type === "NEXT_QUESTION") {
        const { setQuestionId, setStep, setHasSubmitted } =
          useQuizStore.getState();
        console.log("📢 다음 문제로 이동 (waiting):", data.questionId);
        setHasSubmitted(false);
        setQuestionId(data.questionId);
        setStep("question");
      }
    };

    const unsubscribe = subscribeToQuestion(
      quizId,
      questionId,
      handleServerMessage,
    );

    return () => {
      unsubscribe?.(); // 언마운트 시 정리
    };
  }, [quizId, questionId]);

  return (
    <div className="mt-20 text-center">
      <p className="text-lg">결과 확인 중입니다...</p>
      <p className="mt-2 text-sm text-gray-500">다음 문제가 곧 시작됩니다.</p>
    </div>
  );
};

export { WaitingRoom };
