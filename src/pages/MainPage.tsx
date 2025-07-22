import SearchBar from "@/components/common/SearchBar";
import HeroCarousel from "@/components/MainSection/HeroCarousel";
import HeroPersona from "@/components/MainSection/HeroPersona";
import HeroPersonaBanner from "@/components/MainSection/HeroPersonaBanner";
import HeroPopcorithm from "@/components/MainSection/HeroPopcorithm";
import HeroRanking from "@/components/MainSection/HeroRanking";
import HeroTop1 from "@/components/MainSection/HeroTop1";
const MainPage = () => {
  return (
    <div className="flex flex-col gap-32 overflow-x-hidden">
      <div className="flex flex-col gap-10 bg-gradient-to-b from-[#172039] to-[#FFFFFF] pt-32 sm:gap-20">
        <HeroCarousel />
        <SearchBar onSearch={() => {}} />
        <HeroRanking />
      </div>
      <HeroTop1 />
      <HeroPopcorithm />
      <HeroPersonaBanner />
      <HeroPersona />
    </div>
  );
};
export default MainPage;
