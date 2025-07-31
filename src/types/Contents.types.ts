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

export interface AllContentItem {
  id: number;
  type: ContentCategory;
  title: string;
  releaseDate: string;
  posterPath: string;
}

export interface FetchAllContentsParams {
  pageNumber?: number;
  pageSize?: number;
  sort?: string;
}

export interface GetAllContentsResponse {
  code: number;
  result: "SUCCESS" | "FAILURE" | string;
  message: string;
  data: {
    contents: ContentItem[];
  };
}
