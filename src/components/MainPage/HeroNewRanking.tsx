import React, { useState, useEffect } from "react";

interface MovieData {
  id: number;
  title: string;
  hours: string;
  image: string;
  numberImage: string;
}

const HeroNewRanking: React.FC = () => {
  const [expandedIndex, setExpandedIndex] = useState<number>(0);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const movies: MovieData[] = [
    {
      id: 1,
      title: "Red Notice",
      hours: "148.72 million hours",
      image:
        "https://assets.codepen.io/1890963/AAAABeyXW3mUTPqrK4NtKn2vJlcYmKVJU5XCn6Zeis_EdNEjMmhs5rRudqWRYo2Pj7R2_pYwHviXeOrP1GKgaC4flMu_QndVSRQ8Fk-B_al3ZGz5JOXyZ28ZK7I49UdxrQ.jpg?format=auto",
      numberImage: "https://assets.codepen.io/1890963/1.png?format=auto",
    },
    {
      id: 2,
      title: "Love Hard",
      hours: "58.56 million hours",
      image:
        "https://assets.codepen.io/1890963/AAAABSlWYPUcQisKQat0S8WDXkwPjfU4yEbFT4eDXJLnL5noLRdZCre_pm3Amq11WKXU9hC3VciJLwAWf8z0nsI-rTlRTnAkpeo5iBLhbO-SMpRM0NUXzVQsllo89bYFzg.jpg?format=auto",
      numberImage: "https://assets.codepen.io/1890963/2.png?format=auto",
    },
    {
      id: 3,
      title: "The Harder They Fall",
      hours: "33.03 million hours",
      image:
        "https://assets.codepen.io/1890963/AAAABdSTtEWX51HK0gQNLxoNCEHAdcJDUj-IUIqc0Ho4FheR3nlfyIxSRtFNWx7X9y3HAM5JsrwNSqE__YY0-EHwDMhBiwLgrbnDLx-KLlbWUtogt9K9ThtthZeMJsFBXQA.jpg?format=auto",
      numberImage: "https://assets.codepen.io/1890963/3.png?format=auto",
    },
    {
      id: 4,
      title: "Army of Thieves",
      hours: "20.56 million hours",
      image:
        "https://assets.codepen.io/1890963/AAAABSd4YiRI4akxOnkCqC2Aqn8MrtGgluXvN3vbSakGx2ejrClryI0hkNYjoqRt2Owl0ySiE4-sNKiq7o6nAg7gRhD8hYGcCoPqChvTygrWfaKR7bKld5zsLWQ6kxlZaQ.jpg",
      numberImage: "https://assets.codepen.io/1890963/4.png?format=auto",
    },
    {
      id: 5,
      title: "Father Christmas is Back",
      hours: "13.78 million hours",
      image:
        "https://assets.codepen.io/1890963/AAAABVxH2_5AGGX3jcwy6y0rbYzHvWkzJQY0EiWpFvdrhg5x4wPfU4Xl472rNUrRzqjcpqOUNvdyKLcDlG1pPa8v804Dtb2bDzqZes2_AntdOElfr7FKsl6xV9nw5YMSdA.jpg?format=auto",
      numberImage: "https://assets.codepen.io/1890963/5.png?format=auto",
    },
  ];

  //   useEffect(() => {
  //     if (!isHovered) {
  //       const interval = setInterval(() => {
  //         setExpandedIndex((prev) => (prev + 1) % movies.length);
  //       }, 4000);

  //       return () => clearInterval(interval);
  //     }
  //   }, [isHovered, movies.length]);

  const handleItemClick = (index: number) => {
    setExpandedIndex(index);
  };

  const handleItemMouseEnter = (index: number) => {
    if (expandedIndex !== index) {
      setIsHovered(true);
    }
  };

  const handleContainerMouseEnter = () => {
    setIsHovered(true);
  };

  const handleContainerMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-black">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgb(0, 0, 0) 0px, rgba(0, 0, 0, 0) 20%, rgba(0, 0, 0, 0) calc(80%), rgb(0, 0, 0) 100%), url(https://assets.codepen.io/1890963/bg-1--300%402x.4b7178145e2885f8467a7357e2d15971_1.jpg?format=auto)`,
        }}
      />

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-7xl">
        {/* Heading */}
        <div className="mb-8 text-center">
          <h1 className="gmarket text-6xl font-bold text-white md:text-6xl lg:text-7xl">
            POPCO Top 5
          </h1>
        </div>

        {/* Carousel Container */}
        <div className="w-full overflow-hidden">
          <div
            className="relative h-96 w-full md:h-[500px]"
            onMouseEnter={handleContainerMouseEnter}
            onMouseLeave={handleContainerMouseLeave}
          >
            <div className="absolute inset-0 flex">
              {movies.map((movie, index) => (
                <div
                  key={movie.id}
                  className={`relative h-full cursor-pointer transition-all duration-300 ${
                    expandedIndex === index ? "flex-[3] pl-64" : "flex-1"
                  } `}
                  style={{ zIndex: movies.length - index }}
                  onClick={() => handleItemClick(index)}
                  onMouseEnter={() => handleItemMouseEnter(index)}
                >
                  {/* Item Number with Dark Background */}
                  <div
                    className={`absolute right-4 top-4 z-50 transition-opacity duration-300 ${
                      expandedIndex === index ? "opacity-0" : "opacity-90"
                    }`}
                  >
                    <div className="rounded-lg bg-black bg-opacity-80 px-3 py-2 backdrop-blur-sm">
                      <span
                        className="text-2xl font-bold text-white md:text-3xl"
                        style={{ textShadow: "0px 0px 4px black" }}
                      >
                        {movie.id}
                      </span>
                    </div>
                  </div>

                  {/* Info Container (for expanded item) */}
                  {expandedIndex === index && (
                    <div className="absolute left-0 top-0 z-40 -ml-64 h-full w-64">
                      <div className="flex h-full flex-col">
                        {/* Number Image */}
                        <div className="flex flex-[2] items-start justify-center pt-8">
                          <img
                            src={movie.numberImage}
                            alt={`${movie.id}`}
                            className="h-auto max-w-full object-cover"
                          />
                        </div>

                        {/* Info Text */}
                        <div className="absolute bottom-8 left-0 w-full px-8 text-center">
                          <div className="text-xl font-semibold leading-relaxed text-white md:text-2xl">
                            Watched for{" "}
                            <strong className="font-extrabold">
                              {movie.hours}
                            </strong>{" "}
                            this week.
                            <a
                              href="#"
                              className="mt-3 block text-lg font-light text-red-600 transition-colors duration-200 hover:text-white md:text-xl"
                            >
                              Watch now
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Main Image */}
                  <div
                    className="absolute left-0 top-0 h-full w-full overflow-hidden"
                    style={{
                      background: "linear-gradient(0deg, transparent, #000)",
                      boxShadow: "0 0 10px 5px rgb(0 0 0 / 70%)",
                    }}
                  >
                    <img
                      src={movie.image}
                      alt={movie.title}
                      className={`h-full w-full object-cover transition-opacity duration-300 ${
                        expandedIndex === index ? "opacity-100" : "opacity-40"
                      } `}
                    />

                    {/* Bottom Title */}
                    <div
                      className="absolute bottom-0 left-0 w-full py-6 text-center"
                      style={{
                        backgroundImage:
                          "linear-gradient(transparent 0px, rgba(0, 0, 0, 0.8) 100%)",
                        textShadow: "black 0px 0px 4px, black 0px 0px 15px",
                      }}
                    >
                      <div
                        className={`text-base font-bold uppercase tracking-wider text-white transition-opacity duration-300 md:text-lg ${
                          expandedIndex === index ? "opacity-100" : "opacity-0"
                        } `}
                      >
                        {movie.title}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroNewRanking;
