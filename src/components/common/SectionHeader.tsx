interface SectionHeaderProps {
  title: string;
  description: string;
}
const SectionHeader = ({ title, description }: SectionHeaderProps) => {
  return (
    <section className="relative h-[250px] bg-[#172039] text-white sm:h-[350px] md:h-[400px] lg:h-[450px]">
      <section className="m-auto w-full px-4 pt-[100px] sm:w-[640px] sm:pt-[120px] md:w-[768px] md:pt-[160px] lg:w-[1024px] lg:pt-[200px] xl:w-[1200px]">
        <h2 className="gmarket-medium text-xl sm:text-2xl md:text-3xl lg:text-4xl">
          {title}
        </h2>
        <h5 className="gmarket-medium mt-2 text-sm sm:text-base md:text-lg lg:text-xl">
          {description}
        </h5>
      </section>
      <img
        className="absolute left-[2rem] top-[1rem] w-[80px] mix-blend-screen sm:left-[5rem] sm:top-[5rem] sm:w-[100px] md:left-[7rem] md:top-[10rem] md:w-[120px] lg:left-[7rem] lg:top-[12rem] lg:w-[150px]"
        src="/images/components/glossy_popcorn.png"
        alt="popcorn"
      />
      <img
        className="absolute left-[12rem] top-[1rem] w-[100px] mix-blend-screen sm:left-[25rem] sm:top-[2rem] sm:w-[100px] md:w-[130px] lg:left-[57%] lg:top-[2rem] lg:w-[160px]"
        src="/images/components/glossy_glass.png"
        alt="glass"
      />
      <img
        className="absolute right-[5rem] top-[10rem] w-[70px] mix-blend-screen sm:right-[10rem] sm:top-[12rem] sm:w-[70px] md:right-[20rem] md:top-[15rem] md:w-[100px] lg:right-[30rem] lg:top-[15rem] lg:w-[120px]"
        src="/images/components/glossy_slate.png"
        alt="slate"
      />
      <img
        className="absolute right-[1rem] top-[4rem] w-[80px] mix-blend-screen sm:right-[2rem] sm:top-[5rem] sm:w-[100px] md:right-[3rem] md:top-[6rem] md:w-[130px] lg:right-[5rem] lg:top-[6rem] lg:w-[160px]"
        src="/images/components/glossy_tv.png"
        alt="tv"
      />
    </section>
  );
};
export default SectionHeader;
