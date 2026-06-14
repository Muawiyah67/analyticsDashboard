"use client";

import { useState, useCallback } from 'react';
import { ApiResponse, PaginatedResponse } from '@nexus/shared';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

interface UseApiOptions {
  onSuccess?: (data: unknown) => void;
  onError?: (error: Error) => void;
}

/**
 * Hook for handling async API calls
 */
export function useApi<T = unknown>(options?: UseApiOptions) {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(
    async (apiCall: () => Promise<ApiResponse<T>>) => {
      setState({ data: null, loading: true, error: null });

      try {
        const response = await apiCall();

        if (!response.success) {
          throw new Error(response.error || response.message || 'API request failed');
        }

        setState({ data: response.data ?? null, loading: false, error: null });

        if (options?.onSuccess) {
          options.onSuccess(response.data);
        }

        return response.data;
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        setState({ data: null, loading: false, error: err });

        if (options?.onError) {
          options.onError(err);
        }

        throw err;
      }
    },
    [options]
  );

  return {
    ...state,
    execute,
  };
}

/**
 * Hook for paginated data fetching
 */
export function usePaginatedApi<T = unknown>(
  apiCall: (page: number, limit: number) => Promise<ApiResponse<PaginatedResponse<T>>>,
  initialLimit: number = 10
) {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(initialLimit);
  const [data, setData] = useState<T[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(
    async (pageNum: number = 1, lim: number = limit) => {
      setLoading(true);
      setError(null);

      try {
        const response = await apiCall(pageNum, lim);

        if (!response.success) {
          throw new Error(response.error || 'API request failed');
        }

        const paginatedData = response.data;
        if (!paginatedData) {
          throw new Error('No paginated data received');
        }

        setPage(pageNum);
        setLimit(lim);
        setData(paginatedData.data ?? []);
        setTotal(paginatedData.total);
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
      } finally {
        setLoading(false);
      }
    },
    [apiCall, limit]
  );

  const goToPage = useCallback(
    (pageNum: number) => {
      fetch(pageNum, limit);
    },
    [fetch, limit]
  );

  const nextPage = useCallback(() => {
    const maxPage = Math.ceil(total / limit);
    if (page < maxPage) {
      goToPage(page + 1);
    }
  }, [page, limit, total, goToPage]);

  const prevPage = useCallback(() => {
    if (page > 1) {
      goToPage(page - 1);
    }
  }, [page, goToPage]);

  return {
    data,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    loading,
    error,
    fetch,
    goToPage,
    nextPage,
    prevPage,
  };
}

/**
 * Hook for managing async mutations (POST, PUT, DELETE)
 */
export function useMutation<T = unknown, Args extends unknown[] = unknown[]>(
  mutation: (...args: Args) => Promise<ApiResponse<T>>,
  options?: UseApiOptions
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(
    async (...args: Args): Promise<T | undefined> => {
      setLoading(true);
      setError(null);

      try {
        const response = await mutation(...args);

        if (!response.success) {
          throw new Error(response.error || response.message || 'Request failed');
        }

        if (options?.onSuccess) {
          options.onSuccess(response.data);
        }

        return response.data;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);

        if (options?.onError) {
          options.onError(error);
        }

        throw error;
      } finally {
        setLoading(false);
      }
    },
    [mutation, options]
  );

  return {
    execute,
    loading,
    error,
  };
}

/**
 * Hook for handling search with debouncing
 */
export function useSearch<T = unknown>(
  searchFn: (query: string) => Promise<ApiResponse<T[]>>,
  debounceMs: number = 300
) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const handleSearch = useCallback(
    (value: string) => {
      setQuery(value);

      if (!value.trim()) {
        setResults([]);
        return;
      }

      const timer = setTimeout(async () => {
        setLoading(true);
        setError(null);

        try {
          const response = await searchFn(value);

          if (!response.success) {
            throw new Error(response.error || 'Search failed');
          }

          setResults(response.data ?? []);
        } catch (err) {
          const error = err instanceof Error ? err : new Error(String(err));
          setError(error);
        } finally {
          setLoading(false);
        }
      }, debounceMs);

      return () => clearTimeout(timer);
    },
    [searchFn, debounceMs]
  );

  return {
    query,
    results,
    loading,
    error,
    handleSearch,
  };
}