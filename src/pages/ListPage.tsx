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
    <div>
      <div className="relative">
        <SectionHeader
          title="전체 작품 탐색"
          description="필터와 검색으로 나에게 딱 맞는 작품을 찾아보세요!"
        />
        <div className="absolute left-1/2 top-3/4 z-40 w-[90vw] -translate-x-1/2 transform rounded-2xl bg-zinc-50 pb-4 shadow-[0px_4px_10px_#0000001a] sm:pb-12 sm:pt-4 xl:w-[1200px]">
          <SearchBar onSearch={() => {}} />
          <FilterSection />
        </div>
      </div>
      <section className="m-auto max-w-[1200px] place-content-center pt-24 sm:pt-32">
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
      </section>
    </div>
  );
};

export default ListPage;
