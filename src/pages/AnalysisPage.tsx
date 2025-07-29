import { getUserPersonas } from "@/apis/userApi";
import AnalysisHeroSection from "@/components/Analysis/AnalysisHeroSection";
import LikeContentSection from "@/components/Analysis/LikeContentsSection";
import MyStyleSection from "@/components/Analysis/MyStyleSection";
import MyWatchingStyleBoard from "@/components/Analysis/MyWatchingStyleBoard";
import RoleDashBoard from "@/components/Analysis/RoleDashBoard";
import useAuthCheck from "@/hooks/useAuthCheck";
import { useEffect, useState } from "react";
interface UserPersonaData {
  mainPersonaImgPath: string;
  mainPersonaName: string;
  mainPersonaPercent: number;
  myPersonaGenres: string[];
  myPersonaImgPath: string;
  myPersonaName: string;
  myPersonaTags: string;
  myPersonaDescription: string;
  subPersonaImgPath: string;
  subPersonaName: string;
  subPersonaPercent: number;
}

const AnalysisPage = () => {
  const [userData, setUserData] = useState<UserPersonaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { accessToken } = useAuthCheck();

  useEffect(() => {
    console.log("useEffect 실행됨, accessToken:", accessToken);

    const getUserPersonasData = async () => {
      console.log("getUserPersonasData 함수 시작, accessToken:", accessToken);

      if (!accessToken) {
        console.log("accessToken이 없어서 리턴");
        setLoading(false);
        return;
      }

      try {
        console.log("API 호출 시작");
        setLoading(true);
        const response = await getUserPersonas(accessToken);
        if (!response || !response.data) {
          throw new Error("유효하지 않은 응답 데이터");
        }
        console.log("API 응답:", response);
        setUserData(response.data);
        console.log("userdata 설정 후:", response.data);
      } catch (error) {
        console.error("페르소나 데이터 가져오기 실패:", error);
        setError("데이터를 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    getUserPersonasData();
  }, [accessToken]);

  // 로딩 중일 때
  if (loading) {
    return (
      <main className="pretendard">
        <div className="flex h-screen items-center justify-center">
          <div>Loading...</div>
        </div>
      </main>
    );
  }

  // 에러가 발생했을 때
  if (error) {
    return (
      <main className="pretendard">
        <div className="flex h-screen items-center justify-center">
          <div className="text-red-500">{error}</div>
        </div>
      </main>
    );
  }

  // userData가 null일 때
  if (!userData) {
    return (
      <main className="pretendard">
        <div className="flex h-screen items-center justify-center">
          <div>데이터를 찾을 수 없습니다.</div>
        </div>
      </main>
    );
  }

  // 정상적으로 데이터가 있을 때만 렌더링
  return (
    <main className="pretendard">
      <AnalysisHeroSection
        mainPersonaImgPath={userData.mainPersonaImgPath}
        mainPersonaName={userData.mainPersonaName}
        mainPersonaPercent={userData.mainPersonaPercent}
        myPersonaImgPath={userData.myPersonaImgPath}
        myPersonaName={userData.myPersonaName}
        subPersonaImgPath={userData.subPersonaImgPath}
        subPersonaName={userData.subPersonaName}
        subPersonaPercent={userData.subPersonaPercent}
      />
      <MyStyleSection
        myPersonaTags={userData.myPersonaTags}
        myPersonaDescription={userData.myPersonaDescription}
        myPersonaGenres={userData.myPersonaGenres}
      />
      <RoleDashBoard />
      <MyWatchingStyleBoard />
      <LikeContentSection />
    </main>
  );
};

export default AnalysisPage;
