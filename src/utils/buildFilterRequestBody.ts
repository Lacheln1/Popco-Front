export const buildFilterRequestBody = ({
  basicInfo,
  usageEnv,
  personalization,
}: {
  basicInfo: { type?: string[]; genre?: string[]; rating?: [number, number] };
  usageEnv: { platform?: string[]; year?: [number, number] };
  personalization: {
    age?: [number, number];
    persona?: string[];
    algorithm?: string[];
  };
}) => {
  return {
    contentType: basicInfo.type?.[0] || null,
    genres: basicInfo.genre || [],
    minRating: basicInfo.rating?.[0] ?? 0,
    maxRating: basicInfo.rating?.[1] ?? 5,
    platforms: usageEnv.platform || [],
    minReleaseYear: usageEnv.year?.[0] ?? 1980,
    maxReleaseYear: usageEnv.year?.[1] ?? 2025,
    ageGroupFilter: personalization.age
      ? { ageRange: personalization.age }
      : {},
    personaFilter: (personalization.persona || []).reduce(
      (acc, cur) => {
        acc[cur] = true;
        return acc;
      },
      {} as Record<string, boolean>,
    ),
    popcorithmFilter: (personalization.algorithm || []).reduce(
      (acc, cur) => {
        acc[cur] = true;
        return acc;
      },
      {} as Record<string, boolean>,
    ),
  };
};
