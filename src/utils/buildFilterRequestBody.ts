import { PERSONA_NAME_TO_ID } from "@/constants/persona";

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
    body.platform = usageEnv.platform;
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
  const mapPersonaToId = (name: string): number => {
    return PERSONA_NAME_TO_ID[name] ?? 0;
  };

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
