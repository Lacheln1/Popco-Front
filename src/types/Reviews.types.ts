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
  accessToken?: string;
  refetchMyReview?: () => void;
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
