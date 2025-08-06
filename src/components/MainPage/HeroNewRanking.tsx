import { useContentReaction } from "@/hooks/queries/contents/useContentReaction";
import { useContentsRanking } from "@/hooks/queries/contents/useContentsRanking";
import { ContentCategory, ReactionType } from "@/types/Contents.types";
import { Dropdown, MenuProps } from "antd";
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Spinner from "../common/Spinner";
import { TMDB_IMAGE_BASE_URL } from "@/constants/contents";
import { DownOutlined } from "@ant-design/icons";

interface HeroRankingProps {
  onTop1Change: (type: ContentCategory, title: string) => void;
  accessToken: string;
  userId: number;
  type: ContentCategory;
}

const HeroNewRanking = ({
  accessToken,
  userId,
  type,
  onTop1Change,
}: HeroRankingProps) => {
  const [expandedIndex, setExpandedIndex] = useState<number>(0);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [selected, setSelected] = useState<ContentCategory>(type);
  const navigate = useNavigate();

  const categoryMap = {
    all: "전체",
    tv: "시리즈",
    movie: "영화",
  } as const;

  const items: MenuProps["items"] = Object.entries(categoryMap).map(
    ([key, label]) => ({
      key,
      label,
    }),
  );
  const { data = [], isLoading } = useContentsRanking(
    selected,
    accessToken,
    userId,
  );

  useEffect(() => {
    if (!isHovered) {
      const interval = setInterval(() => {
        setExpandedIndex((prev) => (prev + 1) % data.length);
      }, 4000);

      return () => clearInterval(interval);
    }
  }, [isHovered, data.length]);

  useEffect(() => {
    if (data && data.length > 0) {
      onTop1Change(selected, data[0].title);
    }
  }, [data, selected, onTop1Change]);

  if (isLoading || !data?.length) return <Spinner />;

  if (!Array.isArray(data)) {
    console.error("HeroRanking Error", data);
    return <div>데이터가 없습니다.</div>;
  }

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
    <div className="relative mt-40 flex flex-col items-center justify-center overflow-hidden px-3 md:px-6">
      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-[1200px]">
        {/* Heading */}
        <div className="mb-8 text-center">
          <h1 className="gmarket relative text-6xl font-bold text-white md:text-4xl lg:text-5xl">
            POPCO Top 5
            <Dropdown
              menu={{
                items,
                onClick: ({ key }) => setSelected(key as ContentCategory),
              }}
              placement="bottomLeft"
              arrow
              className="absolute bottom-0 right-0"
            >
              <button className="inline-flex items-center rounded-md bg-[#ffffff9c] px-3 py-1 text-sm sm:text-xl">
                {categoryMap[selected]}{" "}
                <DownOutlined className="ml-1 text-lg" />
              </button>
            </Dropdown>
          </h1>
        </div>

        {/* Carousel Container */}
        <div className="w-full overflow-hidden">
          <div
            className="relative h-96 w-full md:h-[700px]"
            onMouseEnter={handleContainerMouseEnter}
            onMouseLeave={handleContainerMouseLeave}
          >
            <div className="absolute inset-0 flex">
              <div className="z-50 mr-4 hidden h-full w-64 flex-shrink-0 rounded-lg bg-black sm:block">
                <div className="info_container_inner flex h-full flex-col p-6">
                  {/* Number Image */}
                  <div
                    className="flex items-center justify-center"
                    style={{ height: "60%" }}
                  >
                    <div className="rounded-lg bg-gray-800 p-6 text-9xl font-bold text-white shadow-2xl"></div>
                  </div>

                  {/* Info Text */}
                  <div className="flex flex-1 flex-col justify-center px-4 text-center">
                    <div
                      className="mb-4 text-xl font-semibold leading-relaxed text-white"
                      style={{ color: "rgba(255,255,255,.9)" }}
                    >
                      Watched for{" "}
                      <strong className="mt-2 block text-2xl font-extrabold"></strong>
                      this week.
                      <a
                        href="#"
                        className="mt-4 block text-lg font-light transition-colors duration-200 hover:text-white"
                        style={{
                          color: "rgba(229,9,20,.9)",
                          fontWeight: "300",
                        }}
                      >
                        Watch now
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-1">
                {data.map((movie, index) => (
                  <div
                    key={movie.contentId}
                    className={`relative h-full cursor-pointer transition-all duration-300 ${
                      expandedIndex === index ? "flex-[3] pl-64" : "flex-1"
                    } `}
                    style={{ zIndex: data.length - index }}
                    onClick={() => handleItemClick(index)}
                    onMouseEnter={() => handleItemMouseEnter(index)}
                  >
                    {/* 미니 랭킹 */}
                    <div
                      className={`absolute right-4 top-4 z-50 transition-opacity duration-300 ${
                        expandedIndex === index ? "md:opacity-0" : "opacity-90"
                      }`}
                    >
                      <span
                        className="text-5xl font-bold text-white md:text-2xl md:text-3xl"
                        style={{ textShadow: "0px 0px 4px black" }}
                      >
                        {index + 1}
                      </span>
                    </div>
                    {/* 포스터 */}
                    <div
                      className="absolute left-0 top-0 h-full w-full overflow-hidden"
                      style={{
                        background: "linear-gradient(0deg, transparent, #000)",
                        boxShadow: "0 0 10px 5px rgb(0 0 0 / 70%)",
                      }}
                    >
                      <img
                        src={`${TMDB_IMAGE_BASE_URL}${movie.posterPath}`}
                        alt={movie.title}
                        className={`h-full w-full object-cover transition-opacity duration-300 ${
                          expandedIndex === index ? "opacity-100" : "opacity-40"
                        } `}
                      />
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
                            expandedIndex === index
                              ? "opacity-100"
                              : "opacity-0"
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
    </div>
  );
};

export default HeroNewRanking;
