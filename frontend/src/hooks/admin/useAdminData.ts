import { useState, useEffect, useCallback } from 'react';

interface UseAdminDataOptions {
  endpoint: string;
  params?: Record<string, never>;
  dependencies?: never[];
  enabled?: boolean;
}

interface DataState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  isValidating: boolean;
}

export function useAdminData<T = never>(options: UseAdminDataOptions) {
  const { endpoint, params = {}, dependencies = [], enabled = true } = options;
  
  const [state, setState] = useState<DataState<T>>({
    data: null,
    isLoading: true,
    error: null,
    isValidating: false
  });

  const fetchData = useCallback(async (showLoading = true) => {
    if (!enabled) return;

    try {
      setState(prev => ({
        ...prev,
        isLoading: showLoading,
        isValidating: !showLoading,
        error: null
      }));

      const token = localStorage.getItem('admin_token');
      const queryParams = new URLSearchParams(params).toString();
      const url = `${endpoint}${queryParams ? `?${queryParams}` : ''}`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      setState({
        data,
        isLoading: false,
        error: null,
        isValidating: false
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        isValidating: false,
        error: error instanceof Error ? error.message : 'Failed to fetch data'
      }));
    }
  }, [endpoint, params, enabled]);

  // Initial fetch and refetch on dependencies change
  useEffect(() => {
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchData, ...dependencies]);

  const refetch = useCallback(() => {
    fetchData(false);
  }, [fetchData]);

  const mutate = useCallback((newData: T | ((prevData: T | null) => T)) => {
    setState(prev => ({
      ...prev,
      data: typeof newData === 'function' 
        // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
        ? (newData as Function)(prev.data)
        : newData
    }));
  }, []);

  return {
    ...state,
    refetch,
    mutate
  };
}