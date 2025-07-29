export interface CollectionBase {
  collectionId: number;
  title: string;
  posters: string[];
  href: string;
}

export interface CollectionProps {
  collectionId: number;
  userId: number;
  userNickname: string;
  title: string;
  description: string;
  saveCount: number;
  contentCount: number;
  createdAt: string;
  updatedAt: string;
  contentPosters: {
    contentId: number;
    contentType: string;
    posterPath: string;
    title: string;
  }[];
  isMarked: boolean;
}

export interface CollectionResponse {
  data: CollectionProps[];
}

export interface HotCollections {
  collectionId: number;
  title: string;
  posters: string[];
  href: string;
  saveCount: number;
}
