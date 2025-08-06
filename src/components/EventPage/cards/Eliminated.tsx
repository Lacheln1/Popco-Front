import { useEffect } from "react";
import { disconnectSocket } from "@/utils/socket";
import { useNavigate } from "react-router-dom";

export const Eliminated = () => {
  useEffect(() => {
    disconnectSocket();
  }, []);
  const navigate = useNavigate();

  return (
    <aside className="absolute left-1/2 top-[31%] z-10 flex w-[85%] -translate-x-1/2 -translate-y-1/3 flex-col items-center justify-center gap-4 break-keep rounded-2xl bg-white/95 px-4 py-8 shadow-2xl backdrop-blur-lg md:h-[520px] md:w-[800px] md:px-8">
      <h2 className="gmarket text-2xl font-normal text-black">
        아쉽게도 탈락하셨습니다!
      </h2>
      <div>
        <img
          className="md:h-56"
          src="/images/popco/incorrect.svg"
          alt="틀렸습니다"
        />
        <div className="flex flex-col text-center text-base">
          <p className="">아쉽지만 다음 기회에 도전해 주세요.</p>
          <p className="">참여해주셔서 감사합니다!</p>
        </div>
      </div>
      <button
        onClick={() => navigate("/")}
        className="bg-footerBlue w-1/2 rounded-lg py-4 text-white"
      >
        메인으로 이동
      </button>
    </aside>
  );
};
