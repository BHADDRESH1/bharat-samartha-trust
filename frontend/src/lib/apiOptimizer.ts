/**
 * API Optimization Utilities
 * Provides caching, batching, and performance improvements for API calls
 */

// In-memory cache for API responses
const apiCache = new Map<string, { data: any; timestamp: number; ttl: number }>();

// Cache cleanup interval
const CACHE_CLEANUP_INTERVAL = 5 * 60 * 1000; // 5 minutes

// Cleanup expired cache entries
function cleanupCache() {
  const now = Date.now();
  for (const [key, value] of apiCache.entries()) {
    if (now - value.timestamp > value.ttl) {
      apiCache.delete(key);
    }
  }
}

// Start cache cleanup interval
setInterval(cleanupCache, CACHE_CLEANUP_INTERVAL);

/**
 * Cache API response
 * @param key Cache key
 * @param data Response data
 * @param ttl Time to live in milliseconds
 */
export function cacheApiResponse(key: string, data: any, ttl: number = 300000) { // 5 minutes default
  apiCache.set(key, {
    data,
    timestamp: Date.now(),
    ttl
  });
}

/**
 * Get cached API response
 * @param key Cache key
 * @returns Cached data or null if not found/expired
 */
export function getCachedApiResponse(key: string): any | null {
  const cached = apiCache.get(key);
  if (!cached) return null;
  
  // Check if expired
  if (Date.now() - cached.timestamp > cached.ttl) {
    apiCache.delete(key);
    return null;
  }
  
  return cached.data;
}

/**
 * Clear cache entry
 * @param key Cache key
 */
export function clearCacheEntry(key: string) {
  apiCache.delete(key);
}

/**
 * Clear all cache
 */
export function clearAllCache() {
  apiCache.clear();
}

/**
 * Batch multiple API calls
 * @param requests Array of request functions
 * @returns Array of responses
 */
export async function batchApiCalls(requests: (() => Promise<any>)[]): Promise<any[]> {
  // Execute all requests concurrently
  return Promise.all(requests.map(req => req()));
}

/**
 * Debounce API calls to prevent excessive requests
 * @param func Function to debounce
 * @param delay Delay in milliseconds
 * @returns Debounced function
 */
export function debounceApiCall(func: (...args: any[]) => any, delay: number) {
  let timeoutId: NodeJS.Timeout | null = null;
  
  return function(...args: any[]) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
}

/**
 * Optimize API call with caching and deduplication
 * @param key Unique cache key
 * @param apiCall Function that returns a Promise
 * @param ttl Time to live in milliseconds
 * @returns Promise with cached or fresh data
 */
export async function optimizedApiCall<T>(
  key: string, 
  apiCall: () => Promise<T>, 
  ttl: number = 300000
): Promise<T> {
  // Check cache first
  const cached = getCachedApiResponse(key);
  if (cached !== null) {
    return cached;
  }
  
  // Deduplicate concurrent requests
  const pendingRequests = (window as any).__PENDING_REQUESTS__ || {};
  if (pendingRequests[key]) {
    return pendingRequests[key];
  }
  
  // Execute API call
  const promise = apiCall().then(data => {
    // Cache the result
    cacheApiResponse(key, data, ttl);
    // Clean up pending request
    delete pendingRequests[key];
    return data;
  }).catch(error => {
    // Clean up pending request on error
    delete pendingRequests[key];
    throw error;
  });
  
  // Store pending request
  pendingRequests[key] = promise;
  (window as any).__PENDING_REQUESTS__ = pendingRequests;
  
  return promise;
}

/**
 * Prefetch API data for better performance
 * @param key Cache key
 * @param apiCall Function that returns a Promise
 * @param ttl Time to live in milliseconds
 */
export async function prefetchApiData<T>(
  key: string, 
  apiCall: () => Promise<T>, 
  ttl: number = 300000
): Promise<void> {
  try {
    const data = await apiCall();
    cacheApiResponse(key, data, ttl);
  } catch (error) {
    console.warn('Prefetch failed for key:', key, error);
  }
}

/**
 * Invalidate cache entries by pattern
 * @param pattern Pattern to match cache keys
 */
export function invalidateCacheByPattern(pattern: string | RegExp) {
  const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern;
  for (const key of apiCache.keys()) {
    if (regex.test(key)) {
      apiCache.delete(key);
    }
  }
}

export default {
  cacheApiResponse,
  getCachedApiResponse,
  clearCacheEntry,
  clearAllCache,
  batchApiCalls,
  debounceApiCall,
  optimizedApiCall,
  prefetchApiData,
  invalidateCacheByPattern
};