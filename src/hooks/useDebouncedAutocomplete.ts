import { useCallback, useState, useEffect, useRef } from "react";
import debounce from "lodash/debounce";
import { fetchAutocomplete, AutocompleteItem } from "@/apis/searchApi";

interface UseDebouncedAutocompleteParams {
  prefix: string;
}

export const useDebouncedAutocomplete = () => {
  const [results, setResults] = useState<AutocompleteItem[]>([]);
  const [loading, setLoading] = useState(false);

  //  useRef로 debounced 함수를 안정적으로 관리
  const debouncedAutocompleteRef = useRef<ReturnType<typeof debounce>>();

  //  실제 자동완성 로직을 별도 함수로 분리
  const performAutocomplete = useCallback(async (prefix: string) => {
    // 빈 문자열이거나 공백만 있는 경우 결과 초기화
    if (!prefix || prefix.trim().length === 0) {
      setResults([]);
      setLoading(false);
      return;
    }

    // 최소 1글자 이상 입력했을 때만 API 호출
    if (prefix.trim().length < 1) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await fetchAutocomplete(prefix.trim());
      setResults(response);
    } catch (error) {
      console.error("자동완성 검색 에러:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  //  debounced 함수 초기화를 useEffect에서 한 번만 수행
  useEffect(() => {
    debouncedAutocompleteRef.current = debounce(
      (prefix: string) => {
        performAutocomplete(prefix);
      },
      200, // 200ms 디바운스
    );

    // 클린업 함수
    return () => {
      if (debouncedAutocompleteRef.current) {
        debouncedAutocompleteRef.current.cancel();
      }
    };
  }, [performAutocomplete]);

  //  안정적인 핸들러 함수
  const handleAutocomplete = useCallback(
    ({ prefix }: UseDebouncedAutocompleteParams) => {
      if (debouncedAutocompleteRef.current) {
        debouncedAutocompleteRef.current(prefix);
      }
    },
    [],
  );

  //  결과 초기화 함수 - useCallback으로 안정화
  const clearResults = useCallback(() => {
    setResults([]);
    setLoading(false);
    // 진행 중인 debounced 호출도 취소
    if (debouncedAutocompleteRef.current) {
      debouncedAutocompleteRef.current.cancel();
    }
  }, []);

  //  즉시 검색 함수 (디바운스 없이)
  const searchImmediately = useCallback(
    (prefix: string) => {
      if (debouncedAutocompleteRef.current) {
        debouncedAutocompleteRef.current.cancel();
      }
      performAutocomplete(prefix);
    },
    [performAutocomplete],
  );

  return {
    results,
    loading,
    handleAutocomplete,
    clearResults,
    searchImmediately, // 추가: 즉시 검색이 필요한 경우
  };
};
