import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { App, Spin, Avatar, Input } from "antd";

// Layout 및 공용 컴포넌트
import PageLayout from "@/layout/PageLayout";
import SectionHeader from "@/components/common/SectionHeader";
import Poster from "@/components/common/Poster";
import AddContentCard from "@/components/collection/AddContentCard";
import EditablePoster from "@/components/collection/EditablePoster";
import SearchContentModal from "@/components/collection/SearchContentModal";

// Assets
import FullSaveIcon from "@/assets/full-save.svg";
import EmptySaveIcon from "@/assets/empty-save.svg";

// --- API 연동 전 사용할 더미 데이터 ---
const dummyCollectionData = {
  collectionId: 1,
  user: {
    id: 101, // 컬렉션 소유자 ID
    nickname: "영화광",
    profileImageUrl: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
  },
  title: "주말 정주행 시리즈 모음",
  description:
    "정주행하다 밤샘할지도 몰라요. 한번 시작하면 멈출 수 없는 시리즈들만 모아봤습니다.",
  saveCount: 129,
  isSaved: true,
  contents: Array.from({ length: 12 }, (_, i) => ({
    id: 500 + i,
    title: `영화 제목 ${i + 1}`,
    posterUrl: `https://picsum.photos/seed/${i + 1}/200/300`,
  })),
};

type LikeStates = { [key: number]: "liked" | "hated" | "neutral" };

// 현재 로그인한 사용자를 다른 사람(999)으로 가정
const LOGGED_IN_USER_ID = 99;

const CollectionDetailPage: React.FC = () => {
  const { collectionId } = useParams<{ collectionId: string }>();
  const { message, modal } = App.useApp();

  // --- States ---
  const [collection, setCollection] = useState(dummyCollectionData);
  const [isLoading, setIsLoading] = useState(true);
  const [likeStates, setLikeStates] = useState<LikeStates>({});
  const [isEditing, setIsEditing] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [editedTitle, setEditedTitle] = useState(collection.title);
  const [editedDescription, setEditedDescription] = useState(
    collection.description,
  );

  const isOwner = collection?.user?.id === LOGGED_IN_USER_ID;

  // --- Handlers ---
  const handleSaveToggle = useCallback(() => {
    if (!collection) return;
    const newIsSaved = !collection.isSaved;
    setCollection((prev) => ({
      ...prev!,
      isSaved: newIsSaved,
      saveCount: newIsSaved ? prev!.saveCount + 1 : prev!.saveCount - 1,
    }));
    message.success(newIsSaved ? "컬렉션에 저장했어요." : "저장을 취소했어요.");
  }, [collection, message]);

  const handleLikeChange = useCallback(
    (contentId: number, newState: "liked" | "hated" | "neutral") => {
      setLikeStates((prev) => ({ ...prev, [contentId]: newState }));
    },
    [],
  );

  const handleEditClick = useCallback(() => {
    if (isEditing) {
      setCollection((prev) => ({
        ...prev!,
        title: editedTitle,
        description: editedDescription,
      }));
      message.success("컬렉션이 저장되었습니다.");
      setIsEditing(false);
    } else {
      setEditedTitle(collection.title);
      setEditedDescription(collection.description);
      setIsEditing(true);
    }
  }, [isEditing, editedTitle, editedDescription, collection, message]);

  const handleRemoveContent = useCallback(
    (contentIdToRemove: number) => {
      setCollection((prev) => ({
        ...prev!,
        contents: prev!.contents.filter(
          (content) => content.id !== contentIdToRemove,
        ),
      }));
      message.error("작품을 컬렉션에서 삭제했습니다.");
    },
    [message],
  );

  const handleAddContent = useCallback(
    (newContent: { id: number; title: string; posterUrl: string }) => {
      if (collection.contents.some((c) => c.id === newContent.id)) {
        message.warning("이미 컬렉션에 추가된 작품입니다.");
        return;
      }
      setCollection((prev) => ({
        ...prev!,
        contents: [...prev!.contents, newContent],
      }));
      message.success(`'${newContent.title}'을(를) 컬렉션에 추가했습니다.`);
    },
    [collection.contents, message],
  );

  const showDeleteConfirm = useCallback(() => {
    const primaryModalButtonClass =
      "rounded-md bg-[#172036] px-4 py-1.5 text-sm text-white transition-colors hover:bg-[#172036]/80";
    const secondaryModalButtonClass =
      "rounded-md bg-white px-4 py-1.5 text-sm text-gray-700 border border-gray-300 transition-colors hover:bg-gray-100";

    modal.confirm({
      title: "정말 컬렉션을 삭제하시겠어요?",
      content: "삭제한 컬렉션은 다시 복구할 수 없습니다.",
      okText: "삭제",
      cancelText: "취소",
      okButtonProps: {
        className: primaryModalButtonClass
          .replace("bg-[#172036]", "bg-red-600")
          .replace("hover:bg-[#172036]/80", "hover:bg-red-700"),
      },
      cancelButtonProps: { className: secondaryModalButtonClass },
      onOk() {
        message.success("컬렉션이 삭제되었습니다.");
      },
    });
  }, [modal, message]);

  useEffect(() => {
    setIsLoading(true);
    setIsEditing(false);
    setCollection(dummyCollectionData);
    setEditedTitle(dummyCollectionData.title);
    setEditedDescription(dummyCollectionData.description);
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, [collectionId]);

  // --- Render ---
  const primaryHeaderButtonClass =
    "flex w-20 md:w-28 justify-center rounded-full border border-solid border-white bg-transparent px-2 py-2 text-xs font-medium text-white transition-colors hover:bg-white/20 md:px-5 md:text-sm";
  const secondaryHeaderButtonClass =
    "flex w-20 md:w-28 justify-center rounded-full border border-gray-300 bg-white px-2 py-2 text-xs font-medium text-footerBlue transition-colors hover:bg-gray-200 md:px-5 md:text-sm";

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (!collection) {
    return <div>컬렉션 정보를 찾을 수 없습니다.</div>;
  }

  return (
    <>
      <PageLayout
        header={
          <div className="relative">
            <SectionHeader title="" description="" />
            <div className="absolute inset-0 z-10 mx-auto flex w-full max-w-[1200px] items-center px-4">
              <div className="flex w-full items-start justify-between gap-1">
                <div className="flex min-h-[120px] flex-1 flex-col justify-center md:min-h-[140px]">
                  <div className="mb-2 flex items-center gap-3">
                    <Avatar
                      src={collection.user.profileImageUrl}
                      size={{ xs: 25, sm: 28, md: 30 }}
                    />
                    <span className="gmarket-medium text-xs text-white">
                      {collection.user.nickname}
                    </span>
                  </div>
                  {isEditing ? (
                    <div className="flex flex-col gap-2 pr-4">
                      <div className="relative w-full">
                        <Input
                          value={editedTitle}
                          onChange={(e) => setEditedTitle(e.target.value)}
                          placeholder="컬렉션 제목"
                          variant="borderless"
                          maxLength={15}
                          styles={{
                            input: {
                              backgroundColor: "transparent",
                              boxShadow: "none",
                              padding: "4px 0px",
                            },
                          }}
                          className="bg-transparent pr-12 text-base text-white shadow-none placeholder:text-gray-400 focus:ring-0 md:text-2xl"
                        />
                        <span className="pointer-events-none absolute bottom-1 right-2 text-xs text-white/70 md:bottom-2">
                          {editedTitle.length}/15
                        </span>
                      </div>
                      <div className="relative w-full">
                        <Input.TextArea
                          value={editedDescription}
                          onChange={(e) => setEditedDescription(e.target.value)}
                          placeholder="컬렉션에 대한 설명을 입력하세요."
                          autoSize={{ minRows: 2, maxRows: 3 }}
                          variant="borderless"
                          maxLength={50}
                          styles={{
                            textarea: {
                              backgroundColor: "transparent",
                              boxShadow: "none",
                              padding: "4px 0px",
                            },
                          }}
                          className="bg-transparent pr-12 text-xs text-gray-300 shadow-none placeholder:text-gray-400 focus:ring-0 md:text-base"
                        />
                        <span className="pointer-events-none absolute bottom-2 right-2 text-xs text-white/70">
                          {editedDescription.length}/50
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <h1 className="gmarket-medium text-base text-white md:text-2xl">
                        {collection.title}
                      </h1>
                      <p className="gmarket-medium pr-4 text-xs text-gray-300 md:text-base">
                        {collection.description}
                      </p>
                    </div>
                  )}
                </div>
                <div className="flex min-h-[120px] flex-shrink-0 items-center justify-end md:min-h-[140px]">
                  {/* 소유자일 경우 수정/삭제 버튼 표시 */}
                  {isOwner && (
                    <div className="flex flex-col items-end gap-2">
                      {isEditing ? (
                        <>
                          <button
                            type="button"
                            onClick={handleEditClick}
                            className={primaryHeaderButtonClass}
                          >
                            수정 완료
                          </button>
                          <button
                            type="button"
                            onClick={() => setIsEditing(false)}
                            className={secondaryHeaderButtonClass}
                          >
                            수정 취소
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={handleEditClick}
                            className={primaryHeaderButtonClass}
                          >
                            컬렉션 수정
                          </button>
                          <button
                            type="button"
                            onClick={showDeleteConfirm}
                            className={secondaryHeaderButtonClass}
                          >
                            컬렉션 삭제
                          </button>
                        </>
                      )}
                    </div>
                  )}
                  {/* ✅ 소유자가 아닐 경우 저장 버튼 표시 */}
                  {!isOwner && (
                    <button
                      type="button"
                      onClick={handleSaveToggle}
                      className="mt-14 flex items-center justify-center gap-1 rounded-full border border-solid border-white bg-transparent px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-white/20 md:gap-2 md:px-4 md:py-2 md:text-sm"
                    >
                      <img
                        src={collection.isSaved ? FullSaveIcon : EmptySaveIcon}
                        alt="Save"
                        className="h-4 w-4 md:h-5 md:w-5"
                      />
                      <span>{collection.saveCount}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        }
        floatingBoxContent={
          <div className="px-8 py-12 md:px-24">
            <div className="flex flex-wrap justify-center gap-6 md:gap-8">
              {isEditing && (
                <AddContentCard onClick={() => setIsSearchModalOpen(true)} />
              )}
              {collection.contents.map((content) =>
                isEditing ? (
                  <EditablePoster
                    key={content.id}
                    id={content.id}
                    title={content.title}
                    posterUrl={content.posterUrl}
                    onRemove={handleRemoveContent}
                    isEditing={isEditing}
                  />
                ) : (
                  <Poster
                    key={content.id}
                    id={content.id}
                    title={content.title}
                    posterUrl={content.posterUrl}
                    likeState={likeStates[content.id] || "neutral"}
                    onLikeChange={handleLikeChange}
                  />
                ),
              )}
            </div>
          </div>
        }
      >
        {/* Children Area */}
      </PageLayout>

      <SearchContentModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onAddContent={handleAddContent}
        existingContentIds={collection.contents.map((c) => c.id)}
      />
    </>
  );
};

export default CollectionDetailPage;
