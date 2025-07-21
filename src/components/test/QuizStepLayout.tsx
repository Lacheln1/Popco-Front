import React from "react";

type QuizStepLayoutProps = {
  question: string;
  subText: string;
  answers: string[];
  selectedAnswer?: number; // 선택된 답변의 인덱스
  onSelectAnswer: (index: number) => void;
};

const QuizStepLayout: React.FC<QuizStepLayoutProps> = ({
  question,
  subText,
  answers,
  selectedAnswer,
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
        {answers.map((answer, index) => {
          const isSelected = selectedAnswer === index;
          return (
            <button
              key={index}
              onClick={() => onSelectAnswer(index)}
              className={`rounded-full border px-6 py-3 text-sm font-semibold transition-colors lg:text-base ${
                isSelected
                  ? "border-popco-main bg-popco-main"
                  : "border-gray-300 bg-white text-black hover:bg-gray-100"
              }`}
            >
              {answer}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuizStepLayout;