import PageLayout from "@/layout/PageLayout";
import Poster from "@/components/common/Poster";
import SearchBar from "@/components/common/SearchBar";
import SectionHeader from "@/components/common/SectionHeader";
import FilterSection from "@/components/ListPage/FilterSection";
import { Select } from "antd";

const ListPage = () => {
  const posterData = [
    { id: 1, title: "1위 포스터" },
    { id: 2, title: "2위 포스터" },
    { id: 3, title: "3위 포스터" },
    { id: 4, title: "4위 포스터" },
    { id: 5, title: "5위 포스터" },
    { id: 6, title: "6위 포스터" },
    { id: 7, title: "7위 포스터" },
    { id: 8, title: "8위 포스터" },
    { id: 9, title: "9위 포스터" },
    { id: 10, title: "10위 포스터" },
  ];

  const handleChange = (value: string) => {
    console.log(`정렬 ${value}`);
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
      {/* PageLayout의 children으로 들어갈 메인 콘텐츠 */}
      <div className="self-right justify-self-end py-4 pr-4 xl:pr-0">
        <Select
          style={{ width: 80 }}
          onChange={handleChange}
          defaultValue="all"
          options={[
            { value: "all", label: "전체" },
            { value: "recent", label: "최신순" },
            { value: "popular", label: "인기순" },
          ]}
        />
      </div>
      <div className="flex flex-wrap place-content-center gap-9">
        {posterData.map(({ title, id }) => (
          <Poster
            id={id}
            title={title}
            posterUrl="https://image.tmdb.org/t/p/original/bvVoP1t2gNvmE9ccSrqR1zcGHGM.jpg"
            key={id}
            likeState="neutral"
            onLikeChange={() => {}}
          />
        ))}
      </div>
    </PageLayout>
  );
};

export default ListPage;
