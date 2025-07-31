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

// 상수처리
import { PERSONA_IMAGES } from "@/constants/persona";
import { TMDB_IMAGE_BASE_URL } from "@/constants/contents";

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
  const { user, accessToken } = useAuthCheck();
  const navigate = useNavigate();
  const { message } = App.useApp();
  const { step, total: TOTAL_STEPS, setStep } = useOutletContext<any>();

  // 사용자 입력 정보 State
  const [nickname, setNickname] = useState("");
  const [birthDate, setBirthDate] = useState<Dayjs | null>(null);
  const [gender, setGender] = useState("");
  // ✅ [수정 1] selectedMovies가 ID 배열이 아닌, 영화 객체 배열을 저장하도록 변경합니다.
  const [selectedMovies, setSelectedMovies] = useState<Movie[]>([]);
  const [quizAnswers, setQuizAnswers] = useState<{ [key: number]: number }>({});
  const [savedUserId, setSavedUserId] = useState<number | null>(null);
  // API 통신 및 데이터 로딩 State
  const [movies, setMovies] = useState<Movie[]>([]);
  const [fetchedQuizzes, setFetchedQuizzes] = useState<{
    [key: number]: QuestionData;
  }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isQuizLoading, setIsQuizLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [personaResult, setPersonaResult] = useState<OnboardingResponse | null>(
    null,
  );

  // 사용자가 진단 페이지에 직접 URL로 접근하는 것을 방지
  useEffect(() => {
    if (accessToken) {
      const checkProfileStatus = async () => {
        try {
          const userInfoResponse = await getUserDetail(accessToken);
          if (userInfoResponse?.data?.profileComplete === true) {
            message.info(
              "이미 취향 진단을 완료했습니다. 메인 페이지로 이동합니다.",
            );
            navigate("/");
          }
        } catch (error) {
          console.error("사용자 프로필 상태 확인 실패:", error);
        }
      };
      checkProfileStatus();
    }
  }, [accessToken, navigate, message]);

  // 단계별 데이터 로딩 (영화, 퀴즈)
  useEffect(() => {
    if (step === 0) {
      const timer = setTimeout(() => setStep(1), 1500);
      return () => clearTimeout(timer);
    }
    if (!accessToken) return;

    if (step === 4 && movies.length === 0) {
      const fetchMovies = async () => {
        setIsLoading(true);
        try {
          const responseData: any = await getTestMovies(accessToken);
          if (responseData && Array.isArray(responseData.contents)) {
            setMovies(responseData.contents);
          } else {
            setMovies([]);
          }
        } catch (error) {
          message.error("영화 목록을 불러오는 데 실패했습니다.");
          setMovies([]);
        } finally {
          setIsLoading(false);
        }
      };
      fetchMovies();
    }

    if (step >= 5 && step <= 9) {
      const questionNumber = step - 4;
      if (fetchedQuizzes[questionNumber]) return;
      const fetchQuiz = async () => {
        setIsQuizLoading(true);
        try {
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
  }, [step, accessToken, movies.length, fetchedQuizzes, message, setStep]);

  // 최종 정보 제출 함수 (수정된 버전)
  const handleSubmit = async () => {
    if (!accessToken) {
      message.error("인증 정보가 없습니다. 다시 로그인해주세요.");
      return;
    }

    setIsSubmitting(true);
    try {
      let userIdToUse = savedUserId;

      // 1. 저장된 userId가 없다면, 프로필 업데이트를 시도합니다.
      if (!userIdToUse) {
        const userDetails = {
          nickname: nickname,
          birthday: birthDate!.format("YYYY-MM-DD"),
          gender: gender,
        };

        console.log("=== 프로필 업데이트 시도 ===");
        console.log("업데이트할 사용자 정보:", userDetails);

        const userDetailsResponse = await updateUserDetails(
          userDetails,
          accessToken,
        );
        console.log("프로필 업데이트 응답 전체:", userDetailsResponse);
        console.log("응답 데이터:", userDetailsResponse.data);

        const receivedUserId = userDetailsResponse.data?.userId;

        if (receivedUserId) {
          console.log("프로필 업데이트로 받은 userId:", receivedUserId);
          setSavedUserId(receivedUserId);
          userIdToUse = receivedUserId;
        } else {
          console.log(
            "프로필 업데이트에서 userId를 받지 못함, 기존 user 정보 사용 시도",
          );
          console.log("기존 user 객체:", user);

          if (user && user.userId > 0) {
            userIdToUse = user.userId;
            console.log("기존 user.userId 사용:", userIdToUse);
          } else {
            throw new Error(
              "사용자 ID를 확인할 수 없습니다. 페이지를 새로고침 후 다시 시도해주세요.",
            );
          }
        }
      }

      // 2. 데이터 검증 및 변환
      const validatedFeedbackItems = selectedMovies
        .map((movie) => {
          // content_id를 명시적으로 숫자로 변환
          const contentId =
            typeof movie.id === "string" ? parseInt(movie.id, 10) : movie.id;

          // content_type 검증 및 기본값 설정
          let contentType = movie.type;
          if (
            !contentType ||
            (contentType !== "movie" && contentType !== "tv")
          ) {
            // 기본값으로 'movie' 설정 (또는 API 문서에 따라 조정)
            contentType = "movie";
            console.warn(
              `Invalid content_type for movie ${movie.id}: ${movie.type}, using 'movie' as default`,
            );
          }

          return {
            content_id: contentId,
            content_type: contentType,
          };
        })
        .filter((item) => !isNaN(item.content_id)); // 유효하지 않은 ID 제거

      // 3. initial_answers 검증
      const validatedInitialAnswers = Object.entries(quizAnswers).reduce(
        (acc, [questionId, optionId]) => {
          const key = `Q${questionId}`;
          const value = String.fromCharCode(64 + optionId); // 1->A, 2->B, 3->C, 4->D
          acc[key] = value;
          return acc;
        },
        {} as { [key: string]: string },
      );

      const personaPayload = {
        user_id: userIdToUse,
        feedback_items: validatedFeedbackItems,
        reaction_type: "좋아요" as const,
        initial_answers: validatedInitialAnswers,
      };

      console.log("--- 최종 제출 직전 데이터 확인 ---");
      console.log("사용자 ID:", userIdToUse);
      console.log("선택된 영화 수:", selectedMovies.length);
      console.log("검증된 피드백 아이템 수:", validatedFeedbackItems.length);
      console.log("퀴즈 답변 수:", Object.keys(validatedInitialAnswers).length);
      console.log(
        "페르소나 분석 요청 데이터:",
        JSON.stringify(personaPayload, null, 2),
      );
      console.log("---------------------------------");

      // 4. 기본 검증
      if (!userIdToUse || userIdToUse <= 0) {
        throw new Error("유효하지 않은 사용자 ID입니다.");
      }

      if (validatedFeedbackItems.length === 0) {
        throw new Error("선택된 컨텐츠가 없습니다.");
      }

      if (Object.keys(validatedInitialAnswers).length !== 5) {
        throw new Error("모든 퀴즈 답변이 완료되지 않았습니다.");
      }

      // 5. 페르소나 분석 요청
      console.log("=== 페르소나 분석 API 호출 시작 ===");

      let personaAnalysisResult;
      try {
        personaAnalysisResult = await getOnboardingPersona(
          personaPayload,
          accessToken,
        );
        console.log("페르소나 분석 API 응답:", personaAnalysisResult);
      } catch (apiError: any) {
        console.error("=== 페르소나 분석 API 호출 실패 ===");
        console.error("API 에러 객체:", apiError);

        if (apiError.response) {
          console.error("API 응답 상태:", apiError.response.status);
          console.error("API 응답 데이터:", apiError.response.data);
          console.error("API 응답 헤더:", apiError.response.headers);
        }

        // API 에러를 다시 throw해서 외부 catch에서 처리하도록 함
        throw apiError;
      }

      if (personaAnalysisResult && personaAnalysisResult.result === "SUCCESS") {
        console.log("페르소나 분석 성공!");
        setPersonaResult(personaAnalysisResult);
        message.success("취향 분석이 완료되었습니다!");
        setStep((prev: number) => prev + 1);
      } else {
        console.error(
          "페르소나 분석 결과가 SUCCESS가 아님:",
          personaAnalysisResult,
        );
        throw new Error(
          personaAnalysisResult?.message || "페르소나 분석에 실패했습니다.",
        );
      }
    } catch (error: any) {
      console.error("--- 최종 정보 제출 실패: 상세 에러 로그 ---");
      console.error("에러 객체 전체:", error);

      if (error.response) {
        console.error("서버 응답 데이터:", error.response.data);
        console.error("서버 응답 상태 코드:", error.response.status);
        console.error("서버 응답 헤더:", error.response.headers);

        // 서버 에러 메시지 추출
        const serverMessage =
          error.response.data?.message ||
          error.response.data?.error ||
          `서버 오류 (${error.response.status})`;
        message.error(serverMessage);
      } else if (error.request) {
        console.error("요청이 전송되었지만 응답을 받지 못함:", error.request);
        message.error(
          "서버와 통신할 수 없습니다. 네트워크 연결을 확인해주세요.",
        );
      } else {
        console.error("요청 설정 중 에러:", error.message);
        message.error(error.message || "요청을 보내는 중 문제가 발생했습니다.");
      }
      console.error("-----------------------------------------");
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

  // ✅ [수정 2] ID 문자열 대신 영화 객체 전체를 받아서 처리하도록 수정합니다.
  const handleToggleMovieSelect = (movie: Movie) => {
    setSelectedMovies((prev) =>
      prev.some((m) => m.id === movie.id)
        ? prev.filter((m) => m.id !== movie.id)
        : [...prev, movie],
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
              <h3 className="font-bold ...">어떤 컨텐츠를 재밌게 보셨나요?</h3>
              <p className="mt-4 ...">
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
                        posterUrl={`${TMDB_IMAGE_BASE_URL}${movie.posterPath}`}
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
      }
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
              <Spin tip="질문을 불러오는 중..." size="large">
                <div className="p-8" />
              </Spin>
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
      default: // 최종 결과 페이지
        if (isSubmitting) {
          return (
            <div className="flex h-full flex-col items-center justify-center">
              <Spin tip="취향을 분석하고 있어요..." size="large">
                <div className="p-8" />
              </Spin>
            </div>
          );
        }
        return (
          <div className={contentWrapperStyle}>
            {personaResult ? (
              <>
                <h2 className="text-2xl font-bold ...">당신의 캐릭터는?</h2>
                <p className="mt-2 text-sm ...">
                  선택한 취향을 바탕으로 사용자님의 캐릭터를 찾았어요!
                </p>
                <img
                  src={PERSONA_IMAGES[personaResult.main_persona]} // 매핑된 이미지
                  alt={personaResult.main_persona}
                  className="my-6 h-48 w-48"
                />
                <p className="text-xl font-bold">
                  {personaResult.main_persona.replace(/_/g, " ")}
                </p>
                <div className="mt-8 flex w-full max-w-xs gap-4">
                  <button
                    onClick={() => navigate("/analysis")}
                    className="text-popco-foot ..."
                  >
                    취향 분석 보기
                  </button>
                  <button
                    onClick={() => navigate("/")}
                    className="bg-popco-foot ..."
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
