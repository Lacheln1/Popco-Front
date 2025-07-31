// contentPosters 배열 내부 객체의 타입
interface ContentPoster {
  contentId: number;
  contentType: string;
  posterPath: string;
  title: string;
}

// API 응답 데이터 전체를 포함하는 타입
export interface Collection {
  collectionId: number;
  userId: number;
  userNickname: string;
  title: string;
  description: string;
  saveCount: number;
  contentCount: number;
  createdAt: string;
  updatedAt: string;
  contentPosters: ContentPoster[];
  isSaved: boolean; 
}
