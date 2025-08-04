import { useEffect, useRef, useState } from "react";
import { Radio, Select } from "antd";
import PageLayout from "@/layout/PageLayout";
import SectionHeader from "@/components/common/SectionHeader";
import SearchBar from "@/components/common/SearchBar";
import FilterSection from "@/components/ListPage/FilterSection";
import Poster from "@/components/common/Poster";
import { useAllContents } from "@/hooks/queries/contents/useAllContents";
import { AllContentItem, ContentCategory } from "@/types/Contents.types";
import { TMDB_IMAGE_BASE_URL } from "@/constants/contents";
import { useSearchContents } from "@/hooks/queries/search/useSearchContents";
import { SearchResult } from "@/types/Search.types";
import { useFilterStore } from "@/store/useFilterStore";
import { useFilteredContents } from "@/hooks/queries/search/useFilteredContents";

const ListPage = () => {
  const [sort, setSort] = useState("recent");

  // 검색 관련 상태
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchActors, setSearchActors] = useState<string[]>([]);
  const [searchType, setSearchType] = useState<"keyword" | "actors">("keyword");

  const isSearching =
    (searchType === "keyword" && searchKeyword.trim().length > 0) ||
    (searchType === "actors" && searchActors.length > 0);

  const observerRef = useRef<HTMLDivElement | null>(null);

  // 필터 관련 상태
  const { filter } = useFilterStore();
  const hasActiveFilter = Object.values(filter).some((filterGroup) =>
    Object.values(filterGroup).some((value) =>
      Array.isArray(value) ? value.length > 0 : value !== undefined,
    ),
  );

  // 전체 콘텐츠 (필터가 없을 때만)
  const {
    data: allData,
    fetchNextPage: fetchAllNext,
    hasNextPage: hasAllNext,
    isFetchingNextPage: isFetchingAllNext,
  } = useAllContents({
    pageSize: 30,
    sort,
    enabled: !isSearching && !hasActiveFilter, // 검색이나 필터가 없을 때만 활성화
  });

  const allContents: AllContentItem[] =
    allData?.pages.flatMap((page) => page.contents) ?? [];

  // 검색 API 호출
  const {
    data: searchData,
    fetchNextPage: fetchSearchNext,
    hasNextPage: hasSearchNext,
    isFetchingNextPage: isFetchingSearchNext,
  } = useSearchContents({
    keyword: searchType === "keyword" ? searchKeyword : undefined,
    actors: searchType === "actors" ? searchActors : undefined,
    size: 30,
  });

  // 필터된 콘텐츠 (검색하지 않을 때만)
  const {
    mutate: mutateFilter,
    data: filteredData,
    isLoading: isFilterLoading,
  } = useFilteredContents();

  // 필터 적용
  useEffect(() => {
    if (!isSearching && hasActiveFilter) {
      mutateFilter({ filter, page: 0, size: 30 });
    }
  }, [filter, isSearching, hasActiveFilter, mutateFilter]);

  // 검색결과 -> 전체 리스트 타입에 매핑
  const mapSearchResultsToAllContentItems = (
    results: SearchResult[],
  ): AllContentItem[] => {
    return results.map((result) => ({
      id: result.contentId,
      type: result.contentType as ContentCategory,
      title: result.title,
      releaseDate: result.releaseDate,
      posterPath: result.posterPath,
    }));
  };

  const searchResults: AllContentItem[] =
    searchData?.pages.flatMap((page) =>
      mapSearchResultsToAllContentItems(page.content),
    ) ?? [];

  const filteredResults: AllContentItem[] = filteredData
    ? mapSearchResultsToAllContentItems(filteredData.content)
    : [];

  // 표시할 콘텐츠 결정
  const displayContents = isSearching
    ? searchResults
    : hasActiveFilter
      ? filteredResults
      : allContents;

  // 무한 스크롤 처리
  useEffect(() => {
    if (!observerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;

        if (isSearching) {
          if (hasSearchNext && !isFetchingSearchNext) {
            fetchSearchNext();
          }
        } else if (!hasActiveFilter) {
          if (hasAllNext && !isFetchingAllNext) {
            fetchAllNext();
          }
        }
        // 필터된 결과는 현재 무한 스크롤 미지원
      },
      { threshold: 0 },
    );

    const target = observerRef.current;
    observer.observe(target);

    return () => {
      if (target) observer.unobserve(target);
    };
  }, [
    isSearching,
    hasSearchNext,
    isFetchingSearchNext,
    fetchSearchNext,
    hasAllNext,
    isFetchingAllNext,
    fetchAllNext,
    hasActiveFilter,
  ]);

  // 검색 실행
  const handleSearch = (input: string) => {
    if (searchType === "keyword") {
      setSearchKeyword(input);
      setSearchActors([]);
    } else {
      setSearchActors([input]);
      setSearchKeyword("");
    }
  };

  const handleSortChange = (value: string) => {
    setSort(value);
  };

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
      <div className="self-right justify-self-end py-4 pr-4 xl:pr-0">
        <Select
          style={{ width: 80 }}
          onChange={handleSortChange}
          defaultValue="recent"
          options={[
            { value: "recent", label: "최신순" },
            { value: "popular", label: "인기순" },
          ]}
        />
      </div>
      <div className="flex flex-wrap place-content-center gap-9">
        {displayContents.length > 0 ? (
          displayContents.map((content) => (
            <Poster
              key={content.id}
              id={content.id}
              title={content.title}
              contentType={content.type}
              posterUrl={`${TMDB_IMAGE_BASE_URL}${content.posterPath}`}
              likeState="NEUTRAL"
              onLikeChange={() => {}}
            />
          ))
        ) : (
          <div className="py-8 text-center text-gray-500">
            {isFilterLoading ? "로딩 중..." : "결과가 없습니다."}
          </div>
        )}
      </div>
      {(isSearching ? hasSearchNext : !hasActiveFilter && hasAllNext) && (
        <div ref={observerRef} className="h-10" />
      )}
    </PageLayout>
  );
};

export default ListPage;
