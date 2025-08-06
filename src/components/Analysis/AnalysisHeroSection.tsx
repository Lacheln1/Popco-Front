import Spinner from "../common/Spinner";
import { motion } from "framer-motion";
import { pageVariants } from "@/components/LoginResgisterPage/Animation";

interface AnalysisHeroSectionProps {
  mainPersonaImgPath: string;
  mainPersonaName: string;
  mainPersonaPercent: number;
  myPersonaImgPath: string; // 왼쪽 역할 이미지
  myPersonaName: string; //왼쪽 역할 설명
  subPersonaImgPath: string;
  subPersonaName: string;
  subPersonaPercent: number;
  personaText1?: string; // optional로 변경
  personaText2?: string; // optional로 변경
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
  return (
    <motion.div
      className="pretendard"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="relative h-[400px] overflow-hidden md:h-[445px] lg:h-[500px]">
        <div
          className="bg-footerBlue absolute inset-0"
          style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 80%)" }}
        ></div>

        {/* 컨텐츠 */}
        <div className="relative mx-auto h-full w-full">
          {/* 메인 텍스트 */}
          <div className="absolute left-1/2 top-24 w-60 -translate-x-1/2 transform md:top-28 md:w-full lg:top-32">
            <motion.h1
              className="gmarket-medium text-center text-2xl text-white md:text-3xl lg:text-4xl"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              POPCO가 알려주는 나의 OTT 취향은?
            </motion.h1>
          </div>

          {/* 캐릭터 이미지 및 텍스트 */}
          <div className="flex pt-56">
            <div className="mx-auto flex">
              <div className="absolute flex -translate-x-[120px] -translate-y-[70px] flex-col pt-4 md:-translate-x-[162px] lg:-translate-x-[480px] lg:-translate-y-[5px] xl:-translate-x-[450px]">
                {personaText1 ? (
                  <motion.span
                    className="gmarket-medium lg:bg-popco-main mb-2 inline translate-x-16 whitespace-nowrap px-1 py-1 text-white md:translate-x-20 md:text-xl lg:mb-5 lg:text-black xl:translate-x-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                  >
                    {personaText1}
                  </motion.span>
                ) : (
                  <div className="mb-2 flex h-8 translate-x-40 items-center px-1 py-1 md:h-10 md:translate-x-56 lg:translate-x-36">
                    <Spinner />
                  </div>
                )}
                <img
                  src="/images/persona/Persona-text-line.svg"
                  alt="텍스트 라인"
                  className="hidden object-cover lg:inline lg:w-52 lg:translate-x-64 xl:w-64 xl:translate-x-48"
                />
              </div>

              <div className="absolute flex -translate-x-[80px] translate-y-[-45px] flex-col pt-3 md:-translate-x-[122px] md:translate-y-[-40px] lg:-translate-x-[-220px] lg:-translate-y-[-70px] xl:ml-10 xl:-translate-y-[10px] xl:translate-x-[230px] xl:pt-12">
                {personaText2 ? (
                  <motion.span
                    className="gmarket-medium mb-2 translate-x-6 whitespace-nowrap px-1 py-1 text-white md:translate-x-10 md:text-xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7, duration: 0.5 }}
                  >
                    {personaText2}
                  </motion.span>
                ) : (
                  <div className="mb-2 flex h-8 translate-x-[122px] items-center px-1 py-1 md:h-10 md:translate-x-[185px] lg:translate-x-0">
                    <Spinner />
                  </div>
                )}
                <img
                  src="/images/persona/Persona-text-line.svg"
                  alt="텍스트 라인"
                  className="hidden -scale-x-100 object-cover lg:ml-8 lg:inline lg:w-52 xl:ml-0 xl:w-64"
                />
              </div>

              <motion.img
                src={`${myPersonaImgPath}`}
                alt="캐릭터이미지"
                className="z-99 h-[150px] w-[150px] translate-y-7 object-cover md:mt-5 md:h-[200px] md:w-[200px] lg:h-[220px] lg:w-[220px]"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  delay: 0.5,
                  duration: 0.8,
                  type: "spring",
                  stiffness: 200,
                  damping: 20,
                }}
                whileHover={{
                  scale: 1.05,
                  transition: { duration: 0.3 },
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="gmarket-medium mt-5 flex justify-center text-3xl md:mt-8 md:text-3xl lg:mt-0">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          {myPersonaName}
        </motion.span>
      </div>

      <div className="flex justify-around">
        <div className="mt-3 flex w-full items-center px-3 md:max-w-[700px] md:px-1 lg:max-w-[1200px]">
          <div>
            <div className="flex justify-center">
              <motion.img
                src={`${mainPersonaImgPath}`}
                alt="액션 헌터"
                className="h-16 w-16"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.0, duration: 0.5 }}
                whileHover={{ scale: 1.1 }}
              />
            </div>
            <span className="text-sm md:text-lg lg:text-xl xl:text-2xl">
              {mainPersonaName}
            </span>
          </div>

          <motion.div
            className="mx-2 flex h-4 flex-1 overflow-hidden rounded-full bg-gray-200"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            <motion.div
              className="h-full bg-red-400"
              style={{ width: `${mainPersonaPercent}%` }}
              initial={{ width: 0 }}
              animate={{ width: `${mainPersonaPercent}%` }}
              transition={{ delay: 1.4, duration: 1.0 }}
            ></motion.div>
            <motion.div
              className="h-full bg-blue-400"
              style={{ width: `${subPersonaPercent}%` }}
              initial={{ width: 0 }}
              animate={{ width: `${subPersonaPercent}%` }}
              transition={{ delay: 1.6, duration: 1.0 }}
            ></motion.div>
          </motion.div>

          <div className="">
            <div className="flex justify-center">
              <motion.img
                src={`${subPersonaImgPath}`}
                alt="온기 수집가"
                className="h-16 w-16"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1, duration: 0.5 }}
                whileHover={{ scale: 1.1 }}
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
          <motion.div
            className="pl-4 md:text-lg lg:text-xl xl:text-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.0, duration: 0.4 }}
          >
            {mainPersonaPercent}%
          </motion.div>
          <motion.div
            className="pr-4 md:text-lg lg:text-xl xl:text-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.1, duration: 0.4 }}
          >
            {subPersonaPercent}%
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default AnalysisHeroSection;
