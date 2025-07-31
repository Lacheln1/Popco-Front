import React from "react";
import { Modal, Input, Button } from "antd";
import { IoAdd, IoCheckmark, IoSearch } from "react-icons/io5";

// 타입 정의
interface Content {
  id: number;
  title: string;
  posterUrl: string;
  type: string;
}

interface SearchContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddContent: (content: Content) => void;
  existingContentIds?: number[];
}

const SearchContentModal: React.FC<SearchContentModalProps> = ({
  isOpen,
  onClose,
  onAddContent,
  existingContentIds = [],
}) => {
  const dummySearchResults: Content[] = Array.from({ length: 10 }, (_, i) => ({
    id: 700 + i,
    title: `검색된 영화 ${i + 1}`,
    posterUrl: `https://picsum.photos/seed/s${i}/200/300`,
    type: "movie",
  }));

  // 아이콘 버튼 스타일
  const primaryButtonClass =
    "flex h-7 w-7 items-center justify-center rounded-full bg-gray-200 text-gray-700 transition-colors hover:bg-gray-300";
  const disabledButtonClass =
    "flex h-7 w-7 items-center justify-center rounded-full bg-gray-400 text-white cursor-not-allowed";

  return (
    <Modal
      title="컬렉션에 작품 추가"
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={550}
    >
      <div className="flex flex-col gap-4 py-4">
        <Input.Search
          placeholder="영화, 드라마 제목을 검색하세요"
          size="large"
          enterButton={<Button type="primary" icon={<IoSearch size={20} />} />}
        />
        <div className="flex h-[400px] flex-col gap-3 overflow-y-auto pr-2">
          {dummySearchResults.map((item) => {
            const isAdded = existingContentIds.includes(item.id);

            return (
              <div
                key={item.id}
                className="flex items-center gap-4 rounded-lg p-2 transition-colors hover:bg-gray-100"
              >
                <img
                  src={item.posterUrl}
                  alt={item.title}
                  className="h-16 w-11 flex-shrink-0 rounded object-cover"
                />
                <span className="flex-1 font-semibold">{item.title}</span>

                <button
                  type="button"
                  onClick={() => onAddContent(item)}
                  className={isAdded ? disabledButtonClass : primaryButtonClass}
                  disabled={isAdded}
                  aria-label={
                    isAdded ? `${item.title} 추가됨` : `${item.title} 추가`
                  }
                >
                  {isAdded ? <IoCheckmark size={20} /> : <IoAdd size={20} />}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </Modal>
  );
};

export default SearchContentModal;
