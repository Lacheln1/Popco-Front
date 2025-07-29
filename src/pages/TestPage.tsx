import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useOutletContext } from "react-router-dom";
import dayjs, { type Dayjs } from "dayjs";
import { Input, App, DatePicker, Radio, Spin } from "antd";

// API 함수 import (경로는 실제 프로젝트에 맞게 확인해주세요)
import { updateUserDetails } from "@/apis/userApi";
import { getTestMovies, type Movie } from "@/apis/preferenceApi"; // 영화 목록 API
import { getQuizQuestion, type QuestionData } from "@/apis/personaApi";

// 컴포넌트 및 에셋 import
import MovieScreen from "../components/common/MovieScreen";
import ArrowNext from "../assets/arrow-next.svg?react";
import ArrowBefore from "../assets/arrow-before.svg?react";
import Lighting from "../assets/lighting.svg?react";
import PosterInTest from "../components/test/PosterInTest";
import QuizStepLayout from "../components/test/QuizStepLayout";
import useAuthCheck from "@/hooks/useAuthCheck";

// 이미지 에셋 import
import popcoRenderingUrl from "../assets/popco-movie-start.png";
import theaterSeat1Url from "../assets/popco-theater-1.png";
import theaterSeat2Url from "../assets/popco-theater-2.png";
import theaterSeat3Url from "../assets/popco-theater-3.png";
import actionHunterCardUrl from "../assets/action-hunter-card.png";
import cryPopcoCardUrl from "../assets/cry-popco-card.png";
import warmPopcoCardUrl from "../assets/warm-popco-card.png";
import horrorPopcoCardUrl from "../assets/horror-popco-card.png";
import retroPopcoCardUrl from "../assets/retro-popco-card.png";
import imaginePopcoCardUrl from "../assets/imagine-popco-card.png";
import movieSherlockCardUrl from "../assets/movie-sherlock-card.png";

import PosterInTest from "../components/test/PosterInTest";
import QuizStepLayout from "../components/test/QuizStepLayout";
import { Input, App, DatePicker } from "antd";
import dayjs, { type Dayjs } from "dayjs";

//  임시 영화 데이터 (40개)
const tempMovieData = Array.from({ length: 40 }, (_, i) => ({
  id: `movie_${i + 1}`,
  title: `임시 영화 제목 ${i + 1}`,
  posterUrl: `https://picsum.photos/seed/${i + 1}/200/300`, // 임시 이미지
}));

const cardImageRows = [
  [actionHunterCardUrl, cryPopcoCardUrl, warmPopcoCardUrl],
  [
    horrorPopcoCardUrl,
    retroPopcoCardUrl,
    imaginePopcoCardUrl,
    movieSherlockCardUrl,
  ],
];

const TestPage = () => {
  useAuthCheck();
  const navigate = useNavigate();
  const { message } = App.useApp();
  const { step, total: TOTAL_STEPS, setStep } = useOutletContext<any>();

  // 사용자 입력 정보 State
  const [nickname, setNickname] = useState("");
  const [birthDate, setBirthDate] = useState<Dayjs | null>(null);
  const [gender, setGender] = useState("");
  const [selectedMovies, setSelectedMovies] = useState<string[]>([]);
  const [quizAnswers, setQuizAnswers] = useState<{ [key: number]: number }>({});
  const [fetchedQuizzes, setFetchedQuizzes] = useState<{
    [key: number]: QuestionData;
  }>({});
  const [isQuizLoading, setIsQuizLoading] = useState(false);

  // API 통신 및 데이터 로딩 State
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 인트로 자동 넘김 및 영화 데이터 로딩
  useEffect(() => {
    if (step === 0) {
      const timer = setTimeout(() => setStep(1), 1500);
      return () => clearTimeout(timer);
    }
    // 영화 선택 단계(step 4)에 처음 진입할 때 영화 목록을 불러옵니다.
    if (step === 4 && movies.length === 0) {
      const fetchMovies = async () => {
        setIsLoading(true);
        try {
          const movieData = await getTestMovies();
          setMovies(movieData);
        } catch (error) {
          message.error("영화 목록을 불러오는 데 실패했습니다.");
          console.error(error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchMovies();
    }
  }, [step, setStep, movies.length, message]);

  // 퀴즈 질문 데이터 로딩
  useEffect(() => {
    // 퀴즈 단계(5~9)가 아니면 실행하지 않음
    if (step < 5 || step > 9) return;

    const questionNumber = step - 4; // step 5 -> 질문 1, step 6 -> 질문 2 ...

    // 이미 불러온 질문이면 다시 요청하지 않음
    if (fetchedQuizzes[questionNumber]) return;

    const fetchQuiz = async () => {
      setIsQuizLoading(true);
      try {
        const quizData = await getQuizQuestion(questionNumber);
        setFetchedQuizzes((prev) => ({
          ...prev,
          [questionNumber]: quizData,
        }));
      } catch (error) {
        message.error("질문을 불러오는 데 실패했습니다.");
      } finally {
        setIsQuizLoading(false);
      }
    };

    fetchQuiz();
  }, [step, fetchedQuizzes, message]);

  // 최종 정보 제출 함수
  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const userDetails = {
        nickname: nickname,
        birthday: birthDate!.format("YYYY-MM-DD"),
        gender: gender,
      };
      await updateUserDetails(userDetails);
      message.success("취향 분석이 완료되었습니다!");
      setStep((prev: number) => prev + 1); // 결과 페이지로 이동
      setTimeout(() => navigate("/"), 3000); // 3초 후 메인으로 이동
    } catch (error) {
      console.error("프로필 정보 제출 실패:", error);
      message.error("정보 저장에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 다음 단계로 이동 및 유효성 검사
  const handleNext = () => {
    // 각 단계별 유효성 검사
    if (step === 2 && nickname.trim() === "")
      return message.warning("닉네임을 입력해주세요!");
    if (step === 3 && !birthDate)
      return message.warning("생년월일을 선택해주세요!");
    if (step === 3 && gender === "")
      return message.warning("성별을 선택해주세요!");
    if (step === 4 && selectedMovies.length < 3)
      return message.warning("최소 3개 이상의 컨텐츠를 선택해주세요!");
    if (step >= 5 && step <= 9) {
      // 5개의 퀴즈 단계
      if (quizAnswers[step - 4] === undefined)
        return message.warning("답변을 선택해주세요!");
    }

    // 마지막 퀴즈 단계(step 9)에서 다음 버튼 클릭 시 최종 제출
    if (step === 9) {
      handleSubmit();
    } else {
      setStep((prev: number) => Math.min(prev + 1, TOTAL_STEPS + 1));
    }
  };

  const handlePrev = () => {
    setStep((prev: number) => Math.max(1, prev - 1));
  };

  const handleToggleMovieSelect = (id: string) => {
    setSelectedMovies((prev) =>
      prev.includes(id) ? prev.filter((mId) => mId !== id) : [...prev, id],
    );
  };

  const handleSelectAnswer = (questionId: number, optionId: number) => {
    setQuizAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  // 단계별 컨텐츠 렌더링
  const renderStepContent = () => {
    const contentWrapperStyle =
      "flex h-full flex-col items-center justify-center p-4 text-center text-black";
    const headingStyle = "font-bold leading-snug text-xl lg:text-3xl";
    const paragraphStyle = "mt-4 text-gray-600 text-xs lg:text-base";

    switch (step) {
      case 0: // 인트로
        return (
          <div className="flex h-full w-full items-center justify-center overflow-hidden">
            <motion.div
              initial={{ scale: 1 }}
              animate={{ scale: 1.15 }}
              transition={{ duration: 2, ease: "easeOut" }}
            >
              <img
                src={popcoRenderingUrl}
                alt="팝코 시작 이미지"
                className="w-12/13 max-w-lg"
              />
            </motion.div>
          </div>
        );
      case 1: // 환영 메시지
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
            <div className="flex flex-1 flex-col items-center justify-center gap-y-4">
              {cardImageRows.map((row, rowIndex) => (
                <div
                  key={rowIndex}
                  className="flex flex-col items-center gap-4 md:flex-row md:flex-wrap md:justify-center"
                >
                  {row.map((imageUrl, cardIndex) => (
                    <img
                      key={cardIndex}
                      src={imageUrl}
                      alt={`취향 카드 ${cardIndex + 1}`}
                      className="w-56 rounded-md md:w-64"
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        );
      case 2: // 닉네임
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
      case 3: // 생년월일 및 성별
        return (
          <div className={contentWrapperStyle}>
            <h3 className={headingStyle}>이제 생년월일과 성별을 알려주세요!</h3>
            <p className={paragraphStyle}>
              연령대와 성별에 맞는 콘텐츠를 추천해드려요.
            </p>
            <div className="mt-8 flex w-full max-w-xs flex-col gap-4">
              <DatePicker
                placeholder="생년월일을 입력해주세요 (YYYY-MM-DD)"
                onChange={(date) => setBirthDate(date)}
                size="large"
                className="w-full"
                picker="date"
                disabledDate={(current) => current && current > dayjs()}
              />
              <Radio.Group
                onChange={(e) => setGender(e.target.value)}
                value={gender}
                size="large"
                className="flex"
              >
                <Radio.Button value="MALE" className="flex-1 text-center">
                  남성
                </Radio.Button>
                <Radio.Button value="FEMALE" className="flex-1 text-center">
                  여성
                </Radio.Button>
              </Radio.Group>
            </div>
          </div>
        );
      case 4: // 영화 선택
        return (
          <div className="flex h-full flex-col gap-4 py-4">
            <div className="px-4 text-center">
              <h3 className={headingStyle}>어떤 컨텐츠를 재밌게 보셨나요?</h3>
              <p className={paragraphStyle}>
                마음에 드는 컨텐츠를 최소 3개이상 골라주세요.
                <br />
                많이 선택하실수록 취향 분석이 정교해져요.
              </p>
            </div>
            {isLoading ? (
              <div className="flex flex-1 items-center justify-center">
                <Spin />
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto px-4 pt-2">
                <div className="grid grid-cols-3 gap-x-4 gap-y-6 lg:grid-cols-5">
                  {movies.map((movie) => (
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
            )}
          </div>
        );
      case 5:
      case 6:
      case 7:
      case 8:
      case 9: // 퀴즈 1~5
        const questionNumber = step - 4;
        const currentQuiz = fetchedQuizzes[questionNumber];

        // 로딩 중이거나 아직 데이터가 없으면 스피너 표시
        if (isQuizLoading || !currentQuiz) {
          return (
            <div className="flex h-full items-center justify-center">
              <Spin टिप="질문을 불러오는 중..." />
            </div>
          );
        }

        return (
          <QuizStepLayout
            question={currentQuiz.content}
            subText=""
            answers={currentQuiz.options}
            selectedAnswerId={quizAnswers[currentQuiz.questionId]}
            onSelectAnswer={(optionId) =>
              handleSelectAnswer(currentQuiz.questionId, optionId)
            }
          />
        );
      default:
        if (isSubmitting) {
          return (
            <div className="flex h-full flex-col items-center justify-center">
              <Spin tip="취향을 분석하고 있어요..." size="large" />
            </div>
          );
        }
        return (
          <div className={contentWrapperStyle}>
            <h2 className="text-2xl font-bold leading-snug lg:text-3xl">
              당신의 캐릭터는?
            </h2>
            <p className="mt-4 text-sm text-gray-600 lg:text-base">
              선택한 취향을 바탕으로 사용자님의 캐릭터를 찾았어요!
            </p>
            {/* TODO: 결과 캐릭터 이미지 및 설명 표시 */}
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
        <img
          src={theaterSeat1Url}
          alt="영화관 의자 1"
          className="mb-[-2%] w-[30%] lg:mb-[-2%] lg:w-[260px]"
        />
        <img
          src={theaterSeat2Url}
          alt="영화관 의자 2"
          className="-mx-4 mb-[-0%] ml-5 w-[45%] lg:w-[500px]"
        />
        <img
          src={theaterSeat3Url}
          alt="영화관 의자 3"
          className="mb-[-2%] w-[32%] lg:mb-[-2%] lg:w-[300px]"
        />
      </div>
      {/* 네비게이션 버튼 (모바일) */}
      <div className="absolute bottom-16 z-40 flex w-full items-center justify-between p-4 lg:hidden">
        {step > 1 && step <= TOTAL_STEPS ? (
          <button onClick={handlePrev} className="group p-2">
            <ArrowBefore className="h-8 w-8" />
          </button>
        ) : (
          <div aria-hidden="true" className="h-12 w-12" />
        )}
        {step > 0 && step <= TOTAL_STEPS ? (
          <button onClick={handleNext} className="group p-2">
            <ArrowNext className="h-8 w-8" />
          </button>
        ) : (
          <div aria-hidden="true" className="h-12 w-12" />
        )}
      </div>
      {/* 네비게이션 버튼 (데스크탑) */}
      {step > 1 && step <= TOTAL_STEPS ? (
        <button
          onClick={handlePrev}
          className="group absolute left-[-110px] top-1/2 z-40 hidden -translate-y-1/2 p-2 lg:block"
        >
          <ArrowBefore />
        </button>
      ) : null}
      {step > 0 && step <= TOTAL_STEPS ? (
        <button
          onClick={handleNext}
          className="group absolute right-[-110px] top-1/2 z-40 hidden -translate-y-1/2 p-2 lg:block"
        >
          <ArrowNext />
        </button>
      ) : null}
    </div>
  );
};

export default TestPage;
