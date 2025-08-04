export const buildFilterRequestBody = ({
  basicInfo,
  usageEnv,
  personalization,
  userId, // 추가됨
}: {
  basicInfo: { type?: string[]; genre?: string[]; rating?: [number, number] };
  usageEnv: { platform?: string[]; year?: [number, number] };
  personalization: {
    age?: [number, number];
    persona?: string[]; // persona
    algorithm?: string[]; // popcorithm
  };
  userId?: number;
}) => {
  const [minAge, maxAge] = personalization.age ?? [0, 65];

  return {
    contentType: mapContentTypeToServer(basicInfo.type?.[0] || ""),
    genres: basicInfo.genre || [],
    minRating: basicInfo.rating?.[0] ?? 0,
    maxRating: basicInfo.rating?.[1] ?? 5,
    platforms: usageEnv.platform || [],
    minReleaseYear: usageEnv.year?.[0] ?? 1980,
    maxReleaseYear: usageEnv.year?.[1] ?? 2025,
    // API 명세 맞춰 변환
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

const mapContentTypeToServer = (type: string): "movie" | "tv" => {
  const map: Record<string, "movie" | "tv"> = {
    영화: "movie",
    "시리즈/드라마": "tv",
  };
  return map[type] ?? "movie";
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
