import SearchBar from "@/components/common/SearchBar";
import HeroCarousel from "@/components/MainSection/HeroCarousel";
import HeroRanking from "@/components/MainSection/HeroRanking";

const MainPage = () => {
  return (
    <div className="flex flex-col gap-32">
      <div className="flex flex-col gap-10 bg-gradient-to-b from-[#172039] to-[#FFFFFF] pt-32 sm:gap-20">
        <HeroCarousel />
        <SearchBar onSearch={() => {}} />
        <HeroRanking />
      </div>
    </div>
  );
};

export default MainPage;
