import { useCallback, useEffect, useState } from "react";
import { readStoredList, writeStoredList } from "../utils/storage";

export function useStoredList<T>(key: string, fallback: T[]) {
  const [items, setItems] = useState<T[]>(() =>
    readStoredList<T>(key, fallback)
  );

  useEffect(() => {
    const syncItems = () => {
      setItems(readStoredList<T>(key, fallback));
    };

    const handleCustomSync = (event: Event) => {
      const storageEvent = event as CustomEvent<{ key?: string }>;
      if (!storageEvent.detail?.key || storageEvent.detail.key === key) {
        syncItems();
      }
    };

    window.addEventListener("storage", syncItems);
    window.addEventListener("flowpilot:storage", handleCustomSync);

    return () => {
      window.removeEventListener("storage", syncItems);
      window.removeEventListener("flowpilot:storage", handleCustomSync);
    };
  }, [fallback, key]);

  const updateItems = useCallback(
    (nextItems: T[] | ((currentItems: T[]) => T[])) => {
      setItems((currentItems) => {
        const resolvedItems =
          typeof nextItems === "function"
            ? (nextItems as (currentItems: T[]) => T[])(currentItems)
            : nextItems;

        writeStoredList(key, resolvedItems);
        return resolvedItems;
      });
    },
    [key]
  );

  return [items, updateItems] as const;
}
