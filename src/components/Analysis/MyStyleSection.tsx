import React from "react";
import { motion } from "framer-motion";
import {
  pageVariants,
  itemVariants,
  formVariants,
} from "@/components/LoginResgisterPage/Animation";
interface MyStyleSectionProps {
  myPersonaTags: string;
  myPersonaDescription: string;
  myPersonaGenres: string[];
}

const MyStyleSection: React.FC<MyStyleSectionProps> = ({
  myPersonaTags,
  myPersonaDescription,
  myPersonaGenres,
}) => {
  return (
    <motion.section
      className="pretendard flex justify-center px-3 md:px-8"
      variants={pageVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      <motion.div
        className="mx-1 flex w-full max-w-[1200px] flex-col bg-slate-50 py-8"
        style={{ boxShadow: "0 0px 10px rgba(0, 0, 0, 0.1)" }}
        variants={formVariants}
        whileHover={{
          boxShadow: "0 0px 20px rgba(0, 0, 0, 0.15)",
          transition: { duration: 0.3 },
        }}
      >
        <motion.div
          className="flex flex-col text-center text-base md:mb-2 md:text-2xl lg:text-2xl"
          variants={itemVariants}
        >
          <motion.span className="gmarket-medium" variants={itemVariants}>
            내 OTT 시청 스타일은
          </motion.span>
          <motion.span className="" variants={itemVariants}>
            {myPersonaTags}
          </motion.span>
        </motion.div>

        <motion.div
          className="flex w-full justify-center gap-4 px-2 pt-4 md:text-xl"
          variants={formVariants}
        >
          {myPersonaGenres.slice(0, 4).map((data) => (
            <motion.div
              key={data}
              className="bg-popco-main flex h-8 items-center justify-center rounded-lg px-5 lg:h-10"
              variants={itemVariants}
              whileHover={{
                backgroundColor: "#ffcf20",
                transition: { duration: 0.2 },
              }}
              whileTap={{ scale: 0.95 }}
            >
              #{data}
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="mt-4 flex justify-center break-keep px-1 text-center md:mt-7"
          variants={itemVariants}
        >
          <motion.span
            className="break-keep md:text-xl"
            variants={itemVariants}
          >
            {myPersonaDescription}
          </motion.span>
        </motion.div>
      </motion.div>
    </motion.section>
  );
};

export default MyStyleSection;
