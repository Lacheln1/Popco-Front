import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useOutletContext } from "react-router-dom";
import dayjs, { type Dayjs } from "dayjs";
import { Input, App, DatePicker, Radio, Spin } from "antd";

// API 함수 import
import { updateUserDetails, getUserDetail } from "@/apis/userApi";
import { getTestMovies, type Movie } from "@/apis/preferenceApi";
import { getQuizQuestion, type QuestionData } from "@/apis/personaApi";
import {
  getOnboardingPersona,
  type OnboardingResponse,
} from "@/apis/recommendApi";

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
import babyactionhunter from "../assets/baby-action-hunter.svg";
import actionhunter from "../assets/action-hunter.svg";
import babycrypopco from "../assets/baby-cry-popco.svg";
import crypopco from "../assets/cry-popco.svg";
import babywarmpopco from "../assets/baby-warm-popco.svg";
import warmpopco from "../assets/warm-popco.svg";
import babyhorrorpopco from "../assets/baby-horror-popco.svg";
import horrorpopco from "../assets/horror-popco.svg";
import babyretropopco from "../assets/baby-retro-popco.svg";
import retropopco from "../assets/retro-popco.svg";
import babyimaginepopco from "../assets/baby-imagine-popco.svg";
import imaginepopco from "../assets/imagine-popco.svg";
import babymoviesherlock from "../assets/baby-movie-sherlock.svg";
import moviesherlock from "../assets/movie-sherlock.svg";

const cardImageRows = [
  [actionHunterCardUrl, cryPopcoCardUrl, warmPopcoCardUrl],
  [
    horrorPopcoCardUrl,
    retroPopcoCardUrl,
    imaginePopcoCardUrl,
    movieSherlockCardUrl,
  ],
];

const personaImages: { [key: string]: string } = {
  "아기 액션 헌터": babyactionhunter,
  "액션 헌터": actionhunter,
  "아기 시네파 울보": babycrypopco,
  "시네파 울보": crypopco,
  "아기 따끈 감성파": babywarmpopco,
  "따끈 감성파": warmpopco,
  "아기 호러 수집가": babyhorrorpopco,
  "호러 수집가": horrorpopco,
  "아기 레트로 탐험가": babyretropopco,
  "레트로 탐험가": retropopco,
  "아기 상상가": babyimaginepopco,
  상상가: imaginepopco,
  "아기 무비 셜록": babymoviesherlock,
  "무비 셜록": moviesherlock,
};

const TestPage = () => {
  const { accessToken } = useAuthCheck();
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
  const [personaResult, setPersonaResult] = useState<OnboardingResponse | null>(
    null,
  );

  //사용자가 진단페이지 직접 못하게
  useEffect(() => {
    // accessToken이 있어야만 사용자 정보를 확인할 수 있습니다.
    if (accessToken) {
      const checkProfileStatus = async () => {
        try {
          // 사용자 상세 정보를 불러옵니다.
          const userInfoResponse = await getUserDetail(accessToken);

          // profileComplete가 true이면, 이미 진단을 완료한 사용자입니다.
          if (userInfoResponse.data.profileComplete === true) {
            message.info(
              "이미 취향 진단을 완료했습니다. 메인 페이지로 이동합니다.",
            );
            navigate("/"); // 메인 페이지로 리디렉션
          }
          // false인 경우, 이 페이지에 머무르며 테스트를 계속 진행합니다.
        } catch (error) {
          console.error("사용자 프로필 상태 확인 실패:", error);
          message.error("사용자 정보 확인에 실패했습니다.");
        }
      };

      checkProfileStatus();
    }
    // accessToken이 변경될 때마다 이 효과를 실행합니다.
  }, [accessToken, navigate, message]);

  // 인트로 자동 넘김 및 영화 데이터 로딩
  useEffect(() => {
    // 인트로 로직
    if (step === 0) {
      const timer = setTimeout(() => setStep(1), 1500);
      return () => clearTimeout(timer);
    }

    // 영화 데이터 로딩 로직
    if (step === 4 && accessToken) {
      const fetchMovies = async () => {
        if (movies.length > 0) return;

        setIsLoading(true);
        try {
          const responseData: any = await getTestMovies(accessToken);
          console.log("API로부터 받은 영화 데이터:", responseData);

          // ✅ 핵심 수정 부분!
          // responseData 객체 안의 'contents' 배열이 있는지 확인합니다.
          if (responseData && Array.isArray(responseData.contents)) {
            // 'contents' 배열을 movies state에 저장합니다.
            setMovies(responseData.contents);
          } else {
            console.error(
              "API 응답에 'contents' 배열이 없습니다:",
              responseData,
            );
            setMovies([]);
          }
        } catch (error) {
          message.error("영화 목록을 불러오는 데 실패했습니다.");
          console.error(error);
          setMovies([]);
        } finally {
          setIsLoading(false);
        }
      };
      fetchMovies();
    }
    // 의존성 배열
  }, [step, accessToken, movies.length, message]);

  // 퀴즈 질문 데이터 로딩
  useEffect(() => {
    if (step < 5 || step > 9) return;
    const questionNumber = step - 4;
    if (fetchedQuizzes[questionNumber]) return;

    // accessToken이 준비되었을 때만 API를 호출
    if (accessToken) {
      const fetchQuiz = async () => {
        setIsQuizLoading(true);
        try {
          // getQuizQuestion 호출 시 accessToken 전달
          const quizData = await getQuizQuestion(questionNumber, accessToken);
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
    }
  }, [step, fetchedQuizzes, message, accessToken]);

  // 최종 정보 제출 함수
  const handleSubmit = async () => {
    if (!accessToken) {
      message.error("인증 정보가 없습니다. 다시 로그인해주세요.");
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. 프로필 정보를 담은 객체 생성
      const userDetails = {
        nickname: nickname,
        birthday: birthDate!.format("YYYY-MM-DD"),
        gender: gender,
      };

      // 2. 페르소나 분석에 필요한 정보 객체 생성
      const personaPayload = {
        feedback_items: selectedMovies.map((id) => ({
          content_id: Number(id),
          content_type: "movie",
        })),
        reaction_type: "좋아요" as const,
        initial_answers: Object.entries(quizAnswers).reduce(
          (acc, [key, value]) => {
            acc[key] = String(value);
            return acc;
          },
          {} as { [key: string]: string },
        ),
      };

      // 3. Promise.all을 사용해 두 API를 동시에 호출
      const [_, personaResult] = await Promise.all([
        updateUserDetails(userDetails, accessToken),
        getOnboardingPersona(personaPayload, accessToken),
      ]);

      // 4. 페르소나 분석 결과(personaResult)를 state에 저장
      setPersonaResult(personaResult);

      message.success("취향 분석이 완료되었습니다!");
      setStep((prev: number) => prev + 1); // 결과 페이지로 이동
    } catch (error) {
      console.error("최종 정보 제출 실패:", error);
      message.error("정보 저장 또는 분석에 실패했습니다. 다시 시도해주세요.");
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
        const imageBaseUrl = "https://image.tmdb.org/t/p/w500";
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
                  {movies.map((movie) => {
                    return (
                      <PosterInTest
                        key={movie.id}
                        id={String(movie.id)}
                        title={movie.title}
                        posterUrl={`${imageBaseUrl}${movie.posterPath}`}
                        isSelected={selectedMovies.includes(String(movie.id))}
                        onToggleSelect={() =>
                          handleToggleMovieSelect(String(movie.id))
                        }
                      />
                    );
                  })}
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
              <Spin tip="질문을 불러오는 중..." />
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
      default: // 최종 결과 페이지 (step 10)
        if (isSubmitting) {
          return (
            <div className="flex h-full flex-col items-center justify-center">
              <Spin tip="취향을 분석하고 있어요..." size="large" />
            </div>
          );
        }

        // personaResult state를 사용하여 결과 화면 렌더링
        return (
          <div className="flex h-full flex-col items-center justify-center p-4 text-center text-black">
            {personaResult ? (
              <>
                <h2 className="text-2xl font-bold leading-snug lg:text-3xl">
                  당신의 캐릭터는?
                </h2>
                <p className="mt-2 text-sm text-gray-600 lg:text-base">
                  선택한 취향을 바탕으로 사용자님의 캐릭터를 찾았어요!
                </p>
                <img
                  src={personaImages[personaResult.main_persona]} // 매핑된 이미지
                  alt={personaResult.main_persona}
                  className="my-6 h-48 w-48"
                />
                <p className="text-xl font-bold">
                  {personaResult.main_persona}
                </p>

                <div className="mt-8 flex w-full max-w-xs gap-4">
                  {/* "취향 분석 보기" 버튼 */}
                  <button
                    onClick={() => navigate("/analysis")}
                    className="text-popco-foot flex-1 rounded-full border border-[var(--color-popcoFootColor)] bg-white py-3 font-semibold transition-colors hover:bg-yellow-50"
                  >
                    취향 분석 보기
                  </button>
                  {/* "POPCO 시작하기" 버튼 */}
                  <button
                    onClick={() => navigate("/")}
                    className="bg-popco-foot flex-1 rounded-full py-3 font-semibold text-white transition-colors hover:brightness-95"
                  >
                    POPCO 시작하기
                  </button>
                </div>
              </>
            ) : (
              <p>캐릭터 정보를 불러오는 데 실패했습니다.</p>
            )}
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
