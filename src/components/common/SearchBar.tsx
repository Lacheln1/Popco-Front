import React, { useCallback, useState } from "react";
import axios from "axios";
import { debounce } from "lodash";
import { SearchOutlined } from "@ant-design/icons";
import { AutoComplete, Input, Spin } from "antd";
//검색 결과 타입 지정(백엔드 데이터 불러오는 거 보고 수정 예정)
interface SearchResult {
  id: number;
  title: string;
  content: string;
  hilights?: {
    //검색 결과에서 검색어가 포함된 부분을 강조 표시해주는 기능
    title?: string[];
    content?: string[];
  };
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
  apiURL?: string; // 백엔드 API 경로
  showSuggestions?: boolean;
  debounceTime?: number;
  maxSuggestions?: number;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "검색어를 입력 해 주세요.",
  onSearch,
  onSelect,
  apiURL = "",
  showSuggestions = true,
  debounceTime = 300,
  maxSuggestions = 10,
  className,
}) => {
  const [searchValue, setSearchValue] = useState<string>("");
  const [suggestions, setSuggestions] = useState<AutoResult[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchResult, setSearchResult] = useState<SearchResult[]>([]);

  // ElasticSearch(자동완성기능 백엔드 처리)가 적용된 API 호출
  const searchAPI = async (query: string): Promise<SearchResult[]> => {
    try {
      const response = await axios.get(apiURL, {
        params: {
          q: query,
          size: maxSuggestions,
          highlight: true, // 하이라이팅 요청
        },
      });

      return response.data; //백엔드 응답 구조에 따라 수정
    } catch (error) {
      console.error("검색 api 오류", error);
      return [];
    }
  };

  //디바운스 된 검색 함수
  const debouncedSearch = useCallback(
    debounce(async (value: string) => {
      if (!value.trim()) {
        setSuggestions([]);
        setSearchResult([]);
        return;
      }
      setLoading(true);
      try {
        const results = await searchAPI(value);
        setSearchResult(results);

        //자동완성 옵션 생성
        if (showSuggestions) {
          const options: AutoResult[] = results.map((result) => ({
            value: result.title,
            label: (
              <div className="py-1">
                <div
                  className="mb-[2px] font-bold"
                  dangerouslySetInnerHTML={{
                    __html: result.hilights?.title?.[0] || result.title,
                  }}
                />
                <div
                  className="text-xs text-gray-600"
                  dangerouslySetInnerHTML={{
                    __html:
                      result.hilights?.content?.[0] ||
                      result.content.substring(0, 100) + "...",
                  }}
                />
              </div>
            ),
            data: result,
          }));
          setSuggestions(options);
        }

        //검색 결과를 부모 컴포넌트에 전달
        onSearch(value, results);
      } finally {
        setLoading(false);
      }
    }, debounceTime),
    [apiURL, showSuggestions, maxSuggestions, debounceTime, onSearch],
  );

  //입력값 변경 핸들러
  const handleInputChange = (value: string): void => {
    setSearchValue(value);
    debouncedSearch(value);
  };

  //자동완성 선택 핸들러
  const handleSelect = (value: string, option: AutoResult): void => {
    setSearchValue(value);
    if (onSelect) {
      onSelect(value, option);
    }
  };

  //검색 버튼 클릭 핸들러
  const handleSearch = (): void => {
    if (searchValue.trim()) {
      onSearch(searchValue, searchResult);
    }
  };

  return (
    <AutoComplete
      options={suggestions}
      value={searchValue}
      onChange={handleInputChange}
      onSelect={handleSelect}
      className={`${className}`}
      notFoundContent={loading ? <Spin size="small" /> : null}
    >
      <Input.Search
        placeholder={placeholder}
        enterButton={<SearchOutlined />}
        loading={loading}
        onSearch={handleSearch}
      />
    </AutoComplete>
  );
};

export default SearchBar;
