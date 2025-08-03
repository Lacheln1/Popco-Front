import { useCallback, useState, useEffect } from "react";
import debounce from "lodash/debounce";
import { fetchSearchContents } from "@/apis/searchApi";
import { SearchResult } from "@/types/Search.types";

interface UseDebouncedSearchParams {
  keyword?: string;
  actors?: string[];
}

export const useDebouncedSearch = () => {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  const debouncedSearch = useCallback(
    debounce(
      async ({ keyword = "", actors = [] }: UseDebouncedSearchParams) => {
        const hasKeyword = keyword.trim().length > 0;
        const hasActors = Array.isArray(actors) && actors.length > 0;

        if (!hasKeyword && !hasActors) {
          setResults([]);
          return;
        }

        setLoading(true);

        const response = await fetchSearchContents({
          keyword,
          actors,
          page: 0,
          size: 20,
        });

        setResults(response.content);
        setLoading(false);
      },
      300,
    ),
    [],
  );

  const handleSearch = (params: UseDebouncedSearchParams) => {
    debouncedSearch(params);
  };

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  return { results, loading, handleSearch };
};
