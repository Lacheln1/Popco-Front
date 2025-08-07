const PosterBackground = () => {
  return (
    <div
      className="relative mx-auto min-h-[330px] w-full"
      style={{
        backgroundRepeat: "no-repeat",
        backgroundImage:
          "linear-gradient(352deg, transparent 45.2%, #bbb 45.5%, #bbb 45.6%, #ccc 45.8%, #eee 60%)," +
          "linear-gradient(30deg, #ccc, #eee 90%)",
        backgroundSize: "100% 32.4em",
        backgroundPosition: "50% 108%",
      }}
    >
      <img
        className="absolute left-1/2 top-[10%] w-32 -translate-x-1/2 -translate-y-1/4"
        src="images/popco/time-popco.png"
        alt="popco"
      />
    </div>
  );
};

export default PosterBackground;
