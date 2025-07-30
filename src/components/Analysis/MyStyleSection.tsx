import React from "react";
interface MyStyleSectionProps {
  myPersonaTags: string;
  myPersonaDescription: string;
  myPersonaGenres: string[];
}

const MyStyleSection: React.FC<MyStyleSectionProps> = ({
  myPersonaTags,
  myPersonaDescription,
  myPersonaGenres,
}) => {
  return (
    <section className="pretendard flex justify-center px-3 md:px-8">
      <div
        className="mx-1 flex w-full max-w-[1200px] flex-col bg-slate-50 py-5"
        style={{ boxShadow: "0 0px 10px rgba(0, 0, 0, 0.1)" }}
      >
        <div className="flex flex-col text-center text-base md:text-2xl lg:text-2xl">
          <span className="gmarket-medium">내 OTT 시청 스타일은</span>
          <span className="">{myPersonaTags}</span>
        </div>
        <div className="flex w-full justify-center gap-6 pt-4 md:text-xl">
          {myPersonaGenres.map((data) => (
            <div
              key={data}
              className="bg-popco-main flex h-8 w-16 items-center justify-center rounded-lg md:w-24 lg:h-10 lg:w-28"
            >
              #{data}
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-center break-keep px-1 text-center">
          <span className="break-keep md:text-xl">{myPersonaDescription}</span>
        </div>
      </div>
    </section>
  );
};

export default MyStyleSection;
