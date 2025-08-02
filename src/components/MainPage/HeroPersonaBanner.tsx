import { useNavigate } from "react-router-dom";

const HeroPersonaBanner = () => {
  const navigate = useNavigate();
  return (
    <section className="relative">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center overflow-x-hidden px-3 md:min-h-[450px] md:flex-row md:px-6 xl:px-0">
        <div className="flex max-w-[440px] flex-col gap-6">
          <div>
            <div className="text-popco-foot mb-3 text-lg font-bold">
              PERSONA
            </div>
            <h1 className="gmarket text-2xl font-medium sm:text-3xl lg:text-4xl">
              이곳저곳 흩어진
              <br />
              나의 작품 취향들을
              <br />
              캐릭터로 모아 한눈에
            </h1>
          </div>
          <div className="min-w-[350px] text-base lg:min-w-[440px] lg:text-xl">
            나와 닮은 페르소나를 가진 사람들이 즐긴 작품 추천까지
            <br /> 캐릭터와 함께 새로운 작품 세계를 즐겨보세요
          </div>
          <button
            onClick={() => navigate("/analysis")}
            className="bg-popco-foot w-fit rounded-full px-7 py-4 text-base text-white"
          >
            내 페르소나 구경하기
          </button>
        </div>
        <div className="relative md:w-3/5">
          <img
            className="absolute top-0 -translate-x-[25%] lg:translate-x-[15%]"
            src="/images/main/persona-3.svg"
            alt="character-1"
          />
          <img
            className="absolute bottom-8 -translate-x-[20%] lg:bottom-0 lg:translate-x-1/4"
            src="/images/main/persona-4.svg"
            alt="character-2"
          />
          <img
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            src="/images/main/persona-5.svg"
            alt="character-3"
          />
        </div>
      </div>
      {/* 모바일 위치 */}
      <img
        className="absolute top-0 z-[-1] hidden w-[40vw] -translate-x-[25%] blur-sm 2sm:block md:hidden"
        src="/images/main/persona1.svg"
        alt="character-1"
      />
      <img
        className="absolute right-0 top-[20%] hidden w-32 -translate-x-1/2 -translate-y-1/2 sm:block md:hidden"
        src="/images/main/persona-5.svg"
        alt="character-3"
      />
      <img
        className="absolute bottom-24 -translate-y-1/2 translate-x-[100%] md:left-[50%] md:top-[10%] lg:left-[62%]"
        src="/images/main/persona-6.svg"
        alt="character-4"
      />
      <img
        className="absolute right-[10%] w-44 -translate-y-[45%] translate-x-[10%] md:bottom-0 md:right-[5%] md:translate-y-[15%] lg:right-1/4 lg:translate-x-[60%] 2xl:w-auto"
        src="/images/main/persona-7.svg"
        alt="character-5"
      />
      <img
        className="absolute z-[-1] hidden md:-left-[10%] md:bottom-0 xl:block"
        src="/images/main/persona1.svg"
        alt="character-end"
      />
      <img
        className="absolute hidden md:-right-[10%] md:bottom-0 3xl:block"
        src="/images/main/persona2.svg"
        alt="character-end"
      />
    </section>
  );
};

export default HeroPersonaBanner;
