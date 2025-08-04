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

  // 상태 계산
  const isKeywordSearch =
    searchType === "keyword" && searchKeyword.trim().length > 0;
  const isActorSearch = searchType === "actors" && searchActors.length > 0;
  const isSearching = isKeywordSearch || isActorSearch;

  const hasActiveFilter = Object.values(filter).some((filterGroup) =>
    Object.values(filterGroup).some((value) =>
      Array.isArray(value) ? value.length > 0 : value !== undefined,
    ),
  );

  // API 훅들 - enabled 옵션으로 필요한 것만 실행
  const allContentsQuery = useAllContents({
    size: 30,
    sort,
    enabled: !isSearching && !hasActiveFilter,
  });

  const searchQuery = useSearchContents({
    keyword: searchType === "keyword" ? searchKeyword : undefined,
    actors: searchType === "actors" ? searchActors : undefined,
    size: 30,
    enabled: isSearching,
  });

  const { data: filteredData, isPending: isFilterLoading } =
    useFilteredContents();

  // 필터 적용 효과
  useEffect(() => {
    if (
      !isSearching &&
      !hasActiveFilter &&
      allContentsQuery.data?.pages?.length === 1 &&
      allContentsQuery.hasNextPage
    ) {
      const timer = setTimeout(() => {
        allContentsQuery.fetchNextPage();
      }, 100); // 살짝 지연을 주는 것이 안정적
      return () => clearTimeout(timer);
    }
  }, [
    isSearching,
    hasActiveFilter,
    sort,
    allContentsQuery.data?.pages?.length,
    allContentsQuery,
  ]);

  // 검색 결과 변환 함수 (null 체크 추가)
  const mapSearchResultsToAllContentItems = (
    results: SearchResult[] | undefined,
  ): AllContentItem[] => {
    if (!results || !Array.isArray(results)) {
      return [];
    }

    return results.map((result) => ({
      id: result.contentId,
      type: result.contentType as ContentCategory,
      title: result.title,
      releaseDate: result.releaseDate,
      posterPath: result.posterPath,
    }));
  };

  // 콘텐츠 데이터 가져오기
  const getAllContents = (): AllContentItem[] => {
    return allContentsQuery.data?.pages.flatMap((page) => page.contents) ?? [];
  };

  const getSearchResults = (): AllContentItem[] => {
    return (
      searchQuery.data?.pages.flatMap((page) =>
        mapSearchResultsToAllContentItems(page.content),
      ) ?? []
    );
  };

  const mapFilteredResultsToAllContentItems = (
    results: FilteredContentResponse[] | undefined,
  ): AllContentItem[] => {
    if (!results) return [];
    return results.map((result) => ({
      id: result.contentId,
      title: result.title,
      type: result.contentType as ContentCategory,
      releaseDate: result.releaseDate,
      posterPath: result.posterPath,
    }));
  };

  const getFilteredResults = (): AllContentItem[] => {
    return filteredData
      ? mapFilteredResultsToAllContentItems(filteredData.contents)
      : [];
  };

  // 현재 활성화된 쿼리의 로딩 상태만 체크
  const getCurrentLoadingState = () => {
    if (isSearching) {
      return searchQuery.isLoading || searchQuery.isFetching;
    }
    if (hasActiveFilter) {
      return isFilterLoading;
    }
    return allContentsQuery.isLoading || allContentsQuery.isFetching;
  };

  // 현재 상황에 맞는 에러 상태 체크
  const getCurrentErrorState = () => {
    if (isSearching) {
      return searchQuery.error;
    }
    if (!hasActiveFilter) {
      return allContentsQuery.error;
    }
    return null;
  };

  // 표시할 콘텐츠 결정
  const getDisplayContents = (): AllContentItem[] => {
    if (isSearching) return getSearchResults();
    if (hasActiveFilter) return getFilteredResults();
    return getAllContents();
  };

  // 무한 스크롤 설정
  const getInfiniteScrollConfig = useCallback(() => {
    if (isSearching) {
      return {
        hasNext: searchQuery.hasNextPage,
        isFetching: searchQuery.isFetchingNextPage,
        fetchNext: searchQuery.fetchNextPage,
      };
    }

    if (!hasActiveFilter) {
      return {
        hasNext: allContentsQuery.hasNextPage,
        isFetching: allContentsQuery.isFetchingNextPage,
        fetchNext: allContentsQuery.fetchNextPage,
      };
    }

    return { hasNext: false, isFetching: false, fetchNext: () => {} };
  }, [isSearching, hasActiveFilter, searchQuery, allContentsQuery]);

  // 무한 스크롤 IntersectionObserver
  useEffect(() => {
    const target = observerRef.current;
    if (!target) return;

    const { hasNext, isFetching, fetchNext } = getInfiniteScrollConfig();

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNext && !isFetching) {
          fetchNext();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(target);

    if (target.getBoundingClientRect().top < window.innerHeight) {
      fetchNext();
    }

    return () => {
      observer.unobserve(target);
    };
  }, [isSearching, hasActiveFilter, sort, getInfiniteScrollConfig]);

  // 이벤트 핸들러
  const handleSearch = (input: string) => {
    if (searchType === "keyword") {
      setSearchKeyword(input);
      setSearchActors([]);
    } else {
      setSearchActors([input]);
      setSearchKeyword("");
    }
  };

  const handleSortChange = (value: SortType) => {
    setSort(value);
    setSearchKeyword("");
    setSearchActors([]);
  };

  const handleLikeChange = (contentId: number) => {
    // TODO: 좋아요 상태 변경 로직 구현
    console.log("Like changed for content:", contentId);
  };

  // 렌더링 데이터
  const displayContents = getDisplayContents();
  const { hasNext } = getInfiniteScrollConfig();
  const isLoading = getCurrentLoadingState();
  const error = getCurrentErrorState();

  // 개선된 isEmpty 로직
  const isEmpty = displayContents.length === 0 && !isLoading;

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
            />
          ))
        ) : (
          <div className="py-8 text-center text-gray-500">
            {isLoading ? "로딩 중..." : "결과가 없습니다."}
          </div>
        )}
      </div>

      {/* 무한 스크롤 트리거 */}
      {hasNext && <div ref={observerRef} className="h-10" />}
    </PageLayout>
  );
};

export default ListPage;
