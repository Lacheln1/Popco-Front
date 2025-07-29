import React from "react";
import { Modal, Input, Button } from "antd";

// 타입 정의
interface Content {
  id: number;
  title: string;
  posterUrl: string;
}

interface SearchContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddContent: (content: Content) => void;
}

const SearchContentModal: React.FC<SearchContentModalProps> = ({ 
  isOpen, 
  onClose, 
  onAddContent 
}) => {
  // 상세 페이지의 모달과 동일한 더미 데이터 및 구조 사용
  const dummySearchResults: Content[] = Array.from({ length: 5 }, (_, i) => ({
    id: 700 + i,
    title: `검색된 영화 ${i + 1}`,
    posterUrl: `https://picsum.photos/seed/s${i}/200/300`,
  }));

  return (
    <Modal
      title="컬렉션에 작품 추가"
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={800}
    >
      <div className="flex flex-col gap-4 py-4">
        <Input.Search
          placeholder="영화, 드라마 제목을 검색하세요"
          size="large"
          enterButton
        />
        <div className="flex h-[400px] flex-col gap-3 overflow-y-auto pr-2">
          {dummySearchResults.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 rounded-lg p-2 hover:bg-gray-100"
            >
              <img
                src={item.posterUrl}
                alt={item.title}
                className="h-16 w-11 rounded object-cover"
              />
              <span className="flex-1 font-semibold">{item.title}</span>
              <Button type="primary" onClick={() => onAddContent(item)}>
                추가
              </Button>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};

export default SearchContentModal;