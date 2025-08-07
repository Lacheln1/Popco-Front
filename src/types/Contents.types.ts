export interface ContentItem {
  contentId: number;
  type: "all" | "movie" | "tv";
  rank: number;
  title: string;
  overview: string;
  posterPath: string;
  reviewRatingAvg: number | null;
  genres: string;
  userReaction: "LIKE" | "DISLIKE" | "NEUTRAL";
}

export type ContentCategory = "all" | "movie" | "tv";

// AllContentItem에 userLiked, userDisliked 필드 추가
export interface AllContentItem {
  id: number;
  type: ContentCategory;
  title: string;
  releaseDate: string;
  posterPath: string;
  userLiked?: boolean; // 추가
  userDisliked?: boolean; // 추가
}

// FetchAllContentsParams에 userId, accessToken 추가
export interface FetchAllContentsParams {
  page?: number;
  size?: number;
  sort?: string;
  userId?: number; // 추가
  accessToken?: string; // 추가
}

export interface FetchAllContentsResponse {
  contents: AllContentItem[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  first: boolean;
  last: boolean;
}

// 상세 페이지 API 응답 데이터 타입에 userReaction 추가
export interface ContentsDetail {
  id: number;
  type: "movie" | "tv";
  title: string;
  overview: string;
  ratingAverage: number;
  releaseDate: string;
  ratingCount: number;
  backdropPath: string;
  posterPath: string;
  runtime: number | null;
  genres: Genre[];
  casts: Cast[];
  crews: Crew[];
  videos: any[]; // 필요시 video 상세 타입 정의
  watchProviders: WatchProvider[];
  userReaction?: "LIKE" | "DISLIKE" | "NEUTRAL"; // 추가
}

export interface Genre {
  id: number;
  name: string;
}

export interface Cast {
  actorId: number;
  actorName: string;
  profilePath: string | null;
  characterName: string;
  castOrder: number;
}

export interface Crew {
  crewMemberId: number;
  name: string;
  profilePath: string | null;
  job: string;
  knownForDepartment: string;
}

export interface WatchProvider {
  providerId: number;
  name: string;
  logoPath: string | null;
  link: string | null;
}

export type ReactionType = "LIKE" | "DISLIKE" | "NEUTRAL";
