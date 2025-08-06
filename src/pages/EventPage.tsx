import React, { useEffect } from "react";
import { useIsMediumUp } from "@/hooks/useMediaQuery";
import { PosterImage } from "@/components/EventPage/PosterImage";
import { EventInfoCard } from "@/components/EventPage/cards/EventInfoCard";
import { Question } from "@/components/EventPage/cards/Question";
import { WaitingRoom } from "@/components/EventPage/cards/WaitingRoom";
import { Eliminated } from "@/components/EventPage/cards/Eliminated";
import { FinalWinner } from "@/components/EventPage/cards/FinalWinner";
import { useQuizStore } from "@/stores/useQuizStore";
import { useNavigate } from "react-router-dom";
import useAuthCheck from "@/hooks/useAuthCheck";
import { useQuizInfo } from "@/hooks/queries/quiz/useQuizInfo";
import { App } from "antd";

const image = {
  src: "https://image.tmdb.org/t/p/original/bvVoP1t2gNvmE9ccSrqR1zcGHGM.jpg",
  alt: "F1 더 무비",
};

const EventPage = () => {
  const { message } = App.useApp();
  const navigate = useNavigate();
  const { accessToken } = useAuthCheck();
  const { data, isLoading } = useQuizInfo(accessToken);
  const isMediumUp = useIsMediumUp();
  const postersToRender = isMediumUp ? 4 : 1;
  const [isButtonActive, setIsButtonActive] = React.useState(false);
  const { step, setQuizId } = useQuizStore();

  useEffect(() => {
    if (data && !data.quizPageAccess) {
      navigate("/", { replace: true });
      message.error("오늘은 퀴즈가 없습니다.");
    }
  }, [accessToken, isLoading, data, navigate]);

  useEffect(() => {
    if (data?.quizDetail?.quizId !== undefined) {
      setQuizId(data.quizDetail.quizId);
    }
  }, [data]);

  if (isLoading) {
    return <div className="mt-20 text-center">퀴즈 정보를 불러오는 중...</div>;
  }

  const renderStepComponent = () => {
    switch (step) {
      case "entry":
        return (
          <EventInfoCard
            isButtonActive={isButtonActive}
            onCountdownEnd={() => setIsButtonActive(true)}
          />
        );
      case "question":
        return <Question />;
      case "waiting":
        return <WaitingRoom />;
      case "eliminated":
        return <Eliminated />;
      case "winner":
        return <FinalWinner />;
      default:
        return <div>알 수 없는 단계입니다.</div>;
    }
  };

  return (
    <div className="bg-[#eee]">
      <div
        className="relative mx-auto min-h-[330px] w-full"
        style={{
          backgroundRepeat: "no-repeat",
          backgroundImage:
            "linear-gradient(352deg, transparent 45.2%, #bbb 45.5%, #bbb 45.6%, #ccc 45.8%, #eee 60%)," +
            "linear-gradient(30deg, #ccc, #eee 90%)",
          backgroundSize: "100% 32.4em",
          backgroundPosition: "50% 108%",
        }}
      >
        <div className="relative mt-16 h-screen pt-20 md:mt-0">
          {renderStepComponent()}

          <img
            className="absolute left-1/2 top-[10%] w-32 -translate-x-1/2 -translate-y-1/4"
            src="images/popco/time-popco.png"
            alt="popco"
          />
        </div>

        {/* 포스터는 그대로 유지 */}
        <>
          <div className="hidden 2sm:block md:hidden">
            <PosterImage idx={2} image={image} />
            <PosterImage idx={1} image={image} />
          </div>
          <div className="hidden md:block">
            {Array.from({ length: postersToRender }, (_, idx) => (
              <PosterImage key={idx} idx={idx} image={image} />
            ))}
          </div>
        </>
      </div>
    </div>
  );
};

export default EventPage;
