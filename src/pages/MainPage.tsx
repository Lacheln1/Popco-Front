import SearchBar from "@/components/common/SearchBar";
import HeroCarousel from "@/components/MainSection/HeroCarousel";
import HeroCollection from "@/components/MainSection/HeroCollection";
import HeroPersona from "@/components/MainSection/HeroPersona";
import HeroPersonaBanner from "@/components/MainSection/HeroPersonaBanner";
import HeroPopcorithm from "@/components/MainSection/HeroPopcorithm";
import HeroRanking from "@/components/MainSection/HeroRanking";
import HeroReview from "@/components/MainSection/HeroReview";
import HeroTop1 from "@/components/MainSection/HeroTop1";

const MainPage = () => {
  return (
    <div className="flex flex-col gap-32 overflow-x-hidden pb-20 md:pb-32">
      <div className="flex flex-col gap-10 bg-gradient-to-b from-[#172039] to-[#FFFFFF] pt-32 sm:gap-20">
        <HeroCarousel />
        <SearchBar onSearch={() => {}} />
        <HeroRanking />
      </div>
      <HeroTop1 />
      <HeroPopcorithm />
      <HeroPersonaBanner />
      <HeroPersona />
      <HeroReview />
      <HeroCollection />
    </div>
  );
};
export default MainPage;
