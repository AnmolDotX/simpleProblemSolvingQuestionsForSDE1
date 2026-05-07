"use client";
import { useState, useEffect, useCallback } from "react";

export function useProgress(storageKey: string) {
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) setCompleted(new Set(JSON.parse(raw)));
    } catch {
      // ignore parse errors
    }
    setIsLoaded(true);
  }, [storageKey]);

  const toggleProgress = useCallback(
    (id: string) => {
      setCompleted((prev) => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        try {
          localStorage.setItem(storageKey, JSON.stringify(Array.from(next)));
        } catch {
          // ignore storage errors
        }
        return next;
      });
    },
    [storageKey]
  );

  return { completed, toggleProgress, isLoaded };
}
