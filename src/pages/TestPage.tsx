import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useOutletContext } from "react-router-dom";

import MovieScreen from "../components/common/MovieScreen";
import ArrowNext from "../assets/arrow-next.svg?react";
import ArrowBefore from "../assets/arrow-before.svg?react";
import Lighting from "../assets/lighting.svg?react";

import PopcoRendering from "../assets/popco-movie-start.svg?react";
import TheaterSeat1 from "../assets/popco-theater-1.svg?react";
import TheaterSeat2 from "../assets/popco-theater-2.svg?react";
import TheaterSeat3 from "../assets/popco-theater-3.svg?react";

import ActionHunterCard from "../assets/action-hunter-card.svg?react";
import CryPopcoCard from "../assets/cry-popco-card.svg?react";
import WarmPopcoCard from "../assets/warm-popco-card.svg?react";
import HorrorPopcoCard from "../assets/horror-popco-card.svg?react";
import RetroPopcoCard from "../assets/retro-popco-card.svg?react";
import ImaginePopcoCard from "../assets/imagine-popco-card.svg?react";
import MovieSherlockCard from "../assets/movie-sherlock-card.svg?react";

import PosterInTest from "../components/test/PosterInTest";
import QuizStepLayout from "../components/test/QuizStepLayout";
import { Input, App, ConfigProvider, DatePicker, message } from "antd";
import dayjs, { type Dayjs } from "dayjs";

//  임시 영화 데이터 (40개)
const tempMovieData = Array.from({ length: 40 }, (_, i) => ({
  id: `movie_${i + 1}`,
  title: `임시 영화 제목 ${i + 1}`,
  posterUrl: `https://picsum.photos/seed/${i + 1}/200/300`, // 임시 이미지
}));

const cardRows = [
  [ActionHunterCard, CryPopcoCard, WarmPopcoCard],
  [HorrorPopcoCard, RetroPopcoCard, ImaginePopcoCard, MovieSherlockCard],
];

type TestContextType = {
  step: number;
  total: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
};

// 임시질문
const quizData = {
  5: {
    question: "어떤 상황에서 영화를 자주 보시나요?",
    subText: "알려주신 내용을 기반으로 컨텐츠를 추천해드릴게요!",
    answers: [
      "스트레스 풀고 싶을 때",
      "혼자 조용히 감상에 젖고 싶을 때",
      "상상력 자극받고 싶을 때",
      "뭔가 알고 싶고 추리하고 싶을 때",
    ],
  },
  6: {
    question: "두 번째 질문",
    subText: "두 번째 질문 부연설명",
    answers: ["답1", "답2", "답3", "답4"],
  },
  7: {
    question: "세 번째 질문",
    subText: "세 번째 질문 부연설명",
    answers: ["답1", "답2", "답3", "답4"],
  },
  8: {
    question: "네 번째 질문",
    subText: "네 번째 질문 부연설명",
    answers: ["답1", "답2", "답3", "답4"],
  },
};

const TestPage = () => {
  const {
    step,
    total: TOTAL_QUESTIONS,
    setStep,
  } = useOutletContext<TestContextType>();

  const [nickname, setNickname] = useState("");
  const [birthDate, setBirthDate] = useState<Dayjs | null>(null);
  const [selectedMovies, setSelectedMovies] = useState<string[]>([]);
  const [quizAnswers, setQuizAnswers] = useState<{ [key: number]: number }>({});

  useEffect(() => {
    if (step === 0) {
      const timer = setTimeout(() => {
        setStep(1);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [step, setStep]);

  const handleSelectAnswer = (stepIndex: number, answerIndex: number) => {
    setQuizAnswers((prev) => ({
      ...prev,
      [stepIndex]: answerIndex,
    }));
  };

  const handleNext = () => {
    if (step === 2) {
      if (nickname.trim() === "") {
        message.warning("닉네임을 입력해주세요!");
        return;
      }
    } else if (step === 3) {
      if (!birthDate) {
        message.warning("생년월일을 선택해주세요!");
        return;
      }
    } else if (step === 4) {
      if (selectedMovies.length < 3) {
        message.warning("최소 3개 이상의 컨텐츠를 선택해주세요!");
        return;
      }
    } else if (step >= 5 && step <= 8) {
      if (quizAnswers[step] === undefined) {
        message.warning("답변을 선택해주세요!");
        return;
      }
    }
    setStep((prev: number) => Math.min(prev + 1, TOTAL_QUESTIONS + 1));
  };

  const handlePrev = () => {
    setStep((prev: number) => Math.max(1, prev - 1));
  };

  const handleToggleMovieSelect = (id: string) => {
    setSelectedMovies(
      (prevSelected) =>
        prevSelected.includes(id)
          ? prevSelected.filter((movieId) => movieId !== id) // 이미 있으면 제거
          : [...prevSelected, id], // 없으면 추가
    );
  };
  const renderStepContent = () => {
    const contentWrapperStyle =
      "flex h-full flex-col items-center justify-center p-4 text-center text-black";
    const headingStyle = "font-bold leading-snug text-xl lg:text-3xl";
    const paragraphStyle = "mt-4 text-gray-600 text-xs lg:text-base";

    switch (step) {
      case 0:
        return (
          <div className="flex h-full w-full items-center justify-center overflow-hidden">
            <motion.div
              className="ml-8 [will-change:transform]"
              initial={{ scale: 1, z: 0 }}
              animate={{ scale: 1.15, z: 0 }}
              transition={{ duration: 2, ease: "easeOut" }}
            >
              <PopcoRendering className="w-11/12 max-w-lg" />
            </motion.div>
          </div>
        );

      // 테스트 단계
      case 1:
        return (
          <div className="flex h-full flex-col items-center gap-4 py-4">
            <div className="text-center">
              <h3 className={headingStyle}>
                안녕하세요!
                <br />
                POPCO는 사용자님의 취향을 분석해 <br className="md:hidden" />{" "}
                7가지 캐릭터로 보여줘요
              </h3>
              <p className={`${paragraphStyle} mt-4`}>
                사용자님의 취향 선명도에 따라 ‘아기 팝코’와{" "}
                <br className="md:hidden" /> ‘어른 팝코’로 표현돼요.
                <br />
                앞으로 사용자님의 작품 평가에 따라 <br className="md:hidden" />{" "}
                캐릭터는 언제든 바뀔 수 있답니다.
              </p>
            </div>

            {/* 카드 렌더링 영역 */}
            <div className="flex flex-1 flex-col items-center justify-center gap-y-4">
              {cardRows.map((row, rowIndex) => (
                <div
                  key={rowIndex}
                  className="flex flex-col items-center gap-4 md:flex-row md:flex-wrap md:justify-center"
                >
                  {row.map((CardComponent, cardIndex) => (
                    <CardComponent key={cardIndex} className="w-56 md:w-64" />
                  ))}
                </div>
              ))}
            </div>
          </div>
        );
      case 2:
        return (
          <div className={contentWrapperStyle}>
            <h3 className={headingStyle}>사용자님을 뭐라고 불러드릴까요?</h3>
            <p className={paragraphStyle}>
              POPCO 닉네임으로 사용되며 <br /> 다른 사용자들에게도 보여져요!
            </p>

            <div className="mt-8 w-full max-w-xs">
              <Input
                placeholder="닉네임을 입력해주세요"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                maxLength={7}
                size="large"
                className="text-center"
              />
            </div>
          </div>
        );
      case 3:
        return (
          <div className={contentWrapperStyle}>
            <h3 className={headingStyle}>이제 생년월일을 알려주세요!</h3>
            <p className={paragraphStyle}>
              연령대에 맞는 콘텐츠를 추천해드려요.
              <br />더 즐겁게 POPCO를 즐길 수 있도록 알려주세요!
            </p>
            <div className="mt-8 w-full max-w-xs">
              <ConfigProvider
                theme={{
                  token: {
                    colorPrimary: "var(--color-popcoMainColor)",
                  },
                }}
              >
                <DatePicker
                  placeholder="생년월일을 입력해주세요 (0000-00-00)"
                  onChange={(date) => setBirthDate(date)}
                  size="large"
                  className="w-full"
                  picker="date"
                  disabledDate={(current) => current && current > dayjs()}
                />
              </ConfigProvider>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="flex h-full flex-col gap-4 py-4">
            <div className="px-4 text-center">
              <h3 className={headingStyle}>어떤 컨텐츠를 재밌게 보셨나요?</h3>
              <p className={paragraphStyle}>
                마음에 드는 컨텐츠를 최소 3개이상 골라주세요.
                <br className="md:hidden" />
                많이 선택하실수록 취향 분석이 정교해져,{" "}
                <br className="md:hidden" /> 더 완벽한 추천이 가능해요.
              </p>
            </div>

            <div className="flex-1 overflow-y-auto px-4 pt-2">
              <div className="grid grid-cols-3 gap-x-4 gap-y-6 lg:grid-cols-5">
                {tempMovieData.map((movie) => (
                  <PosterInTest
                    key={movie.id}
                    id={movie.id}
                    title={movie.title}
                    posterUrl={movie.posterUrl}
                    isSelected={selectedMovies.includes(movie.id)}
                    onToggleSelect={handleToggleMovieSelect}
                  />
                ))}
              </div>
            </div>
          </div>
        );
      case 5:
      case 6:
      case 7:
      case 8:
        const currentQuiz = quizData[step];
        return (
          <QuizStepLayout
            question={currentQuiz.question}
            subText={currentQuiz.subText}
            answers={currentQuiz.answers}
            selectedAnswer={quizAnswers[step]}
            onSelectAnswer={(answerIndex) =>
              handleSelectAnswer(step, answerIndex)
            }
          />
        );

      // ✨최종 결과 페이지(9단계)
      default: // case 9
        return (
          <div className="flex h-full flex-col items-center justify-center p-4 text-center text-black">
            <h2 className="text-2xl font-bold leading-snug lg:text-3xl">
              당신의 캐릭터는?
            </h2>
            <p className="mt-4 text-sm text-gray-600 lg:text-base">
              선택한 취향을 바탕으로 사용자님의 캐릭터를 찾았어요!
            </p>
          </div>
        );
    }
  };

  return (
    <div className="relative mx-auto flex h-full w-full max-w-6xl flex-col items-center justify-center">
      <Lighting className="absolute -left-20 -top-28 z-0 w-96 opacity-70" />
      <Lighting className="absolute -right-20 -top-28 z-0 w-96 opacity-70" />

      <div className="relative z-10 w-full px-4 lg:w-auto lg:px-0">
        <MovieScreen>{renderStepContent()}</MovieScreen>
      </div>
      <div className="pointer-events-none absolute bottom-0 z-10 flex w-full items-end justify-center">
        <TheaterSeat1 className="mb-[-15%] lg:mb-[-4%]" />
        <TheaterSeat2 className="mb-[-8%] lg:mb-[-3%]" />
        <TheaterSeat3 className="mb-[-15%] lg:mb-[-4%]" />
      </div>

      <div className="absolute bottom-16 z-40 flex w-full items-center justify-between p-4 lg:hidden">
        {step > 1 ? (
          <button
            onClick={handlePrev}
            className="group p-2 transition-transform hover:scale-110"
          >
            <ArrowBefore className="h-8 w-8" />
          </button>
        ) : (
          <div aria-hidden="true" className="h-12 w-12" />
        )}
        {step > 0 && step <= TOTAL_QUESTIONS ? (
          <button
            onClick={handleNext}
            className="group p-2 transition-transform hover:scale-110"
          >
            <ArrowNext className="h-8 w-8" />
          </button>
        ) : (
          <div aria-hidden="true" className="h-12 w-12" />
        )}
      </div>

      {step > 1 ? (
        <button
          onClick={handlePrev}
          className="group absolute left-[-110px] top-1/2 z-40 hidden -translate-y-1/2 p-2 transition-transform hover:scale-110 lg:block"
        >
          <ArrowBefore />
        </button>
      ) : null}

      {step > 0 && step <= TOTAL_QUESTIONS ? (
        <button
          onClick={handleNext}
          className="group absolute right-[-110px] top-1/2 z-40 hidden -translate-y-1/2 p-2 transition-transform hover:scale-110 lg:block"
        >
          <ArrowNext />
        </button>
      ) : null}
    </div>
  );
};

export default TestPage;
