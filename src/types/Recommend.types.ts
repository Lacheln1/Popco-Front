import { ContentCategory } from "./Contents.types";

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

export interface ContentBasedItem {
  content_id: number;
  content_type: ContentCategory;
  title: string;
  poster_path: string;
  user_reaction: "LIKE" | "DISLIKE" | null;
}

export interface ContentBasedResponse {
  recommendations: ContentBasedItem[];
}
