import React from "react";

const resize = [0.895, 0.925, 0.96, 0.99];
const translate = [
  "scaleY(0.94) translate(-26.6em, -6.2em)",
  "scaleY(0.965) translate(-17em, -4.2em)",
  "scaleY(0.98) translate(-8em, -2.1em)",
  "",
];
const marginLeft = ["35.2em", "10em", "-15.3em", "-40.4em"];
const backgroundPosition = [".8em 0", ".6em 0", ".4em 0", ".1em 0"];

const getShadowStyle = (idx: number): React.CSSProperties => ({
  backgroundRepeat: "no-repeat",
  backgroundImage:
    "linear-gradient(120deg, transparent 42%, rgba(0,0,0,0.15) 45%, rgba(0,0,0,0.35) 65%)," +
    "linear-gradient(20deg, transparent 38%, rgba(0,0,0,0.25) 45%, rgba(0,0,0,0.23) 55%, rgba(0,0,0,0.13) 75%)," +
    "radial-gradient(ellipse at 50% 100%, rgba(0,0,0,0.15) 3%, transparent 40%)",
  transform: "rotate(-8deg)",
  backgroundSize: `100% ${82 + idx}%, 100% ${18 - idx}%, 100% 10%`,
  backgroundPosition: `${backgroundPosition[idx]}, 0 100%, -3em ${80 + idx}%`,
});

const getImageStyle = (idx: number): React.CSSProperties => ({
  borderImage: "linear-gradient(105deg, transparent .5%, #aaa .7%) 1",
  transform: `perspective(20em) rotateY(1deg) rotateZ(-5deg) skewY(-2deg) skewX(-1deg) scaleX(${resize[idx]})`,
});

const getHighlightStyle = (idx: number): React.CSSProperties => ({
  backgroundImage:
    "linear-gradient(45deg, rgba(0,0,0,0.3), transparent 70%)," +
    "linear-gradient(45deg, rgba(255,255,255,0) 60%, rgba(255,255,255,0.3) 80%)",
  transform: `perspective(20em) rotateY(1deg) rotateZ(-5deg) skewY(-2deg) skewX(-1deg) scaleX(${resize[idx]})`,
});

export const PosterImage = ({
  idx,
  image,
}: {
  idx: number;
  image: { src: string; alt: string };
}) => (
  <div
    key={idx}
    className="absolute bottom-[4.8em] left-[54%] z-0 flex w-[250px] justify-end"
    style={{
      marginLeft: marginLeft[idx],
      transform: translate[idx] || undefined,
    }}
  >
    <div
      className="absolute left-0 top-[7%] z-[1] h-full w-[60%]"
      style={getShadowStyle(idx)}
    />
    <img
      src={image.src}
      alt={image.alt}
      className="relative z-[2] block h-full w-[60%] border-l-[0.2em] shadow-[0.1em_0.2em_0_-0.1em_#666] saturate-[90%]"
      style={getImageStyle(idx)}
    />
    <div
      className="absolute z-[3] h-full w-[60%]"
      style={getHighlightStyle(idx)}
    />
  </div>
);
