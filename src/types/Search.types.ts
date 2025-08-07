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

export interface SearchResponse {
  content: SearchResult[];
  last: boolean;
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
  sort?: any;
  first?: boolean;
  empty?: boolean;
  numberOfElements?: number;
}

//자동완성 옵션 타입(글자 입력시 그에 맞는 검색어 나오는 기능 ex:안녕을 입력하면 아래에 자동완성으로 안녕하세요가 나오는 그런 기능)
interface AutoResult {
  value: string;
  label: React.ReactNode;
  data?: AutocompleteItem;
}

export interface AutocompleteItem {
  value: string;
  type: string;
  contentId: number;
  contentType: string;
}

export interface AutocompleteResponse {
  code: number;
  result: string;
  message: string;
  data: AutocompleteItem[];
}

interface SearchBarProps<T = any> {
  placeholder?: string;
  onSearch: (value: string, results: T[]) => void;
  onSelect?: (value: string, option: AutoResult) => void;
  showSuggestions?: boolean;
  debounceTime?: number;
  maxSuggestions?: number;
  className?: string;
  onDebouncedChange?: (value: string) => void;
}

interface SearchContentsParams {
  keyword?: string;
  actors?: string[];
  page?: number;
  size: number;
  enabled?: boolean;
}

// 필터링
export interface PostFilterRequest {
  contentType?: string | null;
  genres?: string[];
  minRating?: number;
  maxRating?: number;
  platform?: string[];
  minReleaseYear?: number;
  maxReleaseYear?: number;
  ageGroupFilter?: Record<string, unknown>;
  personaFilter?: Record<string, unknown>;
  popcorithmFilter?: Record<string, unknown>;
}

export interface FilteredContentResponse {
  contentId: number;
  contentType: string;
  title: string;
  genres: string[];
  platform: string[];
  ratingAverage: number;
  releaseDate: string;
  posterPath: string;
}

export interface PostFilterResponse {
  contents: FilteredContentResponse[];
  totalElements: number;
  page: number;
  size: number;
  totalPages: number;
}

export type { SearchResult, AutoResult, SearchBarProps, SearchContentsParams };
