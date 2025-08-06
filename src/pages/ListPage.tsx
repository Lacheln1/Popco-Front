import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import { Select } from "antd";
import PageLayout from "@/layout/PageLayout";
import SectionHeader from "@/components/common/SectionHeader";
import SearchBar from "@/components/common/SearchBar";
import FilterSection from "@/components/ListPage/FilterSection";
import Poster from "@/components/common/Poster";
import { useAllContents } from "@/hooks/queries/contents/useAllContents";
import {
  AllContentItem,
  ContentCategory,
  ReactionType,
} from "@/types/Contents.types";
import { TMDB_IMAGE_BASE_URL } from "@/constants/contents";
import { useSearchContents } from "@/hooks/queries/search/useSearchContents";
import { FilteredContentResponse, SearchResult } from "@/types/Search.types";
import { useFilterStore } from "@/store/useFilterStore";
import { useFilteredContents } from "@/hooks/queries/search/useFilteredContents";
import { useContentReaction } from "@/hooks/queries/contents/useContentReaction";
import useAuthCheck from "@/hooks/useAuthCheck";

type SearchType = "keyword" | "actors";
type SortType = "recent" | "popular";

const ListPage = () => {
  const { user, accessToken } = useAuthCheck();

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

  const hasActiveFilter =
    filter && typeof filter === "object"
      ? Object.values(filter).some((value) => {
          if (value === null || value === undefined) return false;
          if (Array.isArray(value)) return value.length > 0;
          if (typeof value === "object") {
            return Object.keys(value).length > 0;
          }
          return value !== undefined && value !== null && value !== "";
        })
      : false;

  // API 훅 - userId와 accessToken 전달, 페이지 로드시 최신 데이터 보장
  const allContentsQuery = useAllContents({
    size: 28,
    sort,
    enabled: !isSearching && !hasActiveFilter,
    userId: user.isLoggedIn ? user.userId : undefined, // 로그인된 경우에만 userId 전달
    accessToken: user.isLoggedIn ? accessToken : undefined, // 로그인된 경우에만 accessToken 전달
  });

  // 페이지 로드시 최신 데이터 보장을 위한 리프레시
  useEffect(() => {
    if (!isSearching && !hasActiveFilter && user.isLoggedIn) {
      // 리스트페이지 진입시 캐시된 데이터가 오래되었을 수 있으므로 백그라운드에서 리프레시
      allContentsQuery.refetch();
    }
  }, [user.isLoggedIn]); // 로그인 상태 변경시에만 실행

  // actors 검색
  const searchQuery = useSearchContents({
    keyword: isKeywordSearch ? searchKeyword : undefined,
    actors: isActorSearch ? searchActors : undefined,
    size: 28,
    enabled: isSearching,
  });

  const filteredContentsQuery = useFilteredContents({
    enabled: hasActiveFilter && !isSearching,
    size: 30,
  });

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
    allContentsQuery,
  ]);

  // userLiked, userDisliked를 ReactionType으로 변환하는 함수
  const convertToReactionType = useCallback(
    (userLiked?: boolean, userDisliked?: boolean): ReactionType => {
      if (userLiked) return "LIKE";
      if (userDisliked) return "DISLIKE";
      return "NEUTRAL";
    },
    [],
  );

  // 검색 결과 변환 함수 - reaction 추가
  const mapSearchResultsToAllContentItems = useCallback(
    (
      results: SearchResult[] | undefined,
    ): (AllContentItem & { reaction: ReactionType })[] => {
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
          reaction: convertToReactionType(
            (result as any).userLiked,
            (result as any).userDisliked,
          ), // 검색 결과에서도 userLiked/userDisliked 확인
        }));
    },
    [convertToReactionType],
  );

  // 콘텐츠 데이터 가져오기 함수들 - 메모이제이션 및 reaction 추가
  const getAllContents = useCallback((): (AllContentItem & {
    reaction: ReactionType;
  })[] => {
    const contents =
      allContentsQuery.data?.pages.flatMap((page) => page.contents) ?? [];
    return contents.map((content) => ({
      ...content,
      reaction: convertToReactionType(
        (content as any).userLiked,
        (content as any).userDisliked,
      ),
    }));
  }, [allContentsQuery.data?.pages, convertToReactionType]);

  const getSearchResults = useCallback((): (AllContentItem & {
    reaction: ReactionType;
  })[] => {
    if (!searchQuery.data?.pages) return [];
    return searchQuery.data.pages
      .filter((page) => page?.content)
      .flatMap((page) => mapSearchResultsToAllContentItems(page.content))
      .filter(Boolean);
  }, [searchQuery.data?.pages, mapSearchResultsToAllContentItems]);

  const mapFilteredResultsToAllContentItems = useCallback(
    (
      results: FilteredContentResponse[] | undefined,
    ): (AllContentItem & { reaction: ReactionType })[] => {
      if (!results) return [];
      return results.map((result) => ({
        id: result.contentId,
        title: result.title,
        type: result.contentType as ContentCategory,
        releaseDate: result.releaseDate,
        posterPath: result.posterPath,
        reaction: convertToReactionType(
          (result as any).userLiked,
          (result as any).userDisliked,
        ),
      }));
    },
    [convertToReactionType],
  );

  const getFilteredResults = useCallback((): (AllContentItem & {
    reaction: ReactionType;
  })[] => {
    if (!filteredContentsQuery.data?.pages) return [];
    return filteredContentsQuery.data.pages
      .filter((page) => page?.contents)
      .flatMap((page) => mapFilteredResultsToAllContentItems(page.contents))
      .filter(Boolean);
  }, [filteredContentsQuery.data?.pages, mapFilteredResultsToAllContentItems]);

  // 로딩 상태 체크
  const getCurrentLoadingState = useCallback(() => {
    if (isSearching) {
      return searchQuery.isLoading || searchQuery.isFetching;
    }
    if (hasActiveFilter) {
      return (
        filteredContentsQuery.isLoading || filteredContentsQuery.isFetching
      );
    }
    return allContentsQuery.isLoading || allContentsQuery.isFetching;
  }, [
    isSearching,
    hasActiveFilter,
    searchQuery,
    filteredContentsQuery,
    allContentsQuery,
  ]);

  // 에러 상태 체크 - 중복 조건 수정
  const getCurrentErrorState = useCallback(() => {
    if (isSearching) {
      return searchQuery.error;
    }
    if (hasActiveFilter) {
      return filteredContentsQuery.error;
    }
    return allContentsQuery.error;
  }, [
    isSearching,
    hasActiveFilter,
    searchQuery.error,
    filteredContentsQuery.error,
    allContentsQuery.error,
  ]);

  // 표시할 콘텐츠 결정
  const getDisplayContents = useCallback((): (AllContentItem & {
    reaction: ReactionType;
  })[] => {
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

  // 표시할 콘텐츠 결정 - contentList보다 먼저 선언
  const displayContents = getDisplayContents();

  // useContentReaction을 위한 contentList 생성 - 안정적인 memoization
  const contentList = useMemo(() => {
    if (!user.isLoggedIn || displayContents.length === 0) return [];

    return displayContents.map((content) => ({
      id: content.id,
      reaction: content.reaction,
    }));
  }, [
    // displayContents 대신 필요한 값들만 의존성으로 사용
    displayContents.map((item) => `${item.id}-${item.reaction}`).join(","),
    user.isLoggedIn,
    user.userId,
  ]);

  // useContentReaction 훅 사용
  const {
    reactionMap,
    handleReaction,
    isLoading: isReactionLoading,
  } = useContentReaction({
    userId: user.userId,
    accessToken: accessToken ?? "",
    contentList,
  });

  // 무한 스크롤 설정 - 수정된 부분
  const getInfiniteScrollConfig = useCallback(() => {
    if (isSearching) {
      return {
        hasNext: Boolean(searchQuery.hasNextPage),
        isFetching: searchQuery.isFetchingNextPage,
        fetchNext: () => {
          if (searchQuery.hasNextPage && !searchQuery.isFetching) {
            searchQuery.fetchNextPage();
          }
        },
      };
    }

    if (hasActiveFilter) {
      return {
        hasNext: Boolean(filteredContentsQuery.hasNextPage),
        isFetching: filteredContentsQuery.isFetchingNextPage,
        fetchNext: () => {
          if (
            filteredContentsQuery.hasNextPage &&
            !filteredContentsQuery.isFetching
          ) {
            filteredContentsQuery.fetchNextPage();
          }
        },
      };
    }

    return {
      hasNext: Boolean(allContentsQuery.hasNextPage),
      isFetching: allContentsQuery.isFetchingNextPage,
      fetchNext: () => {
        if (allContentsQuery.hasNextPage && !allContentsQuery.isFetching) {
          allContentsQuery.fetchNextPage();
        }
      },
    };
  }, [
    isSearching,
    hasActiveFilter,
    searchQuery.hasNextPage,
    searchQuery.isFetchingNextPage,
    searchQuery.isFetching,
    filteredContentsQuery.hasNextPage,
    filteredContentsQuery.isFetchingNextPage,
    filteredContentsQuery.isFetching,
    allContentsQuery.hasNextPage,
    allContentsQuery.isFetchingNextPage,
    allContentsQuery.isFetching,
  ]);

  // 무한 스크롤 IntersectionObserver - 수정된 부분
  useEffect(() => {
    const target = observerRef.current;
    if (!target) return;

    const config = getInfiniteScrollConfig();

    // hasNext가 false이면 observer 설정하지 않음
    if (!config.hasNext) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry && entry.isIntersecting) {
          // 중복 호출 방지를 위한 재확인
          const currentConfig = getInfiniteScrollConfig();
          if (currentConfig.hasNext && !currentConfig.isFetching) {
            currentConfig.fetchNext();
          }
        }
      },
      {
        threshold: 0.1,
        rootMargin: "100px",
      },
    );

    observer.observe(target);
    return () => {
      observer.unobserve(target);
    };
  }, [
    // 의존성 단순화
    isSearching,
    hasActiveFilter,
    searchQuery.hasNextPage,
    filteredContentsQuery.hasNextPage,
    allContentsQuery.hasNextPage,
  ]);

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

  // 렌더링 데이터 - 메모이제이션
  const config = getInfiniteScrollConfig();
  const isLoading = getCurrentLoadingState();
  const error = getCurrentErrorState();

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
            onDebouncedChange={handleSearch}
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
              likeState={
                user.isLoggedIn
                  ? reactionMap[content.id] || content.reaction || "NEUTRAL"
                  : "NEUTRAL"
              }
              onLikeChange={(newState) =>
                handleReaction(content.id, newState, content.type)
              }
              disabled={isReactionLoading}
              className="max-w-[260px] md:w-[260px]"
            />
          ))
        ) : (
          <div className="py-8 text-center text-gray-500">
            {isLoading ? "로딩 중..." : "결과가 없습니다."}
          </div>
        )}
      </div>

      {/* 무한 스크롤 트리거 & 로딩 스피너 */}
      {config.hasNext && (
        <>
          <div
            ref={observerRef}
            className="h-10 w-full"
            style={{ backgroundColor: "transparent" }}
          />
          {config.isFetching && (
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
