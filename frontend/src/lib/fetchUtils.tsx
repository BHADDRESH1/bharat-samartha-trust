/**
 * Fetch Utility with comprehensive error handling
 * Wraps all API calls with try/catch and fallback UI support
 */

import { optimizedApiCall } from './apiOptimizer';

// Determine API host from environment. Accept either `NEXT_PUBLIC_API_BASE_URL` (preferred)
// or the older `NEXT_PUBLIC_API_URL`. If the provided value includes a trailing `/api`,
// strip that so callers that pass endpoints like `/api/...` don't end up with `/api/api/...`.
function normalizeApiHost(raw?: string): string {
  const val = (raw || "").trim();
  if (!val) return "";
  // remove trailing slashes
  let url = val.replace(/\/+$/g, "");
  // if ends with '/api', remove it to keep host only
  if (/\/api$/i.test(url)) {
    url = url.replace(/\/api$/i, "");
  }
  return url;
}

const API_BASE_URL = normalizeApiHost(
  process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_URL
);

export interface FetchOptions extends RequestInit {
  timeout?: number;
  showFallback?: boolean;
  retries?: number; // Number of retry attempts
  cacheKey?: string; // Cache key for optimized calls
  ttl?: number; // Time to live for cache in milliseconds
  demoMode?: boolean; // Force demo mode for testing
}

export interface FetchResponse<T> {
  success: boolean;
  data: T | null;
  error: string | null;
  status: number;
  message?: string; // Additional message from server
}

/**
 * Delay function for retry mechanism
 */
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Check if we're in demo mode
 */
function isInDemoMode(options: FetchOptions = {}): boolean {
  // Check explicit demo mode option
  if (options.demoMode !== undefined) {
    return options.demoMode;
  }
  
  // Check environment variable
  return process.env.NEXT_PUBLIC_DEMO_MODE === 'true';
}

/**
 * Safe fetch wrapper with timeout, error handling, and retry mechanism
 */
export async function safeFetch<T = any>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<FetchResponse<T>> {
  const { 
    timeout = 10000, // Increased timeout to 10 seconds
    showFallback = true, 
    retries = 2, // Default to 2 retry attempts
    cacheKey,
    ttl = 300000, // 5 minutes default cache
    demoMode,
    ...fetchOptions 
  } = options;

  // Use optimized API call with caching if cacheKey is provided
  if (cacheKey) {
    try {
      const cachedData = await optimizedApiCall(
        cacheKey,
        () => executeFetch<T>(endpoint, fetchOptions, timeout, retries, demoMode),
        ttl
      );
      return cachedData;
    } catch (error) {
      // If cached call fails, fall back to regular fetch
      console.warn('Optimized API call failed, falling back to regular fetch:', error);
    }
  }

  // Regular fetch without caching
  return executeFetch<T>(endpoint, fetchOptions, timeout, retries, demoMode);
}

/**
 * Execute the actual fetch operation
 */
async function executeFetch<T>(
  endpoint: string,
  fetchOptions: RequestInit,
  timeout: number,
  retries: number,
  demoMode?: boolean
): Promise<FetchResponse<T>> {
  // Try the fetch operation with retries
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      // Check if in demo mode
      if (isInDemoMode({ demoMode })) {
        console.log('🎯 Demo mode: Returning mock data for', endpoint);
        return {
          success: true,
          data: null,
          error: null,
          status: 200,
          message: 'Demo mode - using mock data'
        } as unknown as FetchResponse<T>;
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const url = endpoint.startsWith('http')
        ? endpoint
        : `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : "/" + endpoint}`;

      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Try to parse JSON response body (if any). Keep parsing even on non-OK
      // responses so callers can inspect server-provided error messages
      // (for example HTTP 409 / conflict with a helpful `message`).
      let data: any = null;
      try {
        data = await response.json();
      } catch {
        // ignore parse errors (non-JSON responses)
        data = null;
      }

      // If the server returns its own `success` flag in the JSON body, respect that.
      // Otherwise fall back to the HTTP `response.ok` value.
      const overallSuccess =
        data &&
        typeof data === "object" &&
        Object.prototype.hasOwnProperty.call(data, "success")
          ? !!data.success
          : response.ok;

      const errorMsg = overallSuccess
        ? null
        : (data && (data.error || data.message)) ||
          `${response.status} ${response.statusText}`;

      return {
        success: overallSuccess,
        data: data as T,
        error: errorMsg,
        status: response.status,
        message: data?.message
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to fetch data from server";

      // If this is the last attempt, return the error
      if (attempt === retries) {
        console.error(`Fetch error for ${endpoint}:`, error);

        // Special handling for timeout errors
        if (errorMessage.includes("Abort")) {
          return {
            success: false,
            data: null,
            error: "Request timeout. Server may be overloaded or offline.",
            status: 0,
          };
        }
        
        // Special handling for network errors
        if (errorMessage.includes("fetch")) {
          return {
            success: false,
            data: null,
            error: "Unable to connect to server. Please check if the API is running.",
            status: 0,
          };
        }

        return {
          success: false,
          data: null,
          error: errorMessage,
          status: 0,
        };
      }

      // Wait before retrying (exponential backoff)
      await delay(Math.pow(2, attempt) * 1000);
    }
  }

  // This should never be reached, but TypeScript requires it
  return {
    success: false,
    data: null,
    error: "Unknown error occurred",
    status: 0,
  };
}

/**
 * Fallback UI component for fetch errors
 */
export const FetchErrorFallback = ({
  message = "Service unavailable",
  onRetry,
  showRetry = true,
}: {
  message?: string;
  onRetry?: () => void;
  showRetry?: boolean;
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-gray-50 rounded-lg border border-gray-200">
      <div className="mb-4">
        <svg
          className="w-12 h-12 text-gray-400 mx-auto"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <p className="text-gray-600 text-sm mb-1">
        <strong>Service Unavailable</strong>
      </p>
      <p className="text-gray-500 text-xs mb-4 max-w-xs">{message}</p>
      {showRetry && onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );
};

/**
 * Loading skeleton
 */
export const LoadingSkeleton = ({ count = 1 }: { count?: number }) => {
  return (
    <div className="space-y-4">
      {Array(count)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        ))}
    </div>
  );
};