import SearchBar from "@/components/common/SearchBar";
import HeroCarousel from "@/components/MainSection/HeroCarousel";
import HeroCollection from "@/components/MainSection/HeroCollection";
import HeroPersona from "@/components/MainSection/HeroPersona";
import HeroPersonaBanner from "@/components/MainSection/HeroPersonaBanner";
import HeroPopcorithm from "@/components/MainSection/HeroPopcorithm";
import HeroRanking from "@/components/MainSection/HeroRanking";
import HeroTop1 from "@/components/MainSection/HeroTop1";
import HeroReview from "@/components/MainSection/HeroReview";
import {
  checkTokenStatus,
  getAccessToken,
  validateAndRefreshTokens,
} from "@/apis/tokenApi";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const MainPage = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const initAuth = async () => {
      const isTokenValid = await checkTokenStatus();
      if (!isTokenValid) {
        navigate("/login");
      }
    };

    initAuth();
  }, []);
  useEffect(() => {
    const checkAuth = async () => {
      console.log("=== 메인페이지 토큰 검증 시작 ===");

      // 현재 액세스 토큰 확인
      const currentToken = getAccessToken();
      console.log("현재 메모리의 액세스 토큰:", currentToken);

      // 액세스 토큰이 없을 때만 갱신 시도
      if (!currentToken) {
        console.log("액세스 토큰이 없음 - 갱신 시도");

        try {
          const isValid = await validateAndRefreshTokens();
          if (!isValid) {
            console.log("토큰 갱신 실패 - 로그인 페이지로 이동");
            navigate("/login");
          }
        } catch (error) {
          console.error("토큰 검증 중 에러:", error);
          navigate("/login");
        }
      } else {
        console.log("액세스 토큰이 이미 있음 - 갱신 생략");
      }
    };

    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="flex flex-col gap-32 overflow-x-hidden pb-20 sm:gap-40 md:pb-32">
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
