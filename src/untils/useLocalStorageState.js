import { useState, useEffect } from "react";

function useLocalStorageState(key, defaultValue) {
  const [value, setValue] = useState(() => {
    if (typeof window === "undefined") {
      return defaultValue;
    }

    const storedValue = window.localStorage.getItem(key);
    if (storedValue === null) {
      return defaultValue;
    }

    try {
      return JSON.parse(storedValue);
    } catch {
      return storedValue;
    }
  });

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // ignore write errors
    }
  }, [key, value]);

  return [value, setValue];
}

export default useLocalStorageState;
