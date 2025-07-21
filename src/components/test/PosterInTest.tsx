import React from "react";
import { IoCloseCircle } from "react-icons/io5";

type PosterInTestProps = {
  id: string;
  title: string;
  posterUrl: string;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
};

const PosterInTest: React.FC<PosterInTestProps> = ({
  id,
  title,
  posterUrl,
  isSelected,
  onToggleSelect,
}) => {
  const handlePosterClick = () => {
    onToggleSelect(id);
  };

  const handleCancelClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // 이벤트 버블링 방지
    onToggleSelect(id);
  };

  return (
    <div className="flex w-full flex-col gap-2">
      {/* 포스터 이미지 영역 */}
      <div
        onClick={handlePosterClick}
        role="button"
        className="relative w-full cursor-pointer"
      >
        <img
          className="relative aspect-[7/10] w-full rounded-md object-cover"
          src={posterUrl}
          alt={title}
        />

        {/* 선택됐을 때 나타나는 오버레이 */}
        {isSelected && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-md bg-black/60 text-white backdrop-blur-sm">
            <button
              onClick={handleCancelClick}
              className="flex flex-col items-center gap-1 rounded-full p-2 text-center text-sm font-semibold transition-transform hover:scale-110"
            >
              <IoCloseCircle size={32} />
              <span>취소</span>
            </button>
          </div>
        )}
      </div>

      {/* 영화 제목 */}
      <div className="overflow-hidden truncate text-ellipsis text-center text-sm text-black md:text-base">
        {title}
      </div>
    </div>
  );
};

export default PosterInTest;