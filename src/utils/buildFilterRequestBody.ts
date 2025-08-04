export const buildFilterRequestBody = ({
  basicInfo,
  usageEnv,
  personalization,
  userId,
}: {
  basicInfo: { type?: string; genre?: string[]; rating?: [number, number] };
  usageEnv: { platform?: string[]; year?: [number, number] };
  personalization: {
    age?: [number, number];
    persona?: string[];
    algorithm?: string[];
  };
  userId?: number;
}) => {
  const [minAge, maxAge] = personalization.age ?? [0, 65];

  return {
    ...(basicInfo.type ? { contentType: basicInfo.type } : {}),
    genres: basicInfo.genre || [],
    minRating: basicInfo.rating?.[0] ?? 0,
    maxRating: basicInfo.rating?.[1] ?? 5,
    platforms: usageEnv.platform || [],
    minReleaseYear: usageEnv.year?.[0] ?? 1980,
    maxReleaseYear: usageEnv.year?.[1] ?? 2025,

    ageGroupFilter: {
      minAge,
      maxAge,
      limit: 100,
    },
    personaFilter:
      personalization.persona && personalization.persona.length > 0
        ? {
            personaId: mapPersonaToId(personalization.persona[0]),
            limit: 50,
          }
        : {},
    popcorithmFilter:
      personalization.algorithm && personalization.algorithm.length > 0
        ? {
            userId: userId ?? 0,
            limit: 70,
          }
        : {},
  };
};

const mapPersonaToId = (name: string): number => {
  const map: Record<string, number> = {
    액션헌터: 1,
    무비셜록: 2,
    시네파울보: 3,
    온기수집가: 4,
    이세계유랑자: 5,
    무서워도본다맨: 6,
    레트로캡틴: 7,
  };
  return map[name] ?? 0;
};
