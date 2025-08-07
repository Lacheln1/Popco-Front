import { QuestionData, RawQuestionResponse } from "@/types/Quiz.types";

export const mapRawQuestionToClientFormat = (
  raw: RawQuestionResponse,
): QuestionData => {
  return {
    questionId: raw.questionId,
    content: raw.content,
    firstCapacity: raw.firstCapacity,
    options: raw.options.map((opt, index) => ({
      id: index,
      content: opt.content,
    })),
  };
};
