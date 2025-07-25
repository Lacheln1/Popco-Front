export interface ContentItem {
  contentId: number;
  type: "all" | "movie" | "tv";
  rank: number;
  title: string;
  overview: string;
  posterPath: string;
  reviewRatingAvg: number | null;
  genres: string;
}

export type ContentCategory = "all" | "movie" | "tv";
