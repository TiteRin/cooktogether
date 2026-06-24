import { useState, useMemo, useEffect } from 'react';

export function useCookingProgress(totalSteps: number, recipeId?: string) {
  const storageKey = recipeId ? `cook-progress-${recipeId}` : null;

  const [completedSteps, setCompletedSteps] = useState<number[]>(() => {
    if (typeof window !== 'undefined' && storageKey) {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error('Failed to parse saved progress', e);
        }
      }
    }
    return [];
  });

  useEffect(() => {
    if (storageKey) {
      localStorage.setItem(storageKey, JSON.stringify(completedSteps));
    }
  }, [completedSteps, storageKey]);

  const toggleStep = (index: number) => {
    setCompletedSteps((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  };

  const progress = useMemo(() => {
    const percentage = totalSteps > 0 
      ? Math.round((completedSteps.length / totalSteps) * 100) 
      : 0;
    return {
      completedSteps,
      percentage,
    };
  }, [completedSteps, totalSteps]);

  return {
    progress,
    toggleStep,
  };
}
