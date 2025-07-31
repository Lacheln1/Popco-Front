import { IoMdArrowForward } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import Poster from "./Poster";

interface Props {
  className?: string;
  text: string;
  isReverse?: boolean;
}

const posterData = [
  { id: 1, title: "...", type: "movie" },
  { id: 2, title: "...", type: "movie" },
  { id: 3, title: "...", type: "movie" },
  { id: 4, title: "...", type: "movie" },
  { id: 5, title: "...", type: "movie" },
];

const LoginBlur = ({ className = "", text = "", isReverse = false }: Props) => {
  const navigate = useNavigate();
  const displayData = isReverse ? [...posterData].reverse() : posterData;

  return (
    <div
      className={`relative flex w-full items-center justify-center overflow-hidden rounded-lg text-base md:min-h-[350px] ${className}`}
    >
      <div className="pointer-events-none flex cursor-no-drop gap-5 blur-lg">
  {displayData.map((content) => ( 
    <Poster
      key={content.id} 
      title={content.title} 
      posterUrl={`images/poster/poster${content.id}.png`} 
      id={content.id} 
      contentType={content.type} 
      likeState="NEUTRAL"
      onLikeChange={() => {}}
      disableHover={true}
    />
  ))}
</div>
      <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center whitespace-nowrap rounded-lg bg-white px-4 py-2 text-black md:flex-row md:gap-4 md:px-14">
        <div>{text}</div>
        <button
          onClick={() => navigate("/login")}
          className="group flex items-center gap-2 font-bold transition-all duration-300"
        >
          <span>로그인</span>
          <IoMdArrowForward className="transform transition-transform duration-300 group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
};

export default LoginBlur;
