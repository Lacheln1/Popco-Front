import {
  useEffect,
  useState,
  useRef,
  KeyboardEvent,
  ChangeEvent,
  useCallback,
} from "react";
import { SearchOutlined } from "@ant-design/icons";
import { useDebouncedAutocomplete } from "@/hooks/useDebouncedAutocomplete";
import { AutoResult, SearchBarProps } from "@/types/Search.types";
import { AutocompleteItem } from "@/apis/searchApi";

const SearchBar = <T,>({
  placeholder = "검색어를 입력 해 주세요.",
  onSearch,
  onSelect,
  showSuggestions = true,
  className,
  searchType,
  setSearchType,
  onDebouncedChange,
}: SearchBarProps<T> & {
  searchType: "keyword" | "actors";
  setSearchType: (type: "keyword" | "actors") => void;
}) => {
  const [searchValue, setSearchValue] = useState("");
  const [suggestions, setSuggestions] = useState<AutoResult[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { results, loading, handleAutocomplete, clearResults } =
    useDebouncedAutocomplete();

  // onSearch 콜백을 useCallback으로 메모이제이션
  const memoizedOnSearch = useCallback(onSearch, [onSearch]);

  // searchType에 따른 아이콘 반환
  const getSearchTypeIcon = () => {
    switch (searchType) {
      case "keyword":
        return "🔍";
      case "actors":
        return "👤";
      default:
        return "🔍";
    }
  };

  // searchType에 따른 한글 표시
  const getSearchTypeLabel = () => {
    switch (searchType) {
      case "keyword":
        return "작품";
      case "actors":
        return "배우";
      default:
        return "검색";
    }
  };

  // 자동완성 결과를 AutoResult 형태로 변환 및 필터링
  useEffect(() => {
    if (!Array.isArray(results)) return;
    if (!showSuggestions || !searchValue.trim()) {
      if (suggestions.length > 0) {
        setSuggestions([]);
      }
      setShowDropdown(false);
      return;
    }
    const filteredResults = results.filter((result: AutocompleteItem) => {
      return searchType === "keyword"
        ? result.type === "content"
        : result.type === "actors";
    });

    const options: AutoResult[] = filteredResults.map((result) => ({
      value: result.value,
      label: (
        <div className="flex items-center gap-2 py-1">
          <span className="text-lg">{getSearchTypeIcon()}</span>
          <div className="flex-1">
            <div className="mb-[2px] font-bold">{result.value}</div>
            <div className="text-xs text-gray-500">
              {getSearchTypeLabel()} • {result.type}
            </div>
          </div>
        </div>
      ),
      data: result,
    }));

    const prevValues = suggestions.map((item) => item.value).join(",");
    const nextValues = options.map((item) => item.value).join(",");

    if (prevValues !== nextValues) {
      setSuggestions(options);
      setShowDropdown(options.length > 0);
    }
  }, [results, searchValue, showSuggestions, searchType]);

  const triggerAutocomplete = useCallback(
    (value: string) => {
      if (value.trim()) {
        handleAutocomplete({ prefix: value });
      } else {
        clearResults();
        setSuggestions([]);
        setShowDropdown(false);
      }
    },
    [handleAutocomplete, clearResults],
  );

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    triggerAutocomplete(value);
    setSelectedIndex(-1);
    onDebouncedChange?.(value);
  };

  const handleSelect = (option: AutoResult) => {
    setSearchValue(option.value);
    setShowDropdown(false);
    clearResults();
    onSelect?.(option.value, option);
    // 선택 시에만 실제 검색 실행
    memoizedOnSearch(option.value, [option.data] as unknown as T[]);
  };

  const handleSearch = () => {
    console.log(searchType);
    if (searchType === "actors") {
      memoizedOnSearch(searchValue, [searchValue] as unknown as T[]);
    } else {
      memoizedOnSearch(searchValue, [] as unknown as T[]);
    }
    setShowDropdown(false);
    clearResults();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown || suggestions.length === 0) {
      if (e.key === "Enter") {
        e.preventDefault();
        handleSearch();
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : 0,
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : suggestions.length - 1,
        );
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSelect(suggestions[selectedIndex]);
        } else {
          // 선택된 항목이 없으면 현재 입력값으로 검색
          memoizedOnSearch(searchValue, results as unknown as T[]);
          setShowDropdown(false);
        }
        break;
      case "Escape":
        setShowDropdown(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (
      !dropdownRef.current?.contains(event.target as Node) &&
      !inputRef.current?.contains(event.target as Node)
    ) {
      setShowDropdown(false);
      setSelectedIndex(-1);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handleClickOutside]);

  const handleFocus = () => {
    if (suggestions.length > 0 && searchValue.trim()) {
      setShowDropdown(true);
    }
  };

  const handleSearchButtonClick = () => {
    handleSearch();
  };

  // 검색 타입 변경 시 결과 초기화
  useEffect(() => {
    clearResults();
    setSuggestions([]);
    setShowDropdown(false);
    setSelectedIndex(-1);
  }, [searchType, clearResults]);

  return (
    <div className="flex flex-col items-center px-4 pt-8">
      <div className="flex w-full max-w-[240px] justify-between rounded-[20px] bg-[#f7f7f7] p-1 shadow-sm">
        <button
          onClick={() => setSearchType("keyword")}
          className={`w-1/2 rounded-[16px] py-2 text-sm font-semibold transition-all duration-200 ${
            searchType === "keyword"
              ? "bg-white text-black shadow"
              : "text-gray-400"
          }`}
        >
          작품 키워드
        </button>
        <button
          onClick={() => setSearchType("actors")}
          className={`w-1/2 rounded-[16px] py-2 text-sm font-semibold transition-all duration-200 ${
            searchType === "actors"
              ? "bg-white text-black shadow"
              : "text-gray-400"
          }`}
        >
          배우 이름
        </button>
      </div>

      <div className="relative w-full max-w-[700px]">
        <div className="relative flex h-10 min-w-80 items-center rounded-full border border-[#ededed] bg-white shadow-[0px_10px_15px_#0000000d] sm:h-16">
          <input
            name="search"
            ref={inputRef}
            type="text"
            value={searchValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            placeholder={placeholder}
            className={`h-12 flex-1 border-none bg-transparent px-6 text-base outline-none ${className}`}
            autoComplete="off"
          />
          <button
            onClick={handleSearchButtonClick}
            disabled={loading}
            className="mr-3 flex h-10 w-10 items-center justify-center text-black transition-colors duration-200 focus:outline-none disabled:opacity-50"
          >
            {loading ? (
              <div className="h-3 w-3 animate-spin rounded-full border-2 border-black border-t-transparent" />
            ) : (
              <SearchOutlined className="text-xl" />
            )}
          </button>
        </div>

        {showDropdown && suggestions.length > 0 && (
          <div
            ref={dropdownRef}
            className="absolute left-4 right-4 top-full z-50 max-h-80 overflow-y-auto rounded-b-lg border border-t-0 border-[#ededed] bg-white shadow-lg"
          >
            {suggestions.map((option, index) => (
              <div
                key={index}
                onClick={() => handleSelect(option)}
                className={`flex h-auto min-h-[48px] cursor-pointer items-center border-b border-gray-100 px-4 py-2 last:border-b-0 hover:bg-gray-50 ${
                  selectedIndex === index ? "bg-blue-50" : ""
                }`}
              >
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
