import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Reusable hook to handle api calls with loading, error, data state and auto-cleanup
 * @param {Function} apiFunction - Async function that performs the network request. Receives (signal) as argument.
 * @param {boolean} immediate - Whether to fetch immediately on mount
 * @returns {Object} - { data, loading, error, execute, setData }
 */
export function useFetch(apiFunction, immediate = true) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);
  
  const apiRef = useRef(apiFunction);
  apiRef.current = apiFunction;
  
  const abortControllerRef = useRef(null);

  const execute = useCallback(async () => {
    // Abort previous call if still active
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // Create new abort controller
    const controller = new AbortController();
    abortControllerRef.current = controller;
    
    setLoading(true);
    setError(null);
    
    try {
      // Execute passed service function, supplying the abort signal
      const result = await apiRef.current(controller.signal);
      setData(result);
      setLoading(false);
      return result;
    } catch (err) {
      if (err.name === 'AbortError' || err.name === 'CanceledError') {
        // Ignored, since request was cancelled intentionally
        return;
      }
      setError(err.customMessage || err.message || 'An error occurred while fetching data.');
      setLoading(false);
      throw err;
    }
  }, []);

  // Cleanup effect
  useEffect(() => {
    if (immediate) {
      execute().catch(() => {}); // suppress unhandled rejections from execute
    }
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [immediate, execute]);

  return { data, loading, error, execute, setData };
}
export default useFetch;
