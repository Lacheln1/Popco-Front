import { getUserDetail, getUserPersonas } from "@/apis/userApi";
import SectionHeader from "@/components/common/SectionHeader";
import Spinner from "@/components/common/Spinner";
import PageContents from "@/components/MyPage/PageContents";
import UserInfoSection from "@/components/MyPage/UserInfoSection";
import useAuthCheck from "@/hooks/useAuthCheck";
import PageLayout from "@/layout/PageLayout";
import React, { useEffect, useState, useCallback } from "react";

const MyPage: React.FC = () => {
  const { accessToken, user } = useAuthCheck();
  const [userData, setUserData] = useState<any>(null);
  const [userPersonaData, setUserPersonaData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isLoggedIn = useCallback(() => {
    return !!(accessToken && user?.isLoggedIn);
  }, [accessToken, user?.isLoggedIn]);

  const fetchUserData = useCallback(async () => {
    if (!accessToken) {
      console.log("accessToken이 없습니다");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const userDetailResponse = await getUserDetail(accessToken);
      console.log("사용자 상세 정보:", userDetailResponse);
      setUserData(userDetailResponse);

      const userPersonaResponse = await getUserPersonas(accessToken);
      console.log("사용자 페르소나 정보:", userPersonaResponse);
      setUserPersonaData(userPersonaResponse);
    } catch (err) {
      console.error("사용자 정보 조회 실패:", err);
      setError("사용자 정보를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handleProfileUpdate = useCallback(
    async (signal: string) => {
      if (signal === "refresh") {
        await fetchUserData();
      }
    },
    [fetchUserData],
  );

  if (!isLoggedIn()) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg text-gray-500">로그인이 필요합니다.</div>
      </div>
    );
  }

  if (!accessToken) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg text-gray-500">
          <Spinner />
          인증 정보를 확인하는 중...
        </div>
      </div>
    );
  }

  // 로딩 상태
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg text-gray-500">
          <Spinner />
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div>
      <PageLayout
        header={
          <SectionHeader
            title="나의 기록"
            description="내가 봤던 작품들과 리뷰 그리고 보고싶은 작품들까지 한눈에!"
          />
        }
        floatingBoxContent={
          <UserInfoSection
            nickname={userData?.nickname || user?.nickname || "사용자"}
            email={userData?.email || user?.email || "이메일 없음"}
            currentPersona={
              userPersonaData?.data.myPersonaName || "페르소나 없음"
            }
            profileImageUrl={userData?.data.profileImageUrl}
            personaImageUrl={userPersonaData?.data.mainPersonaImgPath}
            onProfileUpdate={handleProfileUpdate}
          />
        }
      >
        <PageContents
          accessToken={accessToken} // string 타입 보장됨
          user={user}
          isLoggedIn={isLoggedIn()}
        />
      </PageLayout>
    </div>
  );
};

export default MyPage;
