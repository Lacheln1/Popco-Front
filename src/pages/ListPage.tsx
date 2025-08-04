import { useCallback, useEffect, useRef, useState } from "react";
import { Select } from "antd";
import PageLayout from "@/layout/PageLayout";
import SectionHeader from "@/components/common/SectionHeader";
import SearchBar from "@/components/common/SearchBar";
import FilterSection from "@/components/ListPage/FilterSection";
import Poster from "@/components/common/Poster";
import { useAllContents } from "@/hooks/queries/contents/useAllContents";
import { AllContentItem, ContentCategory } from "@/types/Contents.types";
import { TMDB_IMAGE_BASE_URL } from "@/constants/contents";
import { useSearchContents } from "@/hooks/queries/search/useSearchContents";
import { FilteredContentResponse, SearchResult } from "@/types/Search.types";
import { useFilterStore } from "@/store/useFilterStore";
import { useFilteredContents } from "@/hooks/queries/search/useFilteredContents";

type SearchType = "keyword" | "actors";
type SortType = "recent" | "popular";

const ListPage = () => {
  // 기본 상태
  const [sort, setSort] = useState<SortType>("recent");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchActors, setSearchActors] = useState<string[]>([]);
  const [searchType, setSearchType] = useState<SearchType>("keyword");

  const observerRef = useRef<HTMLDivElement | null>(null);
  const { filter } = useFilterStore();

  // 상태 계산 - 더 엄격한 검증
  const isKeywordSearch =
    searchType === "keyword" && searchKeyword.trim().length > 0;
  const isActorSearch = searchType === "actors" && searchActors.length > 0;
  const isSearching = isKeywordSearch || isActorSearch;

  const hasActiveFilter = Object.values(filter).some((filterGroup) =>
    Object.values(filterGroup).some((value) =>
      Array.isArray(value) ? value.length > 0 : value !== undefined,
    ),
  );

  // API 훅들 - 조건부 실행 최적화
  const allContentsQuery = useAllContents({
    size: 28,
    sort,
    enabled: !isSearching && !hasActiveFilter,
  });

  // actors 검색 수정 - 빈 배열이 아닌 실제 값만 전달
  const searchQuery = useSearchContents({
    keyword: isKeywordSearch ? searchKeyword : undefined,
    actors: isActorSearch ? searchActors : undefined,
    size: 30,
    enabled: isSearching,
  });

  const { data: filteredData, isPending: isFilterLoading } =
    useFilteredContents();

  // 무한 로딩 방지 - dependency 최적화
  useEffect(() => {
    if (
      !isSearching &&
      !hasActiveFilter &&
      allContentsQuery.data?.pages?.length === 1 &&
      allContentsQuery.hasNextPage &&
      !allContentsQuery.isFetching
    ) {
      const timer = setTimeout(() => {
        if (!allContentsQuery.isFetching) {
          allContentsQuery.fetchNextPage();
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [
    isSearching,
    hasActiveFilter,
    sort,
    allContentsQuery.hasNextPage,
    allContentsQuery.isFetching,
  ]);

  // 검색 결과 변환 함수
  const mapSearchResultsToAllContentItems = useCallback(
    (results: SearchResult[] | undefined): AllContentItem[] => {
      if (!results || !Array.isArray(results)) {
        return [];
      }
      return results
        .filter((result) => result && result.contentId)
        .map((result) => ({
          id: result.contentId,
          type: result.contentType as ContentCategory,
          title: result.title || "",
          releaseDate: result.releaseDate || "",
          posterPath: result.posterPath || "",
        }));
    },
    [],
  );

  // 콘텐츠 데이터 가져오기 함수들 - 메모이제이션
  const getAllContents = useCallback((): AllContentItem[] => {
    return allContentsQuery.data?.pages.flatMap((page) => page.contents) ?? [];
  }, [allContentsQuery.data?.pages]);

  const getSearchResults = useCallback((): AllContentItem[] => {
    if (!searchQuery.data?.pages) return [];
    return searchQuery.data.pages
      .filter((page) => page?.content)
      .flatMap((page) => mapSearchResultsToAllContentItems(page.content))
      .filter(Boolean);
  }, [searchQuery.data?.pages, mapSearchResultsToAllContentItems]);

  const mapFilteredResultsToAllContentItems = useCallback(
    (results: FilteredContentResponse[] | undefined): AllContentItem[] => {
      if (!results) return [];
      return results.map((result) => ({
        id: result.contentId,
        title: result.title,
        type: result.contentType as ContentCategory,
        releaseDate: result.releaseDate,
        posterPath: result.posterPath,
      }));
    },
    [],
  );

  const getFilteredResults = useCallback((): AllContentItem[] => {
    return filteredData
      ? mapFilteredResultsToAllContentItems(filteredData.contents)
      : [];
  }, [filteredData, mapFilteredResultsToAllContentItems]);

  // 로딩 상태 체크
  const getCurrentLoadingState = useCallback(() => {
    if (isSearching) {
      return searchQuery.isLoading || searchQuery.isFetching;
    }
    if (hasActiveFilter) {
      return isFilterLoading;
    }
    return allContentsQuery.isLoading || allContentsQuery.isFetching;
  }, [
    isSearching,
    hasActiveFilter,
    searchQuery,
    isFilterLoading,
    allContentsQuery,
  ]);

  // 에러 상태 체크
  const getCurrentErrorState = useCallback(() => {
    if (isSearching) {
      return searchQuery.error;
    }
    if (!hasActiveFilter) {
      return allContentsQuery.error;
    }
    return null;
  }, [isSearching, hasActiveFilter, searchQuery.error, allContentsQuery.error]);

  // 표시할 콘텐츠 결정
  const getDisplayContents = useCallback((): AllContentItem[] => {
    if (isSearching) return getSearchResults();
    if (hasActiveFilter) return getFilteredResults();
    return getAllContents();
  }, [
    isSearching,
    hasActiveFilter,
    getSearchResults,
    getFilteredResults,
    getAllContents,
  ]);

  // 무한 스크롤 설정 - 안정성 개선
  const getInfiniteScrollConfig = useCallback(() => {
    if (isSearching) {
      return {
        hasNext: searchQuery.hasNextPage && !searchQuery.isFetching,
        isFetching: searchQuery.isFetchingNextPage,
        fetchNext: () => {
          if (searchQuery.hasNextPage && !searchQuery.isFetching) {
            searchQuery.fetchNextPage();
          }
        },
      };
    }

    if (!hasActiveFilter) {
      return {
        hasNext: allContentsQuery.hasNextPage && !allContentsQuery.isFetching,
        isFetching: allContentsQuery.isFetchingNextPage,
        fetchNext: () => {
          if (allContentsQuery.hasNextPage && !allContentsQuery.isFetching) {
            allContentsQuery.fetchNextPage();
          }
        },
      };
    }

    return { hasNext: false, isFetching: false, fetchNext: () => {} };
  }, [isSearching, hasActiveFilter, searchQuery, allContentsQuery]);

  // 무한 스크롤 IntersectionObserver - 최적화
  useEffect(() => {
    const target = observerRef.current;
    if (!target) return;

    const { hasNext, isFetching, fetchNext } = getInfiniteScrollConfig();

    // 이미 모든 데이터를 불러왔거나 로딩 중이면 옵저버 설정하지 않음
    if (!hasNext || isFetching) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNext && !isFetching) {
          fetchNext();
        }
      },
      { threshold: 0.1, rootMargin: "50px" },
    );

    observer.observe(target);
    return () => observer.unobserve(target);
  }, [getInfiniteScrollConfig]);

  // 이벤트 핸들러 - actors 검색 개선
  const handleSearch = useCallback(
    (input: string) => {
      if (searchType === "keyword") {
        setSearchKeyword(input.trim());
        setSearchActors([]);
      } else {
        // actors 검색 시 빈 문자열 체크
        if (input.trim()) {
          setSearchActors([input.trim()]);
        } else {
          setSearchActors([]);
        }
        setSearchKeyword("");
      }
    },
    [searchType],
  );

  const handleSortChange = useCallback((value: SortType) => {
    setSort(value);
    setSearchKeyword("");
    setSearchActors([]);
  }, []);

  const handleLikeChange = useCallback((contentId: number) => {
    // TODO: 좋아요 상태 변경 로직 구현
    console.log("Like changed for content:", contentId);
  }, []);

  // 렌더링 데이터 - 메모이제이션
  const displayContents = getDisplayContents();
  const { hasNext, isFetching } = getInfiniteScrollConfig();
  const isLoading = getCurrentLoadingState();
  const error = getCurrentErrorState();

  const isEmpty = displayContents.length === 0 && !isLoading;

  // 디버깅용 로그 (개발 중에만 사용)
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.log("🔍 Search State:", {
        searchType,
        isKeywordSearch,
        searchKeyword,
        isActorSearch,
        searchActors,
        isSearching,
        displayContents: displayContents.length,
      });
    }
  }, [
    searchType,
    isKeywordSearch,
    searchKeyword,
    isActorSearch,
    searchActors,
    isSearching,
    displayContents.length,
  ]);

  return (
    <PageLayout
      header={
        <SectionHeader
          title="전체 작품 탐색"
          description="필터와 검색으로 나에게 딱 맞는 작품을 찾아보세요!"
        />
      }
      floatingBoxContent={
        <>
          <SearchBar
            onSearch={handleSearch}
            searchType={searchType}
            setSearchType={setSearchType}
          />
          <FilterSection />
        </>
      }
    >
      {/* 정렬 옵션 */}
      <div className="self-right justify-self-end py-4 pr-4 xl:pr-0">
        <Select
          style={{ width: 80 }}
          onChange={handleSortChange}
          value={sort}
          options={[
            { value: "recent", label: "최신순" },
            { value: "popular", label: "인기순" },
          ]}
        />
      </div>

      {/* 콘텐츠 그리드 */}
      <div className="flex flex-wrap place-content-center gap-9">
        {error ? (
          <div className="py-8 text-center text-red-500">
            데이터를 불러오는 중 오류가 발생했습니다.
            {process.env.NODE_ENV === "development" && (
              <div className="mt-2 text-sm text-gray-400">{error.message}</div>
            )}
          </div>
        ) : !isEmpty ? (
          displayContents.map((content) => (
            <Poster
              key={`${content.type}-${content.id}`}
              id={content.id}
              title={content.title}
              contentType={content.type}
              posterUrl={`${TMDB_IMAGE_BASE_URL}${content.posterPath}`}
              likeState="NEUTRAL"
              onLikeChange={() => handleLikeChange(content.id)}
              className="max-w-[260px] md:w-[260px]"
            />
          ))
        ) : (
          <div className="py-8 text-center text-gray-500">
            {isLoading ? "로딩 중..." : "결과가 없습니다."}
            {/* 개발 모드에서 추가 정보 표시 */}
            {process.env.NODE_ENV === "development" && (
              <div className="mt-2 text-xs text-gray-400">
                Search: {isSearching ? "ON" : "OFF"} | Filter:{" "}
                {hasActiveFilter ? "ON" : "OFF"} | Type: {searchType} | Keyword:
                "{searchKeyword}" | Actors: {JSON.stringify(searchActors)}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 무한 스크롤 트리거 & 로딩 스피너 */}
      {hasNext && (
        <>
          <div ref={observerRef} className="h-10" />
          {isFetching && (
            <div className="flex justify-center py-6">
              <span className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-transparent" />
            </div>
          )}
        </>
      )}
    </PageLayout>
  );
};

export default ListPage;
