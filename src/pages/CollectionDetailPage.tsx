import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { App, Avatar, Input } from "antd";

// Layout 및 공용 컴포넌트
import PageLayout from "@/layout/PageLayout";
import SectionHeader from "@/components/common/SectionHeader";
import Poster from "@/components/common/Poster";
import Spinner from "@/components/common/Spinner";
import AddContentCard from "@/components/collection/AddContentCard";
import EditablePoster from "@/components/collection/EditablePoster";
import SearchContentModal from "@/components/collection/SearchContentModal";

// Assets
import FullSaveIcon from "@/assets/full-save.svg";
import EmptySaveIcon from "@/assets/empty-save.svg";

// Hooks
import useAuthCheck from "@/hooks/useAuthCheck";
import {
  useFetchCollectionById,
  useUpdateCollection,
  useDeleteCollection,
  useToggleMarkCollection,
  useManageCollectionContents,
} from "@/hooks/useCollections";

// Types & Constants
import { TMDB_IMAGE_BASE_URL } from "@/constants/contents";

// SearchContentModal에서 추가할 콘텐츠의 타입
interface ContentToAdd {
  id: number;
  title: string;
  posterUrl: string;
  type: string;
}

const CollectionDetailPage: React.FC = () => {
  const { collectionId } = useParams<{ collectionId: string }>();
  const navigate = useNavigate();
  const { message, modal } = App.useApp();

  // --- Hooks ---
  const { user, accessToken } = useAuthCheck();
  const {
    data: collection,
    isLoading: isLoadingDetails,
    isError,
  } = useFetchCollectionById(collectionId, accessToken);

  const { mutate: updateCollection, isPending: isUpdating } =
    useUpdateCollection(collectionId!);
  const { mutate: deleteCollection, isPending: isDeleting } =
    useDeleteCollection();
  const { mutate: toggleMark, isPending: isMarking } =
    useToggleMarkCollection();
  const { addContent, removeContent } = useManageCollectionContents(
    collectionId!,
  );

  // --- UI 상태 관리 ---
  const [isEditing, setIsEditing] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDescription, setEditedDescription] = useState("");

  useEffect(() => {
    if (collection) {
      setEditedTitle(collection.title);
      setEditedDescription(collection.description);
    }
  }, [collection]);

  const isOwner = collection?.userId === user.userId && user.isLoggedIn;
  const isLoading = isLoadingDetails;

  // --- Handlers ---
  const handleSaveToggle = useCallback(() => {
    if (!user.isLoggedIn) {
      message.warning("로그인이 필요한 기능입니다.");
      navigate("/login");
      return;
    }
    toggleMark({ collectionId: collectionId!, accessToken: accessToken! });
  }, [
    user.isLoggedIn,
    accessToken,
    collectionId,
    toggleMark,
    navigate,
    message,
  ]);

  const handleEditSave = useCallback(() => {
    if (!accessToken) return;

    updateCollection(
      {
        collectionId: collectionId!,
        title: editedTitle,
        description: editedDescription,
        accessToken,
      },
      {
        onSuccess: () => {
          setIsEditing(false);
        },
      },
    );
  }, [
    collectionId,
    editedTitle,
    editedDescription,
    accessToken,
    updateCollection,
  ]);

  const showDeleteConfirm = useCallback(() => {
    modal.confirm({
      title: "정말 컬렉션을 삭제하시겠어요?",
      content: "삭제한 컬렉션은 다시 복구할 수 없습니다.",
      okText: "삭제",
      cancelText: "취소",
      okButtonProps: { danger: true },
      onOk: () => {
        if (!accessToken) return;
        deleteCollection({ collectionId: collectionId!, accessToken });
      },
    });
  }, [modal, collectionId, accessToken, deleteCollection]);

  const handleAddContent = useCallback(
    (contentToAdd: ContentToAdd) => {
      if (!accessToken) return;
      addContent({
        collectionId: collectionId!,
        contentId: contentToAdd.id,
        contentType: contentToAdd.type,
        accessToken,
      });
    },
    [accessToken, collectionId, addContent],
  );

  const handleRemoveContent = useCallback(
    (contentIdToRemove: number) => {
      if (!accessToken || !collection?.contentPosters) return;
      const contentToRemove = collection.contentPosters.find(
        (c: any) => c.contentId === contentIdToRemove,
      );
      if (!contentToRemove) {
        message.error("삭제할 작품 정보를 찾을 수 없습니다.");
        return;
      }
      removeContent({
        collectionId: collectionId!,
        contentId: contentIdToRemove,
        contentType: contentToRemove.contentType,
        accessToken,
      });
    },
    [
      accessToken,
      collectionId,
      removeContent,
      collection?.contentPosters,
      message,
    ],
  );

  // --- 로딩 및 에러 처리 ---
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner /> {/* ✅ size prop 제거 */}
      </div>
    );
  }
  if (isError || !collection) {
    return <div>컬렉션 정보를 찾을 수 없습니다.</div>;
  }

  // --- Render ---
  const primaryHeaderButtonClass =
    "flex w-20 md:w-28 justify-center rounded-full border border-solid border-white bg-transparent px-2 py-2 text-xs font-medium text-white transition-colors hover:bg-white/20 md:px-5 md:text-sm disabled:opacity-50";
  const secondaryHeaderButtonClass =
    "flex w-20 md:w-28 justify-center rounded-full border border-gray-300 bg-white px-2 py-2 text-xs font-medium text-footerBlue transition-colors hover:bg-gray-200 md:px-5 md:text-sm disabled:opacity-50";

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
                      src={collection.userProfileUrl}
                      size={{ xs: 25, sm: 28, md: 30 }}
                    />
                    <span className="gmarket-medium text-xs text-white">
                      {collection.userNickname}
                    </span>
                  </div>
                  {isEditing ? (
                    <div className="flex flex-col gap-2 pr-4">
                      <Input
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                        placeholder="컬렉션 제목"
                        maxLength={15}
                      />
                      <Input.TextArea
                        value={editedDescription}
                        onChange={(e) => setEditedDescription(e.target.value)}
                        placeholder="컬렉션 소개"
                        maxLength={50}
                        rows={2}
                      />
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
                  {isOwner ? (
                    <div className="flex flex-col items-end gap-2">
                      {isEditing ? (
                        <>
                          <button
                            type="button"
                            onClick={handleEditSave}
                            className={primaryHeaderButtonClass}
                            disabled={isUpdating}
                          >
                            {isUpdating ? (
                              <Spinner /> 
                            ) : (
                              "저장 완료"
                            )}
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
                            onClick={() => setIsEditing(true)}
                            className={primaryHeaderButtonClass}
                          >
                            컬렉션 수정
                          </button>
                          <button
                            type="button"
                            onClick={showDeleteConfirm}
                            className={secondaryHeaderButtonClass}
                            disabled={isDeleting}
                          >
                            컬렉션 삭제
                          </button>
                        </>
                      )}
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSaveToggle}
                      className="mt-14 flex items-center justify-center gap-1 rounded-full border border-solid border-white bg-transparent px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-white/20 md:gap-2 md:px-4 md:py-2 md:text-sm"
                      disabled={isMarking}
                    >
                      <img
                        src={collection.isMarked ? FullSaveIcon : EmptySaveIcon}
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
            <div className="mb-4 text-right text-gray-500">
              총 {collection.contentCount ?? 0}개의 작품
            </div>
            <div className="grid grid-cols-2 justify-items-center gap-4 md:flex md:flex-wrap md:justify-center md:gap-6 lg:gap-8">
              {isOwner && isEditing && (
                <AddContentCard onClick={() => setIsSearchModalOpen(true)} />
              )}
              {collection.contentPosters?.map((content: any) =>
                isEditing && isOwner ? (
                  <EditablePoster
                    key={content.contentId}
                    id={content.contentId}
                    title={content.title}
                    posterUrl={`${TMDB_IMAGE_BASE_URL}${content.posterPath}`}
                    onRemove={handleRemoveContent}
                    isEditing={isEditing}
                  />
                ) : (
                  <Poster
                    key={content.contentId}
                    id={content.contentId}
                    title={content.title}
                    contentType={content.contentType}
                    posterUrl={`${TMDB_IMAGE_BASE_URL}${content.posterPath}`}
                  />
                ),
              )}
            </div>
          </div>
        }
      />
      <SearchContentModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onAddContent={handleAddContent}
        existingContentIds={
          collection.contentPosters?.map((c: any) => c.contentId) || []
        }
      />
    </>
  );
};

export default CollectionDetailPage;