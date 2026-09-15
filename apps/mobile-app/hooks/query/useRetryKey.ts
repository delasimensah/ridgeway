import { useCallback, useState } from "react";

export function useRetryKey() {
  const [retryKey, setRetryKey] = useState(0);
  const onRetry = useCallback(() => {
    setRetryKey((key) => key + 1);
  }, []);

  return { retryKey, onRetry };
}
