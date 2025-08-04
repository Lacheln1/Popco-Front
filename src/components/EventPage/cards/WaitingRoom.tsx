import React, { useEffect } from "react";
import axios from "axios";
import { useQuizStore } from "@/stores/useQuizStore";
import useAuthCheck from "@/hooks/useAuthCheck";

export const WaitingRoom = () => {
  const { accessToken } = useAuthCheck();
  const { quizId, questionId, survivors, updateSurvivors, nextQuestion } =
    useQuizStore();

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await axios.get(
          `/quizzes/${quizId}/questions/${questionId}/status`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );

        const { currentSurvivors, maxSurvivors } = res.data.data;
        updateSurvivors(currentSurvivors, maxSurvivors);

        if (currentSurvivors >= maxSurvivors) {
          clearInterval(interval);
          nextQuestion();
        }
      } catch (e) {
        console.error("생존자 수 조회 실패", e);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [quizId, questionId]);

  return (
    <div className="flex flex-col items-center justify-center px-4 pt-12 text-center">
      <h2 className="mb-4 text-xl font-semibold">🎉 정답입니다!</h2>
      <p className="mb-2">다음 문제로 이동하기 위해</p>
      <p className="mb-6 text-lg font-bold">
        생존자 정원이 찰 때까지 기다려 주세요
      </p>
      <p className="text-sm text-gray-600">
        현재 생존자: {survivors.current} / {survivors.max}
      </p>
    </div>
  );
};
