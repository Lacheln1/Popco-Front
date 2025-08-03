import React, { useState, useMemo, useEffect } from "react";
import { Modal, Input, Empty } from "antd";
import { IoAdd, IoCheckmark, IoSearch } from "react-icons/io5";
import { TMDB_IMAGE_BASE_URL } from "@/constants/contents";
import Spinner from "@/components/common/Spinner";
import { searchContents } from "@/apis/collectionApi";

// --- 디바운스 훅 ---
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

interface ApiContentItem {
  contentId: number;
  title: string;
  posterPath: string | null;
  contentType: string;
}
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
  const [keyword, setKeyword] = useState("");
  // --- 디바운스 훅 사용 ---
  // 사용자가 입력한 keyword를 500ms(0.5초) 지연시켜 debouncedKeyword를 생성
  const debouncedKeyword = useDebounce(keyword, 500);

  const [directResults, setDirectResults] = useState<ApiContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // --- debouncedKeyword가 바뀔 때마다 API를 호출 ---
  useEffect(() => {
    if (!debouncedKeyword) {
      setDirectResults([]);
      setIsLoading(false);
      return;
    }

    const fetchDirectly = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await searchContents(debouncedKeyword);
        setDirectResults(data?.content || []);
      } catch (e: any) {
        setError(e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDirectly();
  }, [debouncedKeyword]); // 이제 debouncedKeyword에 의존합니다.

  const searchResults = useMemo(() => {
    return directResults.map((item) => ({
      id: item.contentId,
      title: item.title,
      posterUrl: item.posterPath
        ? `${TMDB_IMAGE_BASE_URL}${item.posterPath}`
        : "https://placehold.co/200x300?text=No+Image",
      type: item.contentType,
    }));
  }, [directResults]);

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
        <Input
          placeholder="영화, 드라마 제목을 검색하세요"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          size="large"
          prefix={<IoSearch className="text-gray-400" />}
          allowClear
        />
        <div className="flex h-[400px] flex-col gap-3 overflow-y-auto pr-2">
          {isLoading ? (
            <div className="flex h-full items-center justify-center">
              <Spinner />
            </div>
          ) : searchResults.length > 0 ? (
            searchResults.map((item) => {
              const isAdded = existingContentIds.includes(item.id);
              return (
                <div
                  key={item.id}
                  className="flex items-center gap-4 rounded-lg p-2 transition-colors hover:bg-gray-100"
                >
                  <img
                    src={item.posterUrl}
                    alt={item.title}
                    className="h-16 w-11 flex-shrink-0 rounded bg-gray-200 object-cover"
                  />
                  <span className="flex-1 font-semibold">{item.title}</span>
                  <button
                    type="button"
                    onClick={() => onAddContent(item)}
                    className={
                      isAdded ? disabledButtonClass : primaryButtonClass
                    }
                    disabled={isAdded}
                    aria-label={
                      isAdded ? `${item.title} 추가됨` : `${item.title} 추가`
                    }
                  >
                    {isAdded ? <IoCheckmark size={20} /> : <IoAdd size={20} />}
                  </button>
                </div>
              );
            })
          ) : (
            <div className="flex h-full items-center justify-center">
              <Empty
                description={
                  error
                    ? "검색 중 오류가 발생했습니다."
                    : debouncedKeyword
                      ? "검색 결과가 없습니다."
                      : "검색어를 입력해주세요."
                }
              />
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default SearchContentModal;
