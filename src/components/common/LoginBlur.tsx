import { IoMdArrowForward } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import Poster from "./Poster";

interface Props {
  className?: string;
  text: string;
  isReverse?: boolean;
}

const posterData = [
  { id: 1, title: "..." },
  { id: 2, title: "..." },
  { id: 3, title: "..." },
  { id: 4, title: "..." },
  { id: 5, title: "..." },
];

const LoginBlur = ({ className = "", text = "", isReverse = false }: Props) => {
  const navigate = useNavigate();
  const displayData = isReverse ? [...posterData].reverse() : posterData;

  return (
    <div
      className={`relative flex w-full items-center justify-center overflow-hidden rounded-lg text-base md:min-h-[350px] ${className}`}
    >
      <div className="pointer-events-none flex cursor-no-drop gap-5 blur-lg">
        {displayData.map(({ id, title }) => (
          <Poster
            key={id}
            title={title}
            posterUrl={`images/poster/poster${id}.png`}
            id={id}
            likeState="neutral"
            onLikeChange={() => {}}
            disableHover={true}
          />
        ))}
      </div>
      <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center whitespace-nowrap rounded-lg bg-white px-4 py-2 text-black md:flex-row md:gap-4 md:px-14">
        <div>{text}</div>
        <button
          onClick={() => navigate("/login")}
          className="flex items-center gap-2"
        >
          <span>로그인</span>
          <IoMdArrowForward />
        </button>
      </div>
    </div>
  );
};

export default LoginBlur;
