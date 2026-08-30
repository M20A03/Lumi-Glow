/**
 * Resilient HTTP Fetcher with Exponential Backoff, Timeout, and Offline Cache
 * LumiGlow SRE Architecture
 */

// Simple event bus for dispatching global UI toasts from fetcher
export function emitGlobalToast(message, type = 'info') {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('lumiglow-toast', {
      detail: { message, type, timestamp: Date.now() }
    }));
  }
}

/**
 * Enhanced fetch with timeout support via AbortController
 */
export async function fetchWithTimeout(url, options = {}, timeoutMs = 8000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    if (error.name === 'AbortError') {
      throw new Error(`Request timeout: The server took longer than ${timeoutMs / 1000}s to respond.`);
    }
    throw error;
  }
}

/**
 * Resilient fetcher with exponential backoff retry and error handling
 */
export async function resilientFetch(url, options = {}, config = {}) {
  const {
    retries = 3,
    backoffMs = 500,
    timeoutMs = 8000,
    cacheKey = null,
    cacheTTLMs = 1000 * 60 * 15, // 15 minutes
    showErrorToast = true,
  } = config;

  // Stale-While-Revalidate: Check cache if offline or cacheKey provided
  if (cacheKey && typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem(`lg_cache_${cacheKey}`);
      if (cached) {
        const { timestamp, data } = JSON.parse(cached);
        const isFresh = Date.now() - timestamp < cacheTTLMs;
        if (isFresh || !navigator.onLine) {
          // If offline or fresh, return cached immediately
          return data;
        }
      }
    } catch {
      // Ignore cache parse failures
    }
  }

  let attempt = 0;
  let delay = backoffMs;

  while (attempt <= retries) {
    try {
      const response = await fetchWithTimeout(url, options, timeoutMs);

      // Handle Authentication & Authorization errors
      if (response.status === 401) {
        emitGlobalToast('Your session has expired. Please sign in again.', 'warning');
        if (typeof window !== 'undefined') {
          localStorage.removeItem('lumiglow-user-token');
          window.dispatchEvent(new CustomEvent('lumiglow-auth-logout'));
        }
        throw new Error('Unauthorized (401)');
      }

      if (response.status === 403) {
        emitGlobalToast('Access denied: You do not have permission to view this resource.', 'error');
        throw new Error('Forbidden (403)');
      }

      if (response.status >= 500) {
        throw new Error(`Server Error (${response.status})`);
      }

      if (!response.ok) {
        throw new Error(`HTTP Error (${response.status})`);
      }

      const data = await response.json();

      // Update cache
      if (cacheKey && typeof window !== 'undefined') {
        try {
          localStorage.setItem(`lg_cache_${cacheKey}`, JSON.stringify({
            timestamp: Date.now(),
            data,
          }));
        } catch {
          // LocalStorage quota handling
        }
      }

      return data;
    } catch (err) {
      attempt++;

      if (attempt > retries) {
        if (showErrorToast) {
          const userMsg = !navigator.onLine
            ? 'You are offline. Displaying cached data where available.'
            : (err.message || 'Unable to connect to service. Please try again.');
          emitGlobalToast(userMsg, 'error');
        }

        // Return stale cache if available
        if (cacheKey && typeof window !== 'undefined') {
          try {
            const cached = localStorage.getItem(`lg_cache_${cacheKey}`);
            if (cached) {
              const { data } = JSON.parse(cached);
              return data;
            }
          } catch {
            // Ignore
          }
        }

        throw err;
      }

      // Wait exponential backoff before retry (e.g. 500ms -> 1000ms -> 2000ms with jitter)
      const jitter = Math.random() * 200;
      await new Promise(resolve => setTimeout(resolve, delay + jitter));
      delay *= 2;
    }
  }
}

/**
 * Safe JSON parser with fallback
 */
export function safeJsonParse(jsonString, fallback = null) {
  if (!jsonString) return fallback;
  try {
    return JSON.parse(jsonString);
  } catch {
    return fallback;
  }
}
