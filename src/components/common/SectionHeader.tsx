interface SectionHeaderProps {
  title: string;
  description: string;
}

const SectionHeader = ({ title, description }: SectionHeaderProps) => {
  return (
    <header className="h-[450px] bg-[#172039] text-white relative">
      <section
        className="
      w-full px-4
      sm:w-[640px]
      md:w-[768px]
      lg:w-[1024px]
      xl:w-[1200px]
      m-auto pt-[120px] sm:pt-[150px] md:pt-[180px] lg:pt-[200px]
    "
      >
        <h2 className="gmarket-medium text-xl sm:text-2xl md:text-3xl lg:text-4xl">
          {title}
        </h2>
        <h5 className="gmarket-medium mt-2 text-sm sm:text-base md:text-lg lg:text-xl">
          {description}
        </h5>
      </section>

      <img
        className="
      mix-blend-screen absolute
      top-[6rem] left-[2rem]
      md:top-[10rem] md:left-[5rem]
      lg:top-[12rem] lg:left-[7rem]
    "
        src="/images/components/glossy_popcorn.png"
        alt="glass"
      />
      <img
        className="
      mix-blend-screen absolute
      top-[1rem] left-[20rem]
      md:top-[2rem] md:left-[40rem]
      lg:top-[2rem] lg:left-[60rem]
    "
        src="/images/components/glossy_glass.png"
        alt="glass"
      />
      <img
        className="
      mix-blend-screen absolute
      top-[12rem] right-[10rem]
      md:top-[15rem] md:right-[20rem]
      lg:top-[15rem] lg:right-[30rem]
    "
        src="/images/components/glossy_slate.png"
        alt="glass"
      />
      <img
        className="
      mix-blend-screen absolute
      top-[4rem] right-[2rem]
      md:top-[5rem] md:right-[3rem]
      lg:top-[6rem] lg:right-[5rem]
    "
        src="/images/components/glossy_tv.png"
        alt="glass"
      />
    </header>
  );
};

export default SectionHeader;
