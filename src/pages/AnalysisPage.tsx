import AnalysisHeroSection from "@/components/Analysis/AnalysisHeroSection";
import MyStyleSection from "@/components/Analysis/MyStyleSection";
import MyWatchingStyleBoard from "@/components/Analysis/MyWatchingStyleBoard";
import RoleDashBoard from "@/components/Analysis/RoleDashBoard";

const AnalysisPage = () => {
  return (
    <main className="pretendard">
      <AnalysisHeroSection />
      <MyStyleSection />
      <RoleDashBoard />
      <MyWatchingStyleBoard />
    </main>
  );
};

export default AnalysisPage;
