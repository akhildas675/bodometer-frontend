import { useCallback, useEffect, useState, useRef } from "react";

type FetchFn<T> = () => Promise<T>;

export function useTableFetch<T>(fetchFn: FetchFn<T>, auto = true) {
  const [data, setData] = useState<T>([] as T);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const fetchFnRef = useRef(fetchFn);

  useEffect(() => {
    fetchFnRef.current = fetchFn;
  }, [fetchFn]);

  const refetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchFnRef.current();
      setData(res);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (auto) refetch();
  }, [refetch, auto]);

  return { data, loading, error, refetch };
}