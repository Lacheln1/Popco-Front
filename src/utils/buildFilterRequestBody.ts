export const buildFilterRequestBody = ({
  basicInfo,
  usageEnv,
  personalization,
  userId,
}: {
  basicInfo: {
    type?: string;
    genre?: string[];
    rating?: [number, number] | null;
  };
  usageEnv: { platform?: string[]; year?: [number, number] | null };
  personalization: {
    age?: [number, number] | null;
    persona?: string[];
    algorithm?: string[];
  };
  userId?: number;
}) => {
  const body: any = {};

  // 기본 정보
  if (basicInfo.type) {
    body.contentType = basicInfo.type;
  }

  // 장르는 빈 배열이 아닐 때만 포함
  if (basicInfo.genre && basicInfo.genre.length > 0) {
    body.genres = basicInfo.genre;
  }

  // rating이 null이 아닐 때만 포함
  if (basicInfo.rating && Array.isArray(basicInfo.rating)) {
    body.minRating = basicInfo.rating[0];
    body.maxRating = basicInfo.rating[1];
  }

  // 플랫폼은 빈 배열이 아닐 때만 포함
  if (usageEnv.platform && usageEnv.platform.length > 0) {
    body.platforms = usageEnv.platform;
  }

  // year가 null이 아닐 때만 포함
  if (usageEnv.year && Array.isArray(usageEnv.year)) {
    body.minReleaseYear = usageEnv.year[0];
    body.maxReleaseYear = usageEnv.year[1];
  }

  // age가 null이 아닐 때만 포함
  if (personalization.age && Array.isArray(personalization.age)) {
    const [minAge, maxAge] = personalization.age;
    body.ageGroupFilter = {
      minAge,
      maxAge,
      limit: 100,
    };
  }

  // persona가 있을 때만 포함
  if (personalization.persona && personalization.persona.length > 0) {
    body.personaFilter = {
      personaId: mapPersonaToId(personalization.persona[0]),
      limit: 50,
    };
  }

  // algorithm이 있을 때만 포함
  if (personalization.algorithm && personalization.algorithm.length > 0) {
    body.popcorithmFilter = {
      userId: userId ?? 0,
      limit: 70,
    };
  }

  return body;
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
