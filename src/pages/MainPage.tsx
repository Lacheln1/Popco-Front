import SearchBar from "@/components/common/SearchBar";
import HeroCarousel from "@/components/MainPage/HeroCarousel";
import HeroCollection from "@/components/MainPage/HeroCollection";
import HeroPersona from "@/components/MainPage/HeroPersona";
import HeroPersonaBanner from "@/components/MainPage/HeroPersonaBanner";
import HeroPopcorithm from "@/components/MainPage/HeroPopcorithm";
import HeroRanking from "@/components/MainPage/HeroRanking";
import HeroTop1 from "@/components/MainPage/HeroTop1";
import HeroReview from "@/components/MainPage/HeroReview";
import useAuthCheck from "@/hooks/useAuthCheck";
import { ContentCategory } from "@/types/Contents.types";
import { useState } from "react";

const MainPage = () => {
  const { user, accessToken } = useAuthCheck();
  const [top1Type, setTop1Type] = useState<ContentCategory>("all");
  const [top1Title, setTop1Title] = useState<string>("");
  return (
    <div className="flex flex-col gap-32 overflow-x-hidden pb-20 sm:gap-40 md:pb-32">
      <div className="flex flex-col gap-10 bg-gradient-to-b from-[#172039] to-[#FFFFFF] pt-32 sm:gap-20">
        <HeroCarousel />
        <SearchBar onSearch={() => {}} />
        <HeroRanking
          onTop1Change={(type, title) => {
            setTop1Type(type);
            setTop1Title(title);
          }}
        />
      </div>
      <HeroTop1
        accessToken={accessToken ?? ""}
        userId={user.userId}
        type={top1Type}
        title={top1Title}
      />
      <HeroPopcorithm accessToken={accessToken ?? ""} userId={user.userId} />
      <HeroPersonaBanner />
      <HeroPersona accessToken={accessToken ?? ""} userId={user.userId} />
      <HeroReview />
      <HeroCollection />
    </div>
  );
};
export default MainPage;
