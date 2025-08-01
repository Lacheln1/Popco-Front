import { ContentCategory } from "./Contents.types";

export interface RecommendationItem {
  content_id: number;
  type: ContentCategory;
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
  user_reaction: "LIKE" | "DISLIKE" | "NEUTRAL";
}

export interface ContentBasedResponse {
  recommendations: ContentBasedItem[];
}

export interface ContentFeedbackItem {
  contentId: number;
  title: string;
  genres: string[];
  type: string;
  poster_path: string;
  predicted_rating: number;
  persona_genre_match: boolean;
}

export interface ContentFeedbackResponse {
  message: string;
  recommendations: ContentFeedbackItem[];
  main_persona: string;
  sub_persona: string;
  all_personas_scores: {
    [key: string]: number;
  };
}
