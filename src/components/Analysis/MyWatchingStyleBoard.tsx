import React from "react";
import AverageDoubleDonutChart from "./AverageDoubleDonutChart";
import { motion } from "framer-motion";
import {
  pageVariants,
  headerVariants,
  itemVariants,
  formVariants,
} from "@/components/LoginResgisterPage/Animation";
interface MyWatchingStyleBoardProps {
  ratingPercent: number[];
  eventPercent: number[];
  eventCount: number;
  reviewPercent: number[];
  myLikePercent: number[];
  personaName: string;
}

const MyWatchingStyleBoard: React.FC<MyWatchingStyleBoardProps> = ({
  ratingPercent,
  eventPercent,
  eventCount,
  reviewPercent,
  myLikePercent,
  personaName,
}) => {
  return (
    <motion.div
      className="flex flex-col items-center px-3 md:px-8"
      variants={pageVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <motion.div
        className="bg-footerBlue mt-10 flex w-full max-w-[1200px] flex-col overflow-hidden rounded-tl-3xl rounded-tr-3xl py-5 text-center"
        variants={headerVariants}
      >
        <motion.div
          className="gmarket-medium pt-2 text-xl text-white md:text-3xl"
          variants={itemVariants}
        >
          <span>나의 시청 스타일이 궁금해?</span>
        </motion.div>
      </motion.div>

      <motion.div
        className="pretendard flex w-full max-w-[1200px] flex-col items-center bg-slate-50 py-10"
        style={{ boxShadow: "0 0px 10px rgba(0, 0, 0, 0.1)" }}
        variants={formVariants}
        whileHover={{
          boxShadow: "0 0px 20px rgba(0, 0, 0, 0.15)",
          transition: { duration: 0.3 },
        }}
      >
        <motion.div
          className="flex sm:gap-10 sm:text-2xl lg:gap-32"
          variants={formVariants}
        >
          <motion.div
            className="flex flex-col items-center"
            variants={itemVariants}
          >
            <span className="text-base md:text-2xl">평균 별점</span>
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8, type: "spring" }}
            >
              <AverageDoubleDonutChart
                customerScore={ratingPercent[0]}
                averageScore={ratingPercent[1]}
                maxScore={5}
                personaName={personaName}
              />
            </motion.div>
            <motion.span
              className="text-base md:text-2xl"
              variants={itemVariants}
            >
              {ratingPercent[0]}/5 점
            </motion.span>
          </motion.div>

          <motion.div
            className="flex flex-col items-center"
            variants={itemVariants}
          >
            <span className="text-base md:text-2xl">이벤트 참여 수</span>
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.8, type: "spring" }}
            >
              <AverageDoubleDonutChart
                customerScore={eventPercent[0]}
                averageScore={eventPercent[1]}
                maxScore={eventCount}
                personaName={personaName}
              />
            </motion.div>
            <motion.span
              className="text-base md:text-2xl"
              variants={itemVariants}
            >
              {eventPercent[0]}/{eventCount} 회
            </motion.span>
          </motion.div>

          <motion.div
            className="flex flex-col items-center text-base"
            variants={itemVariants}
          >
            <span className="text-base md:text-2xl">이번달 시청 컨텐츠</span>
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.8, type: "spring" }}
            >
              <AverageDoubleDonutChart
                customerScore={reviewPercent[0]}
                averageScore={reviewPercent[1]}
                maxScore={reviewPercent[1]}
                personaName={personaName}
              />
              <motion.div
                className="flex justify-center"
                variants={itemVariants}
              >
                <span className="text-base md:text-2xl">
                  {reviewPercent[0]}/{reviewPercent[1]}개
                </span>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div
          className="mt-4 flex w-full items-center justify-center gap-4 text-center"
          variants={formVariants}
        >
          <motion.div
            className="mt-4 flex items-center gap-2 text-base"
            variants={itemVariants}
          >
            <motion.div
              className="h-3 w-3 rounded-full bg-[#FD6B94]"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.2, type: "spring" }}
            />
            <span className="text-base md:text-2xl">{personaName} 평균</span>
          </motion.div>
          <motion.div
            className="mt-4 flex items-center gap-2 text-base"
            variants={itemVariants}
          >
            <motion.div
              className="h-3 w-3 rounded-full bg-[#3BA8F0]"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.3, type: "spring" }}
            />
            <span className="text-base md:text-2xl">나</span>
          </motion.div>
        </motion.div>

        <motion.div
          className="mt-5 w-full md:w-[700px] lg:w-[900px] xl:w-[1000px]"
          variants={itemVariants}
        >
          <motion.div className="flex flex-col" variants={formVariants}>
            <motion.div
              className="mx-3 flex justify-between"
              variants={itemVariants}
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.2 }}
              >
                <img
                  src="/images/components/like-popcorn.svg"
                  alt=""
                  className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 lg:h-11 lg:w-11 xl:h-12 xl:w-12"
                />
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.1, rotate: -5 }}
                transition={{ duration: 0.2 }}
              >
                <img
                  src="/images/components/hate-popcorn.svg"
                  alt=""
                  className="h-8 w-8 rotate-90 sm:h-9 sm:w-9 md:h-10 md:w-10 lg:h-11 lg:w-11 xl:h-12 xl:w-12"
                />
              </motion.div>
            </motion.div>

            <motion.div
              className="mx-3 flex h-6 overflow-hidden rounded-full bg-gray-200 sm:h-7 md:h-8"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 1.5, duration: 1.0 }}
            >
              <motion.div
                className="relative flex items-center justify-center bg-yellow-400 font-medium text-gray-700"
                style={{ width: `${myLikePercent[0]}%` }}
                initial={{ width: 0 }}
                animate={{ width: `${myLikePercent[0]}%` }}
                transition={{ delay: 1.7, duration: 1.2 }}
              >
                <motion.span
                  className={`text-xs font-bold sm:text-sm md:text-base lg:text-lg xl:text-xl ${
                    myLikePercent[0] === 0 ? "hidden" : ""
                  }`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2.2, duration: 0.5 }}
                >
                  {`${myLikePercent[0]}%`}
                </motion.span>
              </motion.div>
              <motion.div
                className="relative flex items-center justify-center bg-yellow-200 font-medium text-gray-700"
                style={{ width: `${myLikePercent[1]}%` }}
                initial={{ width: 0 }}
                animate={{ width: `${myLikePercent[1]}%` }}
                transition={{ delay: 1.9, duration: 1.2 }}
              >
                <motion.span
                  className={`text-xs font-bold sm:text-sm md:text-base lg:text-lg xl:text-xl ${
                    myLikePercent[1] === 0 ? "hidden" : ""
                  }`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2.4, duration: 0.5 }}
                >
                  {`${myLikePercent[1]}%`}
                </motion.span>
              </motion.div>
            </motion.div>

            <motion.div
              className="mx-3 flex justify-between text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl"
              variants={itemVariants}
            >
              <span className="text-base md:text-2xl">좋아요</span>
              <span className="text-base md:text-2xl">싫어요</span>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default MyWatchingStyleBoard;
