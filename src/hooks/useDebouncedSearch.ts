import { useCallback, useState } from "react";
import debounce from "lodash/debounce";
import { searchContents } from "@/apis/collectionApi";

export const useDebouncedSearch = () => {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const debouncedSearch = useCallback(
    debounce(async (keyword: string) => {
      setLoading(true);
      const data = await searchContents(keyword);
      setResults(data || []);
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

  return { results, loading, handleSearch };
};
