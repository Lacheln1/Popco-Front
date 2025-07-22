const HeroPersonaBanner = () => {
  return (
    <section className="relative">
      <div className="mx-auto flex min-h-[450px] w-full max-w-[1200px] items-center px-3 md:px-6 lg:px-0">
        <div className="flex max-w-[440px] flex-col gap-6">
          <div>
            <div className="text-popco-foot mb-3 text-lg font-bold">
              PERSONA
            </div>
            <h1 className="gmarket font-medium">
              이곳저곳 흩어진
              <br />
              나의 작품 취향들을
              <br />
              캐릭터로 모아 한눈에
            </h1>
          </div>
          <div className="text-xl">
            나와 닮은 페르소나를 가진 사람들이 즐긴 작품 추천까지
            <br /> 캐릭터와 함께 새로운 작품 세계를 즐겨보세요
          </div>
          <button className="bg-popco-foot w-fit rounded-full px-7 py-4 text-white">
            내 페르소나 구경하기
          </button>
        </div>
        <div className="relative w-3/5">
          <img
            className="absolute top-0 translate-x-[15%]"
            src="/images/main/persona-3.svg"
            alt="character-1"
          />
          <img
            className="absolute bottom-0 translate-x-1/4"
            src="/images/main/persona-4.svg"
            alt="character-2"
          />
          <img
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            src="/images/main/persona-5.svg"
            alt="character-3"
          />
          <img
            className="absolute bottom-0 left-1/2 -translate-y-1/2 translate-x-[100%]"
            src="/images/main/persona-6.svg"
            alt="character-4"
          />
          <img
            className="absolute right-0 top-0 -translate-y-[15%] translate-x-[45%]"
            src="/images/main/persona-7.svg"
            alt="character-5"
          />
        </div>
      </div>
      <img
        className="absolute -left-[10%] bottom-0"
        src="/images/main/persona1.svg"
        alt="character-end"
      />
      <img
        className="absolute -right-[10%] bottom-0"
        src="/images/main/persona2.svg"
        alt="character-end"
      />
    </section>
  );
};

export default HeroPersonaBanner;
