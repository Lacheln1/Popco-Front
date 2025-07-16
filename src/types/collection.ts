export interface CollectionBase {
  collectionId: number;
  title: string;
  posters: string[];
  isInitiallySaved: boolean;
  href: string;
  onSaveToggle?: (collectionId: number, isSaved: boolean) => void;
}
