import axiosInstance from "@/apis/axiosInstance";
import useAuthCheck from "@/hooks/useAuthCheck";
import { useQuizStore } from "@/stores/useQuizStore";
import { App } from "antd";

export const Question = () => {
  const { accessToken } = useAuthCheck();
  const { questionData, hasSubmitted, setHasSubmitted, quizId, questionId } =
    useQuizStore();
  const { message } = App.useApp();

  const submit = async (optionId: number) => {
    if (!accessToken) {
      message.error("회원만 참여 가능한 이벤트입니다.");
      return;
    }

    if (hasSubmitted) return;
    setHasSubmitted(true);

    try {
      const headers = accessToken
        ? { Authorization: `Bearer ${accessToken}` }
        : {};
      const res = await axiosInstance.post(
        `/quizzes/${quizId}/questions/${questionId}`,
        { optionId },
        { headers },
      );
      const { survived } = res.data.data;
      if (survived) {
        // 생존자 대기방으로 이동
        navigate("/waiting-room");
      } else {
        navigate("/eliminated");
      }
    } catch (e) {
      setHasSubmitted(false);
    }
  };
  return (
    <div>
      <h3>{questionData?.content}</h3>
      {questionData?.options.map((opt) => (
        <button
          key={opt.id}
          onClick={() => submit(opt.id)}
          disabled={hasSubmitted}
        >
          {opt.content}
        </button>
      ))}
    </div>
  );
};
