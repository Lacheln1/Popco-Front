import Poster from "@/components/common/Poster";
import { useState } from "react";

type LikeState = "liked" | "hated" | "neutral";

const TestMainPage = () => {
  const [likeStates, setLikeStates] = useState<LikeState[]>([
    "neutral",
    "neutral",
  ]);

  const updateLikeState = (index: number, newState: LikeState) => {
    setLikeStates((prev) => {
      const next = [...prev];
      next[index] = newState;
      return next;
    });
  };

  return (
    <div className="flex flex-wrap gap-5 p-10">
      {[0, 1].map((i) => (
        <Poster
          key={i}
          id={`${i}`}
          title={`F1 더 무비 ${i + 1}`}
          posterUrl="https://image.tmdb.org/t/p/original/bvVoP1t2gNvmE9ccSrqR1zcGHGM.jpg"
          likeState={likeStates[i]}
          onLikeChange={(newState) => updateLikeState(i, newState)}
        />
      ))}
    </div>
  );
};

export default TestMainPage;
