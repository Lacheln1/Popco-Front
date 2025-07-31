import { useQuery } from "@tanstack/react-query";
import { PersonaRecommendation } from "@/types/Persona.types";
import { fetchHeroPersona } from "@/apis/personaApi";

export const useHeroPersona = (
  userId: number,
  token?: string,
  contentType: "movie" | "tv" | "all" = "all",
) => {
  return useQuery<
    {
      main_persona: string;
      recommendations: PersonaRecommendation[];
    },
    Error
  >({
    queryKey: ["heroPersona", userId, contentType],
    queryFn: () => fetchHeroPersona(userId, token, contentType),
    staleTime: 1000 * 60 * 60 * 6,
    gcTime: 1000 * 60 * 60 * 7,
    retry: 1,
    enabled: !!userId && !!token,
  });
};
