import React from "react";
import { FaPlus } from "react-icons/fa6";

type AddContentCardProps = {
  onClick: () => void;
};

const AddContentCard: React.FC<AddContentCardProps> = ({ onClick }) => {
  return (
    <div
      className="group flex w-[35vw] min-w-[100px] max-w-[210px] flex-col gap-1 md:w-[210px]"
      onClick={onClick}
      role="button"
    >
      <div className="flex aspect-[7/10] w-full flex-col items-center justify-center gap-4 rounded-md border-2 border-dashed border-gray-300 bg-gray-50 text-gray-400 transition-colors hover:border-blue-500 hover:bg-blue-50 hover:text-blue-500">
        <FaPlus size={40} />
        <span className="font-semibold">작품 추가</span>
      </div>
    </div>
  );
};

export default AddContentCard;