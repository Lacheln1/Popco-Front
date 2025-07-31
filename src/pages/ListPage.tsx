import PageLayout from "@/layout/PageLayout";
import Poster from "@/components/common/Poster";
import SearchBar from "@/components/common/SearchBar";
import SectionHeader from "@/components/common/SectionHeader";
import FilterSection from "@/components/ListPage/FilterSection";
import { Select } from "antd";
import { useEffect, useRef, useState } from "react";
import { useAllContents } from "@/hooks/queries/contents/useAllContents";
import { AllContentItem } from "@/types/Contents.types";
import { TMDB_IMAGE_BASE_URL } from "@/constants/contents";

const ListPage = () => {
  const [sort, setSort] = useState("recent");

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useAllContents({ pageSize: 20, sort });

  const allContents: AllContentItem[] =
    data?.pages.flatMap((page) => page.contents) ?? [];

  const observerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!observerRef.current || !hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold: 1 },
    );

    const target = observerRef.current;
    observer.observe(target);

    return () => {
      if (target) observer.unobserve(target);
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleChange = (value: string) => {
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
          <SearchBar onSearch={() => {}} />
          <FilterSection />
        </>
      }
    >
      <div className="self-right justify-self-end py-4 pr-4 xl:pr-0">
        <Select
          style={{ width: 80 }}
          onChange={handleChange}
          defaultValue="recent"
          options={[
            { value: "recent", label: "최신순" },
            { value: "popular", label: "인기순" },
          ]}
        />
      </div>

      <div className="flex flex-wrap place-content-center gap-9">
        {allContents.map(({ id, title, posterPath }) => (
          <Poster
            key={id}
            id={id}
            title={title}
            posterUrl={`${TMDB_IMAGE_BASE_URL}${posterPath}`}
            likeState="NEUTRAL"
            onLikeChange={() => {}}
          />
        ))}
      </div>

      {hasNextPage && <div ref={observerRef} className="h-10" />}
    </PageLayout>
  );
};

export default ListPage;
