import React, { useState, useEffect } from 'react';
import DataFallback from './DataFallback';

interface DataLoaderProps<T> {
  fetchData: () => Promise<T>;
  children: (data: T) => React.ReactNode;
  loadingComponent?: React.ReactNode;
  errorComponent?: React.ReactNode;
  fallbackData?: T;
  retryOnError?: boolean;
  retryDelay?: number;
}

const DataLoader = <T,>({
  fetchData,
  children,
  loadingComponent,
  errorComponent,
  fallbackData,
  retryOnError = false,
  retryDelay = 5000
}: DataLoaderProps<T>) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let isMounted = true;
    let retryTimeout: NodeJS.Timeout;

    const loadData = async () => {
      try {
        if (!isMounted) return;
        
        setLoading(true);
        setError(null);
        
        const result = await fetchData();
        
        if (isMounted) {
          setData(result);
        }
      } catch (err) {
        if (!isMounted) return;
        
        const errorMessage = err instanceof Error ? err.message : 'Failed to load data';
        setError(errorMessage);
        
        // Use fallback data if provided
        if (fallbackData && isMounted) {
          setData(fallbackData);
        }
        
        // Retry logic
        if (retryOnError && retryCount < 3) {
          retryTimeout = setTimeout(() => {
            if (isMounted) {
              setRetryCount(prev => prev + 1);
            }
          }, retryDelay);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
      if (retryTimeout) {
        clearTimeout(retryTimeout);
      }
    };
  }, [retryCount]);

  // Manual retry function
  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  // Show loading state
  if (loading) {
    return loadingComponent || (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading data...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error && !data) {
    return errorComponent || (
      <DataFallback
        title="Data Loading Failed"
        description={error}
        actionText="Try Again"
        onAction={handleRetry}
        showAction={true}
      />
    );
  }

  // Render children with data
  return data ? <>{children(data)}</> : null;
};

export default DataLoader;