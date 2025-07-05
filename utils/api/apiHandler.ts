import { toast } from "@backpackapp-io/react-native-toast";

/**
 * Handles API calls with standardized error management and state control
 * @param apiCallFn - A function that returns the Promise from an API call (fetch, axios, etc.)
 * @param apiCallArgs - Arguments to pass to the apiCallFn
 * @param options - Configuration options for handling the API call
 * @param options.setLoading - Function to update loading state
 * @param options.final - Function called when the API call completes (success or error)
 * @param options.onSuccess - Function called on successful API response
 * @param options.onError - Function called on API error
 * @param options.timeout - Timeout in milliseconds for the API call
 * @param options.retry - Configuration for retrying the API call
 * @param options.retry.maxAttempts - Maximum number of attempts
 * @param options.retry.delayMs - Delay in milliseconds between retries
 * @param options.retry.shouldRetry - Function to determine if a retry should occur
 * @param options.transformResponse - Function to transform the response data
 * @param options.validateStatus - Function to validate the HTTP status
 * @param options.headers - Headers to be sent with the request (should be used within apiCallFn)
 * @param options.authToken - Auth token for the request (should be used within apiCallFn)
 * @param options.showErrorToast - Whether to show an error toast
 * @param options.errorToastDuration - Duration for the error toast
 * @param options.mockData - Mock data to return for testing
 * @param options.cache - Configuration for caching responses
 * @param options.cache.enabled - Whether caching is enabled
 * @param options.cache.key - Custom cache key (defaults if not provided)
 * @param options.cache.ttl - Cache time-to-live in milliseconds
 * @param options.onUploadProgress - Progress handler (should be used within apiCallFn, e.g., for axios)
 * @returns Promise that resolves to the API response data
 */
const handleApiCall = async <T = any, TArgs extends any[] = any[]>(
  apiCallFn: (...args: TArgs) => Promise<any>,
  apiCallArgs: TArgs,
  options?: {
    setLoading?: (loading: boolean) => void;
    final?: () => void;
    onSuccess?: (data: T) => void;
    onError?: (errorCode?: string, message?: string, rawError?: any) => void;
    timeout?: number;
    retry?: {
      maxAttempts: number;
      delayMs: number;
      shouldRetry?: (error: any, attemptNumber: number) => boolean;
    };
    transformResponse?: (data: any) => T;
    validateStatus?: (status: number) => boolean;
    headers?: Record<string, string>; // Note: Should be used when defining apiCallFn
    authToken?: string; // Note: Should be used when defining apiCallFn
    showErrorToast?: boolean;
    errorToastDuration?: number;
    mockData?: T;
    cache?: {
      enabled: boolean;
      key?: string;
      ttl?: number; // Time to live in milliseconds
    };
    onUploadProgress?: (progressEvent: {
      loaded: number;
      total: number;
    }) => void; // Note: Should be used with apiCallFn
  }
): Promise<T | null> => {
  const {
    setLoading,
    final,
    onSuccess,
    onError,
    timeout,
    retry,
    transformResponse,
    validateStatus = (status: number) => status >= 200 && status < 300,
    showErrorToast = false,
    errorToastDuration = 5000, // Default toast duration
    mockData,
    cache,
    // headers, authToken, onUploadProgress are not directly used here
    // but are kept for awareness; they should be used when creating the apiCallFn
  } = options || {};

  // Handle mock data for testing if provided
  if (mockData !== undefined) {
    if (setLoading) setLoading(true);
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300));
    if (setLoading) setLoading(false);
    const finalData = transformResponse
      ? transformResponse(mockData)
      : mockData;
    if (onSuccess) onSuccess(finalData);
    if (final) final();
    return finalData;
  }

  // Cache handling logic
  const cacheKey =
    cache?.key ||
    `api_cache_${encodeURIComponent(apiCallFn.toString())}_${encodeURIComponent(
      JSON.stringify(apiCallArgs)
    )}`; // Include args in key generation
  if (cache?.enabled) {
    try {
      // This is a simplified placeholder for actual cache implementation
      // In a real app, use AsyncStorage, IndexedDB, or another caching solution
      const cachedItem = localStorage.getItem(cacheKey);
      if (cachedItem) {
        const parsedCache = JSON.parse(cachedItem);
        const now = new Date().getTime();
        if (!cache.ttl || now - parsedCache.timestamp < cache.ttl) {
          const finalCachedData = transformResponse
            ? transformResponse(parsedCache.data)
            : parsedCache.data;
          if (onSuccess) onSuccess(finalCachedData);
          // No setLoading(true/false) or final() for cache hits, typically immediate.
          // Or, if you want loading state for cache, adjust accordingly.
          return finalCachedData;
        } else {
          localStorage.removeItem(cacheKey); // Remove expired cache
        }
      }
    } catch (e) {
      console.warn("Cache retrieval failed:", e);
    }
  }

  if (setLoading) {
    setLoading(true);
  }

  let attemptCount = 0;
  const maxAttempts = retry?.maxAttempts || 1;
  const retryDelayMs = retry?.delayMs || 1000;

  try {
    while (attemptCount < maxAttempts) {
      attemptCount++;
      try {
        let timeoutId: NodeJS.Timeout | null = null;
        const apiPromise = apiCallFn(...apiCallArgs); // Pass arguments to the function

        const effectivePromise = new Promise<any>(async (resolve, reject) => {
          // Setup timeout if specified
          if (timeout) {
            timeoutId = setTimeout(() => {
              reject({
                code: "TIMEOUT",
                message: `Request timed out after ${timeout}ms (attempt ${attemptCount})`,
              });
            }, timeout);
          }

          try {
            const result = await apiPromise;
            resolve(result);
          } catch (err) {
            reject(err);
          } finally {
            if (timeoutId) clearTimeout(timeoutId);
          }
        });

        const response = await effectivePromise;

        let rawData: any;
        let responseStatus: number | undefined;

        if (response) {
          // Handle fetch API response
          if (
            response.json &&
            typeof response.json === "function" &&
            typeof response.status === "number"
          ) {
            responseStatus = response.status;
            if (!validateStatus(response.status)) {
              let errorData;
              try {
                errorData = await response.json();
              } catch (e) {
                errorData = { message: response.statusText || "Unknown error" };
              }
              throw {
                status: response.status,
                code: errorData?.code || response.status.toString(),
                message:
                  errorData?.message || response.statusText || "Unknown error",
                data: errorData,
                isFetchError: true,
              };
            }
            rawData = await response.json();
          }
          // Handle axios response (data is typically in response.data, status in response.status)
          else if (
            response.data !== undefined &&
            typeof response.status === "number"
          ) {
            responseStatus = response.status;
            if (!validateStatus(response.status)) {
              throw {
                status: response.status,
                code: response.data?.code || response.status?.toString(),
                message:
                  response.data?.message ||
                  response.statusText ||
                  "Server error",
                data: response.data,
                isAxiosError: true, // To identify it if needed
              };
            }
            rawData = response.data;
          }
          // Handle direct data response or other promise resolutions
          else {
            rawData = response;
          }

          const finalData = transformResponse
            ? transformResponse(rawData)
            : (rawData as T);

          if (cache?.enabled) {
            try {
              const itemToCache = {
                data: finalData,
                timestamp: new Date().getTime(),
              };
              localStorage.setItem(cacheKey, JSON.stringify(itemToCache));
            } catch (e) {
              console.warn("Cache storage failed:", e);
            }
          }

          if (onSuccess) {
            onSuccess(finalData);
          }
          return finalData;
        }
        return null; // Should ideally not happen if apiCallFn resolves with a value
      } catch (error: any) {
        // If this is the last attempt or shouldRetry returns false, throw to outer catch
        if (
          attemptCount >= maxAttempts ||
          (retry?.shouldRetry && !retry.shouldRetry(error, attemptCount))
        ) {
          throw error; // Propagate error to the main catch block
        }
        console.warn(
          `Attempt ${attemptCount} failed. Retrying in ${retryDelayMs}ms...`,
          error.message || error
        );
        await new Promise((resolve) => setTimeout(resolve, retryDelayMs));
      }
    }
    // This part should not be reached if maxAttempts > 0 due to throw/return in loop
    return null;
  } catch (error: any) {
    let errorCode: string | undefined;
    let errorMessage: string | undefined;

    if (error) {
      // **FIXED LOGIC STARTS HERE**
      // Prioritize checking for error.response, which contains the server's reply.
      // This is the standard and most reliable way to handle Axios HTTP errors.
      if (error.response) {
        const responseData = error.response.data; // The JSON payload from your server
        const responseStatus = error.response.status;

        // Extract the specific message from the server's JSON response
        errorMessage = responseData?.message || error.message || "Server error";

        errorCode =
          responseData?.code ||
          responseStatus?.toString() ||
          error.code || // Fallback to Axios code (e.g., 'ERR_BAD_REQUEST')
          "SERVER_ERROR";
      } else if (error.request) {
        // The request was made but no response was received (e.g., network error)
        errorCode = "NETWORK_ERROR";
        errorMessage = "Network request failed. Please check your connection.";
      } else if (error.code === "TIMEOUT") {
        // Custom timeout error from within our handler
        errorCode = error.code;
        errorMessage = error.message;
      } else {
        // Any other error (e.g., a setup error in the request, or a plain JS error)
        errorCode = error.code || "UNKNOWN_ERROR";
        errorMessage =
          error.message ||
          (typeof error === "string" ? error : "Unknown error occurred");
      }
    } else {
      errorCode = "UNKNOWN_ERROR";
      errorMessage = "Unknown error occurred";
    }

    if (showErrorToast) {
      // Replace with your actual toast notification mechanism
      toast.error(errorMessage || "", { duration: errorToastDuration });
    }

    if (onError) {
      onError(errorCode, errorMessage, error);
    }

    return null;
  } finally {
    if (setLoading) {
      setLoading(false);
    }
    if (final) {
      final();
    }
  }
};

export default handleApiCall;
