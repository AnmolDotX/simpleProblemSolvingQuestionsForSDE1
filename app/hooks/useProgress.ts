"use client";
import { useState, useEffect } from "react";

export function useProgress(storageKey: string) {
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setCompleted(new Set(JSON.parse(saved)));
      }
    } catch (e) {
      console.error("Error reading localStorage", e);
    }
    setIsLoaded(true);
  }, [storageKey]);

  const toggleProgress = (id: string) => {
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      localStorage.setItem(storageKey, JSON.stringify(Array.from(next)));
      return next;
    });
  };

  return { completed, toggleProgress, isLoaded };
}
