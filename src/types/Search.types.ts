interface Cast {
  actorName: string;
  characterName: string;
}

interface Crew {
  name: string;
  job: string;
}

interface SearchResult {
  id: string;
  title: string;
  overview: string;
  contentType: string;
  contentId: number;
  ratingAverage: number;
  releaseDate: string;
  posterPath: string;
  cast: Cast[];
  crew: Crew[];
}

//자동완성 옵션 타입(글자 입력시 그에 맞는 검색어 나오는 기능 ex:안녕을 입력하면 아래에 자동완성으로 안녕하세요가 나오는 그런 기능)
interface AutoResult {
  value: string;
  label: React.ReactNode;
  data?: SearchResult;
}

interface SearchBarProps<T = any> {
  placeholder?: string;
  onSearch: (value: string, results: T[]) => void;
  onSelect?: (value: string, option: AutoResult) => void;
  showSuggestions?: boolean;
  debounceTime?: number;
  maxSuggestions?: number;
  className?: string;
}

interface SearchContentsParams {
  keyword: string;
  actors?: string[];
  page?: number;
  size: number;
}

export type { SearchResult, AutoResult, SearchBarProps, SearchContentsParams };
