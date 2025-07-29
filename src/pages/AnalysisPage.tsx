import { getUserPersonas } from "@/apis/userApi";
import AnalysisHeroSection from "@/components/Analysis/AnalysisHeroSection";
import LikeContentSection from "@/components/Analysis/LikeContentsSection";
import MyStyleSection from "@/components/Analysis/MyStyleSection";
import MyWatchingStyleBoard from "@/components/Analysis/MyWatchingStyleBoard";
import RoleDashBoard from "@/components/Analysis/RoleDashBoard";
import useAuthCheck from "@/hooks/useAuthCheck";
import { useEffect, useState } from "react";

const AnalysisPage = () => {
  const [userData, setUserData] = useState("");
  const { accessToken } = useAuthCheck();
  useEffect(() => {
    const getUserPersonasData = async () => {
      if (!accessToken) return;
      try {
        const response = await getUserPersonas(accessToken);
        setUserData(response);
      } catch (error) {
        console.error("페르소나 데이터 가져오기 실패:", error);
      }
    };
    getUserPersonasData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <main className="pretendard">
      <AnalysisHeroSection />
      <MyStyleSection />
      <RoleDashBoard />
      <MyWatchingStyleBoard />
      <LikeContentSection />
    </main>
  );
};

export default AnalysisPage;
