import React from "react";
import { IoTrashBin } from "react-icons/io5";

type EditablePosterProps = {
  id: number;
  title: string;
  posterUrl: string;
  onRemove: (id: number) => void;
};

const EditablePoster: React.FC<EditablePosterProps> = ({
  id,
  title,
  posterUrl,
  onRemove,
}) => {
  const handleRemoveClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onRemove(id);
  };

  return (
    <div className="group flex w-[35vw] min-w-[100px] max-w-[210px] flex-col gap-1 md:w-[210px]">
      
      <div className="relative w-full cursor-pointer">
        
        <img
          className="relative aspect-[7/10] w-full rounded-md object-cover"
          src={posterUrl}
          alt={title}
        />

        <div className="absolute inset-0 hidden items-center justify-center gap-4 rounded-md bg-black/60 p-2 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100 sm:flex">
          <button
            onClick={handleRemoveClick}
            className="flex flex-col items-center gap-1 rounded-full p-2 text-center text-sm font-semibold text-white transition-transform hover:scale-110"
            aria-label={`${title} 삭제`}
          >
            <IoTrashBin size={48} /> 
            <span>삭제</span>
          </button>
        </div>
      </div>

      <div className="flex w-full items-center justify-between gap-2">
        <div className="w-full overflow-hidden truncate text-ellipsis text-[clamp(0.78rem,3vw,1rem)] sm:text-center sm:text-[17px]">
          {title}
        </div>
      </div>
    </div>
  );
};

export default EditablePoster;