import { getUserPersonas } from "@/apis/userApi";
import AnalysisHeroSection from "@/components/Analysis/AnalysisHeroSection";
import LikeContentSection from "@/components/Analysis/LikeContentsSection";
import MyStyleSection from "@/components/Analysis/MyStyleSection";
import MyWatchingStyleBoard from "@/components/Analysis/MyWatchingStyleBoard";
import RoleDashBoard from "@/components/Analysis/RoleDashBoard";
import useAuthCheck from "@/hooks/useAuthCheck";
import { useEffect, useState, useRef } from "react";

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
  const { accessToken, isLoading: authLoading, user } = useAuthCheck();

  // 중복 실행 방지를 위한 ref
  const hasFetched = useRef(false);

  useEffect(() => {
    console.log(
      "useEffect 실행됨, accessToken:",
      accessToken,
      "authLoading:",
      authLoading,
      "user.isLoggedIn:",
      user.isLoggedIn,
    );

    const getUserPersonasData = async () => {
      // 인증 로딩 중이면 대기
      if (authLoading) {
        console.log("인증 처리 중이므로 대기");
        return;
      }

      // 이미 데이터를 가져왔으면 중복 실행 방지
      if (hasFetched.current) {
        console.log("이미 데이터를 가져왔으므로 실행하지 않음");
        return;
      }

      // 로그인되지 않은 상태면 에러 설정하고 리턴
      if (!user.isLoggedIn || !accessToken) {
        console.log("로그인되지 않은 상태");
        setError("로그인이 필요합니다.");
        setLoading(false);
        return;
      }

      console.log("getUserPersonasData 함수 시작, accessToken:", accessToken);

      try {
        console.log("API 호출 시작");
        setLoading(true);
        setError(null);

        // 데이터 가져오기 시작 표시
        hasFetched.current = true;

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
        hasFetched.current = false; // 실패 시 다시 시도할 수 있도록 리셋
      } finally {
        setLoading(false);
      }
    };

    getUserPersonasData();
  }, [accessToken, authLoading, user.isLoggedIn]); // user.isLoggedIn 의존성 추가

  // 컴포넌트 언마운트 시 ref 리셋
  useEffect(() => {
    return () => {
      hasFetched.current = false;
    };
  }, []);

  // 인증 로딩 중일 때
  if (authLoading) {
    return (
      <main className="pretendard">
        <div className="flex h-screen items-center justify-center">
          <div>인증 확인 중...</div>
        </div>
      </main>
    );
  }

  // 로그인되지 않은 상태 (이미 useAuthCheck에서 리다이렉트 처리되지만 안전장치)
  if (!user.isLoggedIn) {
    return (
      <main className="pretendard">
        <div className="flex h-screen items-center justify-center">
          <div>로그인이 필요한 페이지입니다.</div>
        </div>
      </main>
    );
  }

  // 로딩 중일 때
  if (loading) {
    return (
      <main className="pretendard">
        <div className="flex h-screen items-center justify-center">
          <div>데이터를 불러오는 중...</div>
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
