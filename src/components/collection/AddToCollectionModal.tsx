import React from 'react';
import { Modal, Button, App } from 'antd';
import { useNavigate } from 'react-router-dom';
import { FolderOutlined } from '@ant-design/icons'; // 리스트 아이콘

interface ContentToAdd {
  id: number;
  title: string;
  posterUrl: string;
}

interface AddToCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  contentToAdd: ContentToAdd;
}

interface UserCollection {
  collectionId: number;
  title: string;
  totalCount: number;
}

const mockUserCollections: UserCollection[] = [
  { collectionId: 1, title: "여름밤에 보기 좋은 영화", totalCount: 12 },
  { collectionId: 4, title: "지브리 스튜디오 명작 컬렉션", totalCount: 15 },
  { collectionId: 2, title: "심장이 멎을 듯한 액션 명작선", totalCount: 25 },
  { collectionId: 3, title: "상상력의 한계를 넘어서", totalCount: 18 },
];


const AddToCollectionModal: React.FC<AddToCollectionModalProps> = ({
  isOpen,
  onClose,
  contentToAdd,
}) => {
  const navigate = useNavigate();
  const { message } = App.useApp();

  const handleCreateNewCollection = () => {
    onClose();
    navigate('/collections/create');
  };

  const handleAddToExistingCollection = (collectionId: number, collectionTitle: string) => {
    console.log(`'${contentToAdd.title}'을(를) '${collectionTitle}' 컬렉션(ID: ${collectionId})에 추가합니다.`);
    
    message.success(`'${contentToAdd.title}'을(를) '${collectionTitle}' 컬렉션에 추가했습니다.`);
    onClose(); 
  };

  return (
    <Modal
      title="내 컬렉션에 추가"
      open={isOpen}
      onCancel={onClose}
      footer={null} 
      width={450}  
    >
      <div className="py-4">
        <div className="mb-4 mt-4">
          <Button type="primary" block size="large" onClick={handleCreateNewCollection}>
            + 새 컬렉션 만들기
          </Button>
        </div>
        
        <div className="flex flex-col mt-8 gap-2 max-h-[50vh] overflow-y-auto pr-2">
          {mockUserCollections.map((collection) => (
            <div 
              key={collection.collectionId} 
              onClick={() => handleAddToExistingCollection(collection.collectionId, collection.title)}
              className="flex cursor-pointer items-center justify-between rounded-lg p-3 transition-colors hover:bg-gray-100"
              role="button"
              tabIndex={0}
            >
              <div className="flex items-center gap-3">
                <FolderOutlined className="text-lg text-gray-500" />
                <span className="font-medium text-gray-800">{collection.title}</span>
              </div>
              <span className="text-sm text-gray-500">{collection.totalCount}개</span>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};

export default AddToCollectionModal;
