import React from "react";

interface PageLayoutProps {
  header: React.ReactNode;
  floatingBoxContent: React.ReactNode;
  children: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({
  header,
  floatingBoxContent,
  children,
}) => {
  return (
    <div>
      {/* 섹션헤더 */}
      {header}
      {/* 플로팅박스 */}
      <section className="relative z-10 mx-auto mt-[-55px] w-[90vw] max-w-[1200px] md:mt-[-100px]">
        <div className="rounded-2xl bg-zinc-50 pb-4 pt-4 shadow-[0px_4px_10px_#0000001a] sm:pb-12 sm:pt-4">
          {floatingBoxContent}
        </div>
      </section>
      {/* 1200px안에 들어가는 메인콘텐츠 */}
      <section className="mx-auto mt-16 w-full max-w-[1200px] px-4">
        {children}
      </section>
    </div>
  );
};

export default PageLayout;
