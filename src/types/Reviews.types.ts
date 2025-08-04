export type ReviewModalProps = {
  isModalOpen: boolean;
  setIsModalOpen: (val: boolean) => void;
  isAuthor: boolean;
  isWriting: boolean;
  contentsTitle: string;
  contentsImg: string;
  popcorn?: number;
  reviewDetail?: string;
  author?: string;
  likeCount?: number;
  isLiked?: boolean;
  token?: string;
  refetchMyReview?: () => void;
  reviewId: number;
};

export type ReviewProps = {
  reviewId: number;
  reviewText: string;
  score: number;
  status: "COMMON" | "SPOILER" | "BLIND";
  likeCount: number;
  userId: number;
  userNickname: string;
  contentId: number;
  contentType: string;
  contentTitle: string;
  ranking: number;
};

export interface MyReview {
  reviewId: number;
  contentId: number;
  contentType: string;
  title: string;
  posterPath: string;
  score: number;
  text: string;
  createdAt: string;
  likeCount: number;
}

export interface MyReviewResponse {
  code: number;
  result: string;
  message: string;
  data: {
    existUserReview: boolean;
    myReview: MyReview | null;
    login: boolean;
  };
}

// --- 신고 관련 타입 ---
export interface DeclarationPostRequest {
  declarationType: string;
  content: string;
}

export interface DeclarationType {
  code: string;
  description: string;
}

// ReviewCard가 사용할 표준 데이터 타입
export interface ReviewCardData {
  reviewId: number;
  contentId: number;
  contentType: string;
  contentTitle: string;
  score: number;
  reviewText: string;
  isSpoiler: boolean;
  likeCount: number;
  isLiked: boolean;
  isOwnReview: boolean;
  hasAlreadyReported: boolean;
  authorNickname: string;
  reviewDate?: string;
  posterPath?: string; // 포스터 이미지 경로 추가
}

// 상세 페이지 API 응답 타입
export interface ContentReview {
  reviewId: number;
  reviewerId: number;
  reviewerName: string;
  reviewerProfile: string;
  reviewDate: string;
  status: "COMMON" | "SPOILER" | "BLIND";
  score: number;
  text: string;
  likeCount: number;
  isLiked: boolean;
  isAuthor: boolean;
  isDeclaration: boolean;
}

// --- 리뷰 목록 API의 전체 응답 데이터 타입 ---
export interface PaginatedReviewsData {
  page: number;
  size: number;
  totalPages: number;
  totalReviews: number;
  reviewAvgScore: number;
  reviewList: ContentReview[];
  isLogin: boolean;
}

// API의 가장 바깥쪽 구조를 포함한 타입
export interface PaginatedReviewsResponse {
  code: number;
  result: string;
  message: string;
  data: PaginatedReviewsData;
}

// AI 리뷰 요약 데이터 타입
export interface ReviewSummary {
  hasSummary: boolean;
  summary: string;
  evaluationType: string | null;
}

// AI 리뷰 요약 API 전체 응답 타입
export interface ReviewSummaryResponse {
  code: number;
  result: string;
  message: string;
  data: ReviewSummary;
}
