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
      className={`relative flex min-h-[350px] w-full items-center justify-center rounded-lg text-base ${className}`}
    >
      <div className="flex gap-5 blur-xl">
        {displayData.map(({ id, title }) => (
          <Poster
            title={title}
            posterUrl={`images/poster/poster${id}.png`}
            id={id}
            likeState="neutral"
            onLikeChange={() => {}}
            disableHover={true}
          />
        ))}
      </div>
      <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-4 whitespace-nowrap rounded-lg bg-white px-14 py-2 text-black">
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
