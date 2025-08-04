import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { fetchSearchContents } from "@/apis/searchApi";
import { SearchContentsParams, SearchResponse } from "@/types/Search.types";

// 커스텀 debounce 훅
const useDebouncedValue = <T>(value: T, delay: number): T => {
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
};

export const useSearchContents = ({
  keyword,
  actors,
  size,
  enabled = true,
}: SearchContentsParams & { enabled?: boolean }) => {
  // 300ms debounce 적용
  const debouncedKeyword = useDebouncedValue(keyword, 300);
  const debouncedActors = useDebouncedValue(actors, 300);

  return useInfiniteQuery<SearchResponse, Error>({
    queryKey: ["searchContents", debouncedKeyword, debouncedActors, size],
    queryFn: async ({ pageParam = 0 }) => {
      try {
        const result = await fetchSearchContents({
          keyword: debouncedKeyword,
          actors: debouncedActors,
          page: pageParam as number,
          size,
        });

        // API 응답 검증
        if (!result) {
          throw new Error("API returned null/undefined response");
        }
        // 필수 속성 검증
        if (
          typeof result.last !== "boolean" ||
          typeof result.number !== "number"
        ) {
          console.warn("Invalid response structure:", result);
          // 기본값으로 응답 구조 수정
          return {
            ...result,
            last: result.last ?? true, // 기본값: 마지막 페이지로 처리
            number: result.number ?? (pageParam as number),
            content: result.content ?? [],
          };
        }

        return result;
      } catch (error) {
        console.error("Search API error:", error);
        throw error;
      }
    },
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage) {
        console.warn("lastPage is undefined in getNextPageParam");
        return undefined;
      }
      if (typeof lastPage.last !== "boolean") {
        console.warn("lastPage.last is not a boolean:", lastPage);
        // content가 비어있거나 size보다 작으면 마지막으로 간주
        const hasMoreContent =
          lastPage.content && lastPage.content.length === size;
        return hasMoreContent
          ? (lastPage.number ?? allPages.length - 1) + 1
          : undefined;
      }

      // 정상적인 경우
      return lastPage.last ? undefined : lastPage.number + 1;
    },
    initialPageParam: 0,
    enabled:
      enabled &&
      !!(
        (debouncedKeyword && debouncedKeyword.trim().length > 0) ||
        (debouncedActors && debouncedActors.some((a) => a.trim().length > 0))
      ),
    // 에러 발생 시 재시도 설정
    retry: (failureCount, error) => {
      console.log("에러 발생으로 재시도 설정:", failureCount, error);
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    // 데이터 검증을 위한 select 함수 추가
    select: (data) => {
      return {
        ...data,
        pages: data.pages.filter((page) => page !== undefined && page !== null),
      };
    },
  });
};
