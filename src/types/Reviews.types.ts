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
