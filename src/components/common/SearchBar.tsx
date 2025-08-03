import { useEffect, useState, useRef, KeyboardEvent, ChangeEvent } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { useDebouncedSearch } from "@/hooks/useDebouncedSearch";
import { AutoResult, SearchBarProps } from "@/types/Search.types";

const SearchBar = <T,>({
  placeholder = "검색어를 입력 해 주세요.",
  onSearch,
  onSelect,
  showSuggestions = true,
  className,
}: SearchBarProps<T>) => {
  const [searchValue, setSearchValue] = useState("");
  const [suggestions, setSuggestions] = useState<AutoResult[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { results, loading, handleSearch } = useDebouncedSearch();

  // 결과 변경 시 자동완성 구성 및 onSearch 콜백 호출
  useEffect(() => {
    if (!showSuggestions || !searchValue.trim()) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    const options: AutoResult[] = results.map((result) => ({
      value: (result as any).title,
      label: (
        <div className="py-1">
          <div className="mb-[2px] font-bold">{(result as any).title}</div>
        </div>
      ),
      data: result,
    }));

    setSuggestions(options);
    setShowDropdown(options.length > 0);

    onSearch(searchValue, results as T[]);
  }, [results, searchValue, showSuggestions, onSearch]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    handleSearch(value);
  };

  const handleSelect = (option: AutoResult) => {
    setSearchValue(option.value);
    setShowDropdown(false);
    onSelect?.(option.value, option);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearch(searchValue, results as unknown as T[]);
      setShowDropdown(false);
    } else if (e.key === "Escape") {
      setShowDropdown(false);
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      !dropdownRef.current?.contains(event.target as Node) &&
      !inputRef.current?.contains(event.target as Node)
    ) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFocus = () => {
    if (suggestions.length > 0) setShowDropdown(true);
  };

  return (
    <div className="flex justify-center px-4 pt-8">
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
          />
          <button
            onClick={() => onSearch(searchValue, results as unknown as T[])}
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
            className="absolute left-4 right-4 top-full z-50 max-h-80 min-w-60 overflow-y-auto rounded-b-lg border border-t-0 border-[#ededed] bg-white shadow-lg"
          >
            {suggestions.map((option, index) => (
              <div
                key={index}
                onClick={() => handleSelect(option)}
                className={`flex h-12 cursor-pointer items-center border-b border-gray-100 px-4 py-3 last:border-b-0 hover:bg-gray-50 ${
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
