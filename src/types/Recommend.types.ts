export interface RecommendationItem {
  content_id: number;
  type: "movie" | "tv";
  title: string;
  score: number;
  poster_path: string;
  genres: string[];
  main_actors: string[];
  directors: string[];
}

export interface PopcorithmResponse {
  user_id: number;
  recommendations: RecommendationItem[];
}
