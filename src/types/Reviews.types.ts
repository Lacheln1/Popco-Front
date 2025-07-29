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
