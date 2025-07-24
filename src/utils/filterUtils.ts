// utils/filterUtils.ts
export const formatRatingTag = ([min, max]: [number, number]) =>
  `팝콘 별점: ${min} ~ ${max}점`;

export const parseRatingFromTag = (
  tag: string,
): [number, number] | undefined => {
  const match = tag.match(/([\\d.]+) ~ ([\\d.]+)점/);
  if (!match) return undefined;
  return [parseFloat(match[1]), parseFloat(match[2])];
};
