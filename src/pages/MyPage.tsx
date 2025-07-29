import SectionHeader from "@/components/common/SectionHeader";
import UserInfoSection from "@/components/MyPage/UserInfoSection";
import PageLayout from "@/layout/PageLayout";
import React from "react";

const MyPage: React.FC = () => {
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
            nickname="레헬"
            email="psionict@naver.com"
            currentPersona="응애 시네파 울보"
          />
        }
      >
        <div>칠드런영역임</div>
      </PageLayout>
    </div>
  );
};

export default MyPage;
