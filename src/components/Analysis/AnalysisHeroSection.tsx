import Spinner from "../common/Spinner";

interface AnalysisHeroSectionProps {
  mainPersonaImgPath: string;
  mainPersonaName: string;
  mainPersonaPercent: number;
  myPersonaImgPath: string; // 왼쪽 역할 이미지
  myPersonaName: string; //왼쪽 역할 설명
  subPersonaImgPath: string;
  subPersonaName: string;
  subPersonaPercent: number;
  personaText1: string;
  personaText2: string;
}

const AnalysisHeroSection: React.FC<AnalysisHeroSectionProps> = ({
  mainPersonaImgPath,
  mainPersonaName,
  mainPersonaPercent,
  myPersonaImgPath,
  myPersonaName,
  subPersonaImgPath,
  subPersonaName,
  subPersonaPercent,
  personaText1,
  personaText2,
}) => {
  const isPersonaTextReady = personaText1 && personaText2;
  if (!isPersonaTextReady) {
    return (
      <div>
        <Spinner />
      </div>
    );
  }
  return (
    <div className="pretendard">
      <div className="relative h-[400px] overflow-hidden md:h-[445px] lg:h-[500px]">
        <div
          className="bg-footerBlue absolute inset-0"
          style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 80%)" }} //왼쪽 상단을 기준으로(x,y), 오른쪽 상단(x,y), 오른쪽 하단, 왼쪽 하단
        ></div>

        {/* 컨텐츠 */}
        <div className="relative mx-auto h-full w-full">
          {/* 메인 텍스트 */}
          <div className="absolute left-1/2 top-32 w-60 -translate-x-1/2 transform md:w-full">
            <h1 className="gmarket-medium text-center text-2xl text-white md:text-3xl lg:text-4xl">
              POPCO가 알려주는 나의 OTT 취향은?
            </h1>
          </div>

          {/* 캐릭터 이미지 및 텍스트 */}
          <div className="flex pt-56">
            <div className="mx-auto flex">
              <div className="absolute flex -translate-x-[107px] -translate-y-10 flex-col pt-4 md:-translate-x-[150px] lg:-translate-x-96 lg:-translate-y-[5px] xl:-translate-x-[500px]">
                <span className="gmarket-medium lg:bg-popco-main mb-2 whitespace-nowrap px-1 py-1 text-white md:text-xl lg:text-black">
                  {personaText1}
                </span>
                <img
                  src="/images/persona/Persona-text-line.svg"
                  alt="텍스트 라인"
                  className="hidden object-cover lg:ml-36 lg:inline lg:w-52 xl:ml-56 xl:w-64"
                />
              </div>
              <div className="absolute flex -translate-x-[107px] translate-y-[-15px] flex-col pt-3 md:translate-x-[-151px] md:translate-y-[-8px] lg:-translate-x-[-190px] lg:-translate-y-[-70px] xl:ml-10 xl:-translate-y-[10px] xl:translate-x-[230px] xl:pt-12">
                <span className="gmarket-medium mb-2 whitespace-nowrap px-1 py-1 text-white md:text-xl">
                  {personaText2}
                </span>
                <img
                  src="/images/persona/Persona-text-line.svg"
                  alt="텍스트 라인"
                  className="hidden -scale-x-100 object-cover lg:ml-8 lg:inline lg:w-52 xl:ml-0 xl:w-64"
                />
              </div>
              <img
                src={`${myPersonaImgPath}`}
                alt="캐릭터이미지"
                className="s h-[150px] w-[150px] translate-y-7 object-cover md:mt-5 md:h-[200px] md:w-[200px] lg:h-[220px] lg:w-[220px]"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="gmarket-medium mt-5 flex justify-center text-3xl md:mt-8 md:text-4xl lg:mt-0">
        {myPersonaName}
      </div>

      <div className="flex justify-around">
        <div className="mt-3 flex w-full items-center px-3 md:max-w-[700px] md:px-1 lg:max-w-[1200px]">
          <div>
            <div className="flex justify-center">
              <img
                src={`${mainPersonaImgPath}`}
                alt="액션 헌터"
                className="h-16 w-16"
              />
            </div>
            <span className="text-sm md:text-lg lg:text-xl xl:text-2xl">
              {mainPersonaName}
            </span>
          </div>
          <div className="mx-2 flex h-4 flex-1 overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full bg-red-400"
              style={{ width: `${mainPersonaPercent}%` }}
            ></div>
            <div
              className="h-full bg-blue-400"
              style={{ width: `${subPersonaPercent}%` }}
            ></div>
          </div>
          <div className="">
            <div className="flex justify-center">
              <img
                src={`${subPersonaImgPath}`}
                alt="온기 수집가"
                className="h-16 w-16"
              />
            </div>
            <span className="text-sm md:text-lg lg:text-xl xl:text-2xl">
              {subPersonaName}
            </span>
          </div>
        </div>
      </div>
      <div className="flex justify-center">
        <div className="relative -top-5 flex w-full justify-around px-3 md:max-w-[700px] md:px-1 lg:max-w-[1200px]">
          <div className="md:text-lg lg:text-xl xl:text-2xl">
            {mainPersonaPercent}%
          </div>
          <div className="md:text-lg lg:text-xl xl:text-2xl">
            {subPersonaPercent}%
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisHeroSection;
