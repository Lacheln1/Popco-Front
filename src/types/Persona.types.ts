export interface PersonaRecommendation {
  contentId: number;
  title: string;
  genres: string[];
  type: "movie" | "tv";
  poster_path: string;
  predicted_rating: number;
  persona_genre_match: boolean;
}

export interface PersonaResponse {
  message: string;
  recommendations: PersonaRecommendation[];
  main_persona: string;
  sub_persona: string;
  all_personas_scores: Record<string, number>;
}
