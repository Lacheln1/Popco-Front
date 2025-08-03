import { useCallback, useState, useEffect } from "react";
import debounce from "lodash/debounce";
import { fetchSearchContents } from "@/apis/searchApi";
import { SearchResult } from "@/types/Search.types";

export const useDebouncedSearch = () => {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  const debouncedSearch = useCallback(
    debounce(async (keyword: string) => {
      setLoading(true);
      const data = await fetchSearchContents(keyword);
      setResults(data);
      setLoading(false);
    }, 300),
    [],
  );

  const handleSearch = (keyword: string) => {
    if (!keyword.trim()) {
      setResults([]);
      return;
    }
    debouncedSearch(keyword);
  };

  // 컴포넌트 언마운트 시 debounce 취소
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  return { results, loading, handleSearch };
};
