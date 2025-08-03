interface SearchResult {
  id: string;
  title: string;
  overview: string;
  contentType: string;
  contentId: string;
  ratingAverage: number;
  releaseDate: string;
  posterPath: string;
  cast: {
    actorName: string;
    characterName: string;
  }[];
}

//자동완성 옵션 타입(글자 입력시 그에 맞는 검색어 나오는 기능 ex:안녕을 입력하면 아래에 자동완성으로 안녕하세요가 나오는 그런 기능)
interface AutoResult {
  value: string;
  label: React.ReactNode;
  data?: SearchResult;
}

interface SearchBarProps {
  placeholder?: string;
  onSearch: (value: string, results: SearchResult[]) => void; //검색이 실행될 때 호출되는 콜백 함수. (언제 호출? : 사용자가 검색 버튼 클릭, enter키 눌렀을 때, 실시간 검색에서 결과가 나왔을 때 사용)
  onSelect?: (value: string, option: AutoResult) => void; //자동완성 목록에서 특정 항목을 선택했을 때 호출되는 콜백 함수 (option: 선택된 항목의 전체 데이터) (언제 호출? : 자동완성 드롭다운에서 항목을 클릭했을 때, 키보드로 항목을 선택하고enter눌렀을 때)
  showSuggestions?: boolean;
  debounceTime?: number;
  maxSuggestions?: number;
  className?: string;
}

export type { SearchResult, AutoResult, SearchBarProps };
