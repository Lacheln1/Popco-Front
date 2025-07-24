export const formatRatingTag = ([min, max]: [number, number]) =>
  `${min} ~ ${max}점`;

export const formatYearTag = ([min, max]: [number, number]) =>
  `${min} ~ ${max}년`;

export const formatAgeTag = ([min, max]: [number, number]) =>
  `${min} ~ ${max}살`;

export const parseRatingFromTag = (
  tag: string,
): [number, number] | undefined => {
  const match = tag.match(/([\\d.]+) ~ ([\\d.]+)점/);
  if (!match) return undefined;
  return [parseFloat(match[1]), parseFloat(match[2])];
};
