import React, { useState } from "react";
import { useIsMediumUp } from "@/hooks/useMediaQuery";
import { PosterImage } from "@/components/EventPage/PosterImage";
import { EventInfoCard } from "@/components/EventPage/EventInfoCard";
import { renderCount } from "@/components/EventPage/Countdown";

const image = {
  src: "https://image.tmdb.org/t/p/original/bvVoP1t2gNvmE9ccSrqR1zcGHGM.jpg",
  alt: "F1 더 무비",
};

const EventPage = () => {
  const isMediumUp = useIsMediumUp();
  const postersToRender = isMediumUp ? 4 : 1;
  const [isButtonActive, setIsButtonActive] = useState(false);

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
          <EventInfoCard
            isButtonActive={isButtonActive}
            onCountdownEnd={() => setIsButtonActive(true)}
            renderCount={renderCount}
          />
          <img
            className="absolute left-1/2 top-[10%] w-32 -translate-x-1/2 -translate-y-1/4"
            src="images/popco/time-popco.png"
            alt="popco"
          />
        </div>
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
