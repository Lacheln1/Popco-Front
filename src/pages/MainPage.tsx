import SearchBar from "@/components/common/SearchBar";
import HeroCarousel from "@/components/MainSection/HeroCarousel";

const MainPage = () => {
  return (
    <div className="bg-footerBlue pb-32 pt-32">
      <div className="flex flex-col gap-10 bg-gradient-to-b from-[#172039] to-[#FFFFFF] sm:gap-20">
        <HeroCarousel />
        <SearchBar onSearch={() => {}} />
      </div>
    </div>
  );
};

export default MainPage;
