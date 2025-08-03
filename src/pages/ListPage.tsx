import { useEffect, useRef, useState } from "react";
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
import { SearchResult } from "@/types/Search.types";

const ListPage = () => {
  const [sort, setSort] = useState("recent");
  const [searchKeyword, setSearchKeyword] = useState("");

  const isSearching = !!searchKeyword.trim();
  const observerRef = useRef<HTMLDivElement | null>(null);

  // 전체 콘텐츠
  const {
    data: allData,
    fetchNextPage: fetchAllNext,
    hasNextPage: hasAllNext,
    isFetchingNextPage: isFetchingAllNext,
  } = useAllContents({ pageSize: 30, sort });

  const allContents: AllContentItem[] =
    allData?.pages.flatMap((page) => page.contents) ?? [];

  // 검색 결과
  const {
    data: searchData,
    fetchNextPage: fetchSearchNext,
    hasNextPage: hasSearchNext,
    isFetchingNextPage: isFetchingSearchNext,
  } = useSearchContents({
    keyword: searchKeyword,
    size: 30,
  });

  // 검색결과 -> 전체 리스트 타입에 매핑
  const mapSearchResultsToAllContentItems = (
    results: SearchResult[],
  ): AllContentItem[] => {
    return results.map((result) => ({
      id: result.contentId, // AllContentItem의 id는 contentId로 매핑
      type: result.contentType as ContentCategory, // 문자열을 enum으로 타입 단언
      title: result.title,
      releaseDate: result.releaseDate,
      posterPath: result.posterPath,
    }));
  };

  const searchResults: AllContentItem[] =
    searchData?.pages.flatMap((page) =>
      mapSearchResultsToAllContentItems(page.content),
    ) ?? [];

  // 현재 화면에 보여줄 콘텐츠
  const displayContents = isSearching ? searchResults : allContents;

  // 무한 스크롤 처리
  useEffect(() => {
    if (!observerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;

        if (isSearching) {
          if (hasSearchNext && !isFetchingSearchNext) fetchSearchNext();
        } else {
          if (hasAllNext && !isFetchingAllNext) fetchAllNext();
        }
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
  ]);

  const handleSearch = (keyword: string) => {
    setSearchKeyword(keyword);
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
          <SearchBar onSearch={handleSearch} />
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
        {displayContents.map((content) => (
          <Poster
            key={content.id}
            id={content.id}
            title={content.title}
            contentType={content.type}
            posterUrl={`${TMDB_IMAGE_BASE_URL}${content.posterPath}`}
            likeState="NEUTRAL"
            onLikeChange={() => {}}
          />
        ))}
      </div>

      {(isSearching ? hasSearchNext : hasAllNext) && (
        <div ref={observerRef} className="h-10" />
      )}
    </PageLayout>
  );
};

export default ListPage;
