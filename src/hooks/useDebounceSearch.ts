import { useState, useEffect } from "react";

interface UseDebounceSearchOptions<T> {
  searchFn: (query: string) => Promise<T>;
  delay?: number;
  minQueryLength?: number;
}

interface UseDebounceSearchReturn<T> {
  query: string;
  setQuery: (query: string) => void;
  results: T | null;
  isLoading: boolean;
  error: Error | null;
}

export function useDebounceSearch<T>({
  searchFn,
  delay = 500,
  minQueryLength = 1,
}: UseDebounceSearchOptions<T>): UseDebounceSearchReturn<T> {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (query.trim().length < minQueryLength) {
      setResults(null);
      setError(null);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await searchFn(query);
        setResults(result);
      } catch (err) {
        console.error("Search error:", err);
        setError(err instanceof Error ? err : new Error("Search failed"));
        setResults(null);
      } finally {
        setIsLoading(false);
      }
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [query, searchFn, delay, minQueryLength]);

  return {
    query,
    setQuery,
    results,
    isLoading,
    error,
  };
}
