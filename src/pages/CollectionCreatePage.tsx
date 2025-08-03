import React, { useState, useCallback, useEffect } from "react";
import { App, Input, ConfigProvider, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import useAuthCheck from "@/hooks/useAuthCheck";
import { useCreateCollection } from "@/hooks/useCollections";

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
  type: string;
}

const CollectionCreatePage: React.FC = () => {
  const { message } = App.useApp();
  const navigate = useNavigate();
  const { user, accessToken, isLoading: isAuthLoading } = useAuthCheck();
  const { mutate: createCollection, isPending: isCreating } =
    useCreateCollection();

  // --- States ---
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [contents, setContents] = useState<Content[]>([]);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  // --- 로그인 가드 ---
  useEffect(() => {
    if (!isAuthLoading && user.isLoggedIn === false) {
      message.error("로그인이 필요한 페이지입니다.");
      navigate("/login");
    }
  }, [isAuthLoading, user.isLoggedIn, navigate, message]);

  // --- Handlers ---
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
    if (isCreating) return;

    if (!title.trim()) {
      message.error("컬렉션 제목을 반드시 입력해야 합니다.");
      return;
    }
    if (contents.length < 3) {
      message.error("작품을 최소 3개 이상 추가해야 합니다.");
      return;
    }

    const requestData = {
      title,
      description,
      contents,
      accessToken: accessToken!,
    };

    createCollection(requestData);
  }, [
    title,
    description,
    contents,
    accessToken,
    createCollection,
    isCreating,
    message,
  ]);

  // --- Render ---
  const primaryHeaderButtonClass =
    "flex w-24 justify-center items-center rounded-full border border-solid border-white bg-transparent px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-white/20 md:w-28 md:px-5 md:text-sm whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed";

  // 인증 정보 로딩 중이거나 로그아웃 상태일 때 빈 화면 대신 로딩 화면 표시
  if (isAuthLoading || !user.isLoggedIn) {
    return (
      <PageLayout
        header={
          <SectionHeader
            title="컬렉션 만들기"
            description="나만의 컬렉션을 만들어 공유해보세요."
          />
        }
        floatingBoxContent={
          <div className="flex h-[50vh] w-full items-center justify-center">
            <Spin size="large" />
          </div>
        }
      />
    );
  }

  return (
    <>
      <PageLayout
        header={
          <div className="relative">
            <SectionHeader title="" description="" />
            <div className="absolute inset-0 z-10 mx-auto flex w-full max-w-[1200px] items-center px-4 sm:px-8">
              <div className="flex w-full items-center justify-between">
                <div className="flex flex-col gap-2">
                  <h1 className="gmarket-medium text-xl font-bold text-white md:text-2xl">
                    컬렉션 만들기
                  </h1>
                  <p className="gmarket-medium text-xs text-gray-300 md:text-base">
                    보고 싶은 콘텐츠, 추천하고 싶은 시리즈, 그리고 나만의
                    테마까지 OTT 컬렉션을 만들어 공유해보세요.
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <button
                    type="button"
                    onClick={handleSaveCollection}
                    className={primaryHeaderButtonClass}
                    disabled={isCreating}
                  >
                    {isCreating ? <Spin size="small" /> : "컬렉션 등록"}
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
                  colorPrimary: "#172036",
                  colorBorder: "#d9d9d9",
                  borderRadius: 6,
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
      >
        {/* children */}
      </PageLayout>
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
