import React, { useState, useCallback } from "react";
import { App, Input, Button, ConfigProvider } from "antd";
import { useNavigate } from "react-router-dom";

// Layout 및 재사용 컴포넌트
import PageLayout from "@/layout/PageLayout";
import SectionHeader from "@/components/common/SectionHeader";
import AddContentCard from "@/components/collection/AddContentCard";
import EditablePoster from "@/components/collection/EditablePoster";
import SearchContentModal from "@/components/collection/SearchContentModal";

// 타입 정의
interface Content {
  id: number;
  title: string;
  posterUrl: string;
}

const CollectionCreatePage: React.FC = () => {
  const { message } = App.useApp();
  const navigate = useNavigate();

  // --- States ---
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [contents, setContents] = useState<Content[]>([]);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  // --- Handlers (useCallback으로 최적화) ---
  const handleAddContent = useCallback(
    (newContent: Content) => {
      if (contents.some((c) => c.id === newContent.id)) {
        message.warning("이미 컬렉션에 추가된 작품입니다.");
        return;
      }
      setContents((prev) => [...prev, newContent]);
      message.success(`'${newContent.title}'을(를) 컬렉션에 추가했습니다.`);
    },
    [contents, message],
  );

  const handleRemoveContent = useCallback(
    (contentIdToRemove: number) => {
      setContents((prev) =>
        prev.filter((content) => content.id !== contentIdToRemove),
      );
      message.error("작품을 컬렉션에서 삭제했습니다.");
    },
    [message],
  );

  const handleSaveCollection = useCallback(() => {
    // 버튼 클릭 시 유효성 검사
    if (!title.trim()) {
      message.error("컬렉션 제목을 반드시 입력해야 합니다.");
      return;
    }
    if (contents.length < 3) {
      message.error("작품을 최소 3개 이상 추가해야 합니다.");
      return;
    }

    console.log("Saving Collection:", { title, description, contents });
    message.success("컬렉션이 성공적으로 생성되었습니다!");

    const newCollectionId = Math.floor(Math.random() * 1000); // 임시 ID
    navigate(`/collections/${newCollectionId}`);
  }, [title, description, contents, message, navigate]);

  // --- Render ---
  const primaryHeaderButtonClass =
    "flex w-20 mb-10 justify-center rounded-full border border-solid border-white bg-transparent px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-white/20 md:w-28 md:px-5 md:text-sm whitespace-nowrap";

  return (
    <>
      <PageLayout
        header={
          <div className="relative">
            <SectionHeader title="" description="" />

            <div className="absolute inset-0 z-10 mx-auto flex w-full max-w-[1200px] items-center px-4 sm:px-8">
              <div className="flex w-full items-center justify-between">
                {/* 왼쪽: 제목과 설명 */}
                <div className="flex flex-col gap-2">
                  <h1 className="gmarket-medium text-xl font-bold text-white md:text-2xl">
                    컬렉션 만들기
                  </h1>
                  <p className="gmarket-medium text-xs text-gray-300 md:text-base">
                    보고 싶은 콘텐츠, 추천하고 싶은 시리즈, 그리고 나만의
                    테마까지 OTT 컬렉션을 만들어 공유해보세요.
                  </p>
                </div>

                {/* 오른쪽: 등록 버튼 */}
                <div className="flex-shrink-0">
                  <button
                    type="button"
                    onClick={handleSaveCollection}
                    className={primaryHeaderButtonClass}
                  >
                    컬렉션 등록
                  </button>
                </div>
              </div>
            </div>
          </div>
        }
        floatingBoxContent={
          <div className="flex flex-col gap-8 p-6 md:p-12">
            {/* --- 제목 및 설명 입력 --- */}
            <ConfigProvider
              theme={{
                token: {
                  colorPrimary: "#172036", // 테마 색상 통일
                  colorBorder: "#d9d9d9",
                  borderRadius: 6,
                },
                components: {
                  Input: {
                    // antd 컴포넌트 세부 스타일 조정
                  },
                },
              }}
            >
              <div className="flex flex-col gap-6">
                <div>
                  <label
                    htmlFor="collection-title"
                    className="mb-2 block font-semibold"
                  >
                    컬렉션 제목 <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="collection-title"
                    placeholder="컬렉션의 제목을 알려주세요."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    maxLength={15}
                    showCount
                    size="large"
                  />
                </div>
                <div>
                  <label
                    htmlFor="collection-description"
                    className="mb-2 block font-semibold"
                  >
                    컬렉션 소개 (선택)
                  </label>
                  <Input.TextArea
                    id="collection-description"
                    placeholder="컬렉션을 설명하는 멋진 문장을 추가해보세요."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    maxLength={50}
                    showCount
                    rows={3}
                  />
                </div>
              </div>
            </ConfigProvider>

            <hr />

            {/* --- 작품 추가 영역 --- */}
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  작품 추가 <span className="text-red-500">*</span>
                  <span className="ml-2 text-sm font-normal text-gray-500">
                    (최소 3개)
                  </span>
                </h3>
              </div>
              <div className="grid grid-cols-2 justify-items-center gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {contents.map((content) => (
                  <EditablePoster
                    key={content.id}
                    id={content.id}
                    title={content.title}
                    posterUrl={content.posterUrl}
                    onRemove={handleRemoveContent}
                    isEditing={true}
                  />
                ))}
                <AddContentCard onClick={() => setIsSearchModalOpen(true)} />
              </div>
            </div>
          </div>
        }
      />

      <SearchContentModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onAddContent={handleAddContent}
        existingContentIds={contents.map((c) => c.id)}
      />
    </>
  );
};

export default CollectionCreatePage;
