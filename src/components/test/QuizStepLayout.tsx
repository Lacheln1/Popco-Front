import React from "react";

type AnswerOption = {
  optionId: number;
  content: string;
};

type QuizStepLayoutProps = {
  question: string;
  subText: string;
  answers: AnswerOption[]; // string[] 에서 AnswerOption[] 으로 변경
  selectedAnswerId?: number; // 선택된 답변의 'optionId'
  onSelectAnswer: (optionId: number) => void; // 'optionId'를 인자로 받도록 변경
};

const QuizStepLayout: React.FC<QuizStepLayoutProps> = ({
  question,
  subText,
  answers,
  selectedAnswerId,
  onSelectAnswer,
}) => {
  const headingStyle = "font-bold leading-snug text-xl lg:text-2xl";
  const paragraphStyle = "mt-4 text-gray-600 text-xs lg:text-sm";

  return (
    <div className="flex h-full flex-col items-center justify-center gap-8 p-4 text-center">
      {/* 질문 텍스트 */}
      <div>
        <h3 className={headingStyle}>{question}</h3>
        <p className={paragraphStyle}>{subText}</p>
      </div>

      {/* 답변 선택지 */}
      <div className="flex w-full max-w-sm flex-col gap-3">
        {answers.map((option) => {
          const isSelected = selectedAnswerId === option.optionId;
          return (
            <button
              key={option.optionId}
              onClick={() => onSelectAnswer(option.optionId)}
              className={`font-regular break-keep rounded-full border px-8 py-3 text-sm transition-colors lg:text-base ${
                isSelected
                  ? "border-popco-main bg-popco-main text-black"
                  : "border-gray-300 bg-white text-black hover:bg-gray-100"
              }`}
            >
              {option.content}{" "}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuizStepLayout;
