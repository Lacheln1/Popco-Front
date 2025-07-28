interface SectionHeaderProps {
  title: string;
  description: string;
}

const SectionHeader = ({ title, description }: SectionHeaderProps) => {
  return (
    <section className="bg-footerBlue relative h-[240px] text-white sm:h-[260px] md:h-[300px] lg:h-[340px]">
      <section className="m-auto w-full px-4 pt-[100px] sm:w-[640px] sm:pt-[90px] md:w-[768px] md:pt-[110px] lg:w-[1024px] lg:pt-[130px] xl:w-[1200px]">
        <h2 className="gmarket-medium ml-2 text-lg sm:text-xl md:text-2xl lg:text-3xl">
          {title}
        </h2>
        <h5 className="gmarket-medium ml-2 mt-2 text-sm sm:text-base md:text-lg">
          {description}
        </h5>
      </section>

      <img
        className="absolute left-[2rem] top-[1rem] w-[70px] mix-blend-screen sm:left-[5rem] sm:top-[3rem] sm:w-[90px] md:left-[7rem] md:top-[8rem] md:w-[110px] lg:left-[7rem] lg:top-[10rem] lg:w-[130px]"
        src="/images/components/glossy_popcorn.png"
        alt="popcorn"
      />
      <img
        className="absolute left-[12rem] top-[2rem] w-[80px] mix-blend-screen sm:left-[25rem] sm:top-[2rem] sm:w-[90px] md:w-[120px] lg:left-[57%] lg:top-[2rem] lg:w-[140px]"
        src="/images/components/glossy_glass.png"
        alt="glass"
      />
      <img
        className="absolute right-[5rem] top-[9rem] w-[60px] mix-blend-screen sm:right-[10rem] sm:top-[10rem] sm:w-[60px] md:right-[20rem] md:top-[12rem] md:w-[90px] lg:right-[30rem] lg:top-[12rem] lg:w-[110px]"
        src="/images/components/glossy_slate.png"
        alt="slate"
      />
      <img
        className="absolute right-[1rem] top-[4rem] w-[70px] mix-blend-screen sm:right-[2rem] sm:top-[5rem] sm:w-[90px] md:right-[3rem] md:top-[6rem] md:w-[120px] lg:right-[5rem] lg:top-[6rem] lg:w-[140px]"
        src="/images/components/glossy_tv.png"
        alt="tv"
      />
    </section>
  );
};

export default SectionHeader;
