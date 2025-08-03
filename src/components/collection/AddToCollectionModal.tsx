import React from "react";
import { Modal, Button, App, Empty } from "antd";
import { useNavigate } from "react-router-dom";
import { FolderOutlined, CheckCircleOutlined } from "@ant-design/icons";

// Hooks
import useAuthCheck from "@/hooks/useAuthCheck";
import {
  useFetchMyCollections,
  useAddContentToCollection,
} from "@/hooks/useCollections";
import Spinner from "@/components/common/Spinner";

// Types
import { CollectionProps } from "@/types/Collection.types";

interface ContentToAdd {
  id: number;
  type: string;
  title: string;
}

interface AddToCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  contentToAdd: ContentToAdd;
}

const AddToCollectionModal: React.FC<AddToCollectionModalProps> = ({
  isOpen,
  onClose,
  contentToAdd,
}) => {
  const navigate = useNavigate();
  const { accessToken } = useAuthCheck();

  // --- 데이터 페칭 ---
  const {
    data: myCollectionsData,
    isLoading,
    refetch,
  } = useFetchMyCollections(accessToken);
  const { mutate: addContent } = useAddContentToCollection();

  const handleCreateNewCollection = () => {
    onClose();
    navigate("/collections/create");
  };

  const handleAddToExistingCollection = (collectionId: number) => {
    if (!accessToken) return;

    addContent(
      {
        collectionId: String(collectionId),
        contentId: contentToAdd.id,
        contentType: contentToAdd.type,
        accessToken,
      },
      {
        onSuccess: () => {
          // 성공 시 모달을 닫기 전에 목록을 새로고침하여 '추가됨' 상태를 즉시 반영
          refetch().then(() => {
            onClose();
          });
        },
      },
    );
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
          <Button
            type="primary"
            block
            size="large"
            onClick={handleCreateNewCollection}
          >
            + 새 컬렉션 만들기
          </Button>
        </div>

        <div className="mt-8 flex max-h-[50vh] flex-col gap-2 overflow-y-auto pr-2">
          {isLoading ? (
            <div className="flex h-48 items-center justify-center">
              <Spinner />
            </div>
          ) : myCollectionsData?.collections?.length > 0 ? (
            myCollectionsData.collections.map((collection: CollectionProps) => {
              // --- 핵심 수정 사항 ---
              const isAlreadyAdded = collection.contentPosters.some(
                (poster) => poster.contentId === contentToAdd.id,
              );

              return (
                <div
                  key={collection.collectionId}
                  onClick={() =>
                    !isAlreadyAdded &&
                    handleAddToExistingCollection(collection.collectionId)
                  }
                  className={`flex items-center justify-between rounded-lg p-3 transition-colors ${
                    isAlreadyAdded
                      ? "cursor-not-allowed bg-green-50"
                      : "cursor-pointer hover:bg-gray-100"
                  }`}
                  role="button"
                  tabIndex={0}
                >
                  <div className="flex items-center gap-3">
                    <FolderOutlined className="text-lg text-gray-500" />
                    <span
                      className={`font-medium ${isAlreadyAdded ? "text-gray-400" : "text-gray-800"}`}
                    >
                      {collection.title}
                    </span>
                  </div>
                  {isAlreadyAdded ? (
                    <div className="flex items-center gap-1 text-sm font-semibold text-green-600">
                      <CheckCircleOutlined />
                      <span>추가됨</span>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-500">
                      {collection.contentCount}개
                    </span>
                  )}
                </div>
              );
            })
          ) : (
            <div className="flex h-48 items-center justify-center">
              <Empty description="생성된 컬렉션이 없습니다." />
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default AddToCollectionModal;
