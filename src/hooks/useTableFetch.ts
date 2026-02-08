// hooks/useTableFetch.ts
import { useCallback, useEffect, useState, useRef } from "react";

import type { QueryParams } from "../interface/common.interface";



type FetchFn<T> = (params?: QueryParams) => Promise<T>;

export function useTableFetch<T>(fetchFn: FetchFn<T>, initialParams?: QueryParams) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const [params, setParams] = useState<QueryParams>(initialParams || {
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const fetchFnRef = useRef(fetchFn);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    fetchFnRef.current = fetchFn;
  }, [fetchFn]);

  const refetch = useCallback(async (newParams?: QueryParams) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    try {
      setLoading(true);
      setError(null);
      
      abortControllerRef.current = new AbortController();
      
      const finalParams = newParams || params;
      const res = await fetchFnRef.current(finalParams);
      setData(res);
      
      if (newParams) {
        setParams(finalParams);
      }
    } catch (err: unknown) {
      const error = err as Error;
      if (error.name !== 'AbortError') {
        setError(error);
      }
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
  }, [params]);

  useEffect(() => {
    refetch();
  }, [params.page, params.limit, params.search, params.sortBy, params.sortOrder, params.isBlocked, params.isVerified]);

  return { data, loading, error, refetch, setParams, params };
}