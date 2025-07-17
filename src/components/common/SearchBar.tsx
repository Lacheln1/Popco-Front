import React, { useCallback, useState, useRef, useEffect } from "react";
import axios from "axios";
import { debounce } from "lodash";
import { SearchOutlined } from "@ant-design/icons";

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
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 더미 데이터 (테스트용)
  const dummyData: SearchResult[] = [
    {
      id: 1,
      title: "React 시작하기",
    },
    {
      id: 2,
      title: "JavaScript 기초",
    },
    {
      id: 3,
      title: "JavaScript 배우기",
    },
    {
      id: 4,
      title: "Node.js 서버 개발",
    },
    {
      id: 5,
      title: "CSS 스타일링 가이드",
    },
  ];

  // ElasticSearch(자동완성기능 백엔드 처리)가 적용된 API 호출
  const searchAPI = async (query: string): Promise<SearchResult[]> => {
    // 실제 API 호출 대신 더미 데이터로 시뮬레이션
    if (!apiURL) {
      // 더미 데이터에서 검색어와 일치하는 항목 필터링
      const filteredResults = dummyData.filter((item) =>
        item.title.toLowerCase().includes(query.toLowerCase()),
      );

      // 실제 API 응답처럼 지연시간 추가
      await new Promise((resolve) => setTimeout(resolve, 300));

      return filteredResults.slice(0, maxSuggestions);
    }

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
        setShowDropdown(false);
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
          setShowDropdown(options.length > 0);
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
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    setSearchValue(value);
    setSelectedIndex(-1);
    debouncedSearch(value);
  };

  //자동완성 선택 핸들러
  const handleSelect = (option: AutoResult): void => {
    setSearchValue(option.value);
    setShowDropdown(false);
    setSelectedIndex(-1);
    if (onSelect) {
      onSelect(option.value, option);
    }
  };

  //검색 버튼 클릭 핸들러
  const handleSearch = (): void => {
    if (searchValue.trim()) {
      onSearch(searchValue, searchResult);
      setShowDropdown(false);
    }
  };

  // 키보드 이벤트 핸들러
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (!showDropdown || suggestions.length === 0) {
      if (e.key === "Enter") {
        handleSearch();
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev,
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSelect(suggestions[selectedIndex]);
        } else {
          handleSearch();
        }
        break;
      case "Escape":
        setShowDropdown(false);
        setSelectedIndex(-1);
        break;
    }
  };

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 포커스 시 드롭다운 표시
  const handleFocus = (): void => {
    if (suggestions.length > 0) {
      setShowDropdown(true);
    }
  };

  return (
    <div className="flex justify-center px-4 pt-8">
      <div className="relative w-full max-w-[700px]">
        <div className="relative flex items-center rounded-full border border-gray-300 bg-white">
          <input
            ref={inputRef}
            type="text"
            value={searchValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            placeholder={placeholder}
            className={`h-12 flex-1 border-none bg-transparent px-6 text-base outline-none ${className}`}
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="mr-3 flex h-16 w-10 items-center justify-center text-black transition-colors duration-200 focus:outline-none disabled:opacity-50"
          >
            {loading ? (
              <div className="h-3 w-3 animate-spin rounded-full border-2 border-black border-t-transparent"></div>
            ) : (
              <SearchOutlined className="text-3xl" />
            )}
          </button>
        </div>

        {/* 자동완성 드롭다운 */}
        {showDropdown && suggestions.length > 0 && (
          <div
            ref={dropdownRef}
            className="absolute left-0 right-0 top-full z-50 max-h-80 overflow-y-auto rounded-b-lg border border-t-0 border-gray-300 bg-white shadow-lg"
          >
            {suggestions.map((option, index) => (
              <div
                key={index}
                onClick={() => handleSelect(option)}
                className={`cursor-pointer border-b border-gray-100 px-4 py-3 last:border-b-0 hover:bg-gray-50 ${
                  selectedIndex === index ? "bg-blue-50" : ""
                }`}
              >
                {option.label}
              </div>
            ))}
          </div>
        )}

        {/* 로딩 상태 표시 */}
        {loading && showDropdown && (
          <div className="absolute left-0 right-0 top-full z-50 rounded-b-lg border border-t-0 border-gray-300 bg-white p-4 text-center shadow-lg">
            <div className="flex items-center justify-center space-x-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-400 border-t-transparent"></div>
              <span className="text-gray-600">검색중...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
