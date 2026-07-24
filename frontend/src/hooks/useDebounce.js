import { useState, useEffect } from 'react';

/**
 * Custom hook to debounce values (e.g. search input fields)
 * @param {any} value - The input value to debounce
 * @param {number} delay - Debounce delay in milliseconds
 * @returns {any} - The debounced value
 */
export function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
