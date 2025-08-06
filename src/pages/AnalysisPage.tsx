import { useEffect, useState, useRef, lazy, Suspense } from "react";
import { getRoleDashBoardData, getUserPersonas } from "@/apis/userApi";
const AnalysisHeroSection = lazy(
  () => import("@/components/Analysis/AnalysisHeroSection"),
);
const LikeContentSection = lazy(
  () => import("@/components/Analysis/LikeContentsSection"),
);
const MyStyleSection = lazy(
  () => import("@/components/Analysis/MyStyleSection"),
);
const MyWatchingStyleBoard = lazy(
  () => import("@/components/Analysis/MyWatchingStyleBoard"),
);
const RoleDashBoard = lazy(() => import("@/components/Analysis/RoleDashBoard"));
import Spinner from "@/components/common/Spinner";
import useAuthCheck from "@/hooks/useAuthCheck";
import { getPersonaText } from "@/apis/personaApi";

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

interface RoleDashBoardData {
  genderPercent: number[];
  agePercent: number[];
  ratingPercent: number[];
  eventPercent: number[];
  eventCount: number;
  reviewPercent: number[];
  myLikePercent: number[];
}

interface PersonaText {
  text1: string;
  text2: string;
}

const AnalysisPage = () => {
  const [userData, setUserData] = useState<UserPersonaData | null>(null);
  const [dashBoardData, setDashBoardData] = useState<RoleDashBoardData | null>(
    null,
  );
  const [personaText, setPersonaText] = useState<PersonaText | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { accessToken, isLoading: authLoading, user } = useAuthCheck();

  // 중복 실행 방지를 위한 ref
  const hasFetched = useRef(false);

  useEffect(() => {
    const getUserPersonasData = async () => {
      // 인증 로딩 중이면 대기
      if (authLoading) {
        return;
      }

      // 이미 데이터를 가져왔으면 중복 실행 방지
      if (hasFetched.current) {
        return;
      }

      // 로그인되지 않은 상태면 에러 설정하고 리턴
      if (!user.isLoggedIn || !accessToken) {
        setError("로그인이 필요합니다.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // 데이터 가져오기 시작 표시
        hasFetched.current = true;

        // 기본 데이터부터 먼저 가져오기
        const [response, dashboardResponse] = await Promise.all([
          getUserPersonas(accessToken),
          getRoleDashBoardData(accessToken),
        ]);

        if (
          !response ||
          !response.data ||
          !dashboardResponse ||
          !dashboardResponse.data
        ) {
          throw new Error("유효하지 않은 응답 데이터");
        }

        setUserData(response.data);
        setDashBoardData(dashboardResponse.data);

        // 페르소나 텍스트는 별도로 비동기 처리
        getPersonaText(accessToken)
          .then((personaTextResponse) => {
            if (personaTextResponse) {
              setPersonaText(personaTextResponse.data);
            }
          })
          .catch((error) => {
            console.error("페르소나 텍스트 가져오기 실패:", error);
            // 페르소나 텍스트 실패는 전체 렌더링을 막지 않음
          });
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
          <div>
            <Spinner />
            인증 확인 중...
          </div>
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

  // 기본 데이터 로딩 중일 때
  if (loading) {
    return (
      <main className="pretendard">
        <div className="flex h-screen items-center justify-center">
          <div>
            <Spinner />
            나의 취향을 분석중입니다. 잠시만 기다려주세요...
          </div>
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

  // 기본 userData와 dashBoardData가 없을 때
  if (!userData || !dashBoardData || !accessToken) {
    return (
      <main className="pretendard">
        <div className="flex h-screen items-center justify-center">
          <div>데이터를 찾을 수 없습니다.</div>
        </div>
      </main>
    );
  }

  // 기본 데이터가 있으면 바로 렌더링 (personaText는 없어도 됨)
  return (
    <main className="pretendard">
      <Suspense fallback={<Spinner />}>
        <AnalysisHeroSection
          mainPersonaImgPath={userData.mainPersonaImgPath}
          mainPersonaName={userData.mainPersonaName}
          mainPersonaPercent={userData.mainPersonaPercent}
          myPersonaImgPath={userData.myPersonaImgPath}
          myPersonaName={userData.myPersonaName}
          subPersonaImgPath={userData.subPersonaImgPath}
          subPersonaName={userData.subPersonaName}
          subPersonaPercent={userData.subPersonaPercent}
          personaText1={personaText?.text1}
          personaText2={personaText?.text2}
        />
      </Suspense>

      <Suspense fallback={<Spinner />}>
        <MyStyleSection
          myPersonaTags={userData.myPersonaTags}
          myPersonaDescription={userData.myPersonaDescription}
          myPersonaGenres={userData.myPersonaGenres}
        />
      </Suspense>

      <Suspense fallback={<Spinner />}>
        <RoleDashBoard
          genderPercent={dashBoardData.genderPercent}
          agePercent={dashBoardData.agePercent}
          userId={user.userId}
          personaName={userData.myPersonaName}
        />
      </Suspense>

      <Suspense fallback={<Spinner />}>
        <MyWatchingStyleBoard
          ratingPercent={dashBoardData.ratingPercent}
          eventPercent={dashBoardData.eventPercent}
          eventCount={dashBoardData.eventCount}
          reviewPercent={dashBoardData.reviewPercent}
          myLikePercent={dashBoardData.myLikePercent}
          personaName={userData.myPersonaName}
        />
      </Suspense>

      <Suspense fallback={<Spinner />}>
        <LikeContentSection
          userId={user.userId}
          personaName={userData.myPersonaName}
          accessToken={accessToken}
        />
      </Suspense>
    </main>
  );
};

export default AnalysisPage;
