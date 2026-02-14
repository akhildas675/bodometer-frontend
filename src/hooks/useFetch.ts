import { useCallback, useEffect, useRef, useState } from "react";

type FetchFn<T> = () => Promise<T>;

export function useFetch<T>(fetchFn: FetchFn<T>, auto = true) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(auto);
  const [error, setError] = useState<string | null>(null);
  const fetchFnRef = useRef(fetchFn);
  
  useEffect(() => {
    fetchFnRef.current = fetchFn;
  }, [fetchFn]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchFnRef.current(); 
      setData(result);
    } catch {
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (auto) fetchData();
  }, [auto, fetchData]);

  return { data, loading, error, refetch: fetchData };
}