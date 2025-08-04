import { useEffect } from "react";
import { useQuizStore } from "@/stores/useQuizStore";
import axiosInstance from "@/apis/axiosInstance";
import { subscribeToQuestion } from "@/utils/socket";
import useAuthCheck from "@/hooks/useAuthCheck";

export const Question = () => {
  const {
    quizId,
    questionId,
    questionData,
    hasSubmitted,
    setHasSubmitted,
    setQuestionData,
    updateTimer,
    updateSurvivors,
    setStep,
  } = useQuizStore();
  const { accessToken } = useAuthCheck();
  console.log(quizId, questionId);
  // 1. 문제 데이터 불러오기
  const loadQuestionData = async () => {
    if (!quizId || !accessToken) return;
    try {
      const res = await axiosInstance.get(
        `/quizzes/${quizId}/question/${questionId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      setQuestionData(res.data.data);
      console.log("문제불러오기", res);
    } catch (err) {
      console.error("문제 불러오기 실패", err);
    }
  };

  // 2. 서버 브로드캐스트 수신 처리
  const handleServerMessage = (data: any) => {
    if (data.remainingTime !== undefined) {
      updateTimer(data.remainingTime);
    }
    if (
      data.currentSurvivors !== undefined &&
      data.maxSurvivors !== undefined
    ) {
      updateSurvivors(data.currentSurvivors, data.maxSurvivors);
    }
    if (data.type === "QUESTION_TIMEOUT") {
      setStep("eliminated");
    }
  };

  // 3. 초기 로드 및 소켓 구독
  useEffect(() => {
    loadQuestionData();
    if (quizId) {
      subscribeToQuestion(quizId, questionId, handleServerMessage);
    }
  }, [quizId, questionId]);

  // 4. 정답 제출
  const submitAnswer = async (optionId: number) => {
    if (hasSubmitted || !quizId || !accessToken) return;
    setHasSubmitted(true);

    try {
      const res = await axiosInstance.post(
        `/quizzes/${quizId}/questions/${questionId}`,
        { optionId },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      const { survived } = res.data.data;
      setStep(survived ? "waiting" : "eliminated");
    } catch (err) {
      console.error("답안 제출 실패", err);
      setHasSubmitted(false);
    }
  };

  if (!questionData) return <div>문제 불러오는 중...</div>;

  return (
    <div className="flex flex-col items-center justify-center px-4 pt-12 text-center">
      <h2 className="mb-4 text-lg font-semibold">
        문제 {questionData.questionId}
      </h2>
      <p className="mb-6 text-xl">{questionData.content}</p>

      <div className="flex flex-col gap-3">
        {questionData.options.map((opt) => (
          <button
            key={opt.id}
            disabled={hasSubmitted}
            className="rounded-md bg-black px-8 py-2 text-white hover:bg-gray-800 disabled:bg-gray-300"
            onClick={() => submitAnswer(opt.id)}
          >
            {opt.content}
          </button>
        ))}
      </div>
    </div>
  );
};
