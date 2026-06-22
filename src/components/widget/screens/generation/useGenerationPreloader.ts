import { useCallback, useEffect, useRef, useState } from "react";

/** Длительность оверлея «примерка» — как в прототипе / Figma preloader. */
export const GENERATION_LOADER_MS = 1200;

export function useGenerationPreloader() {
  const [isGenerating, setIsGenerating] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = useCallback(() => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const startGenerating = useCallback(() => {
    clearTimer();
    setIsGenerating(true);
    timeoutRef.current = window.setTimeout(() => {
      setIsGenerating(false);
      timeoutRef.current = null;
    }, GENERATION_LOADER_MS);
  }, [clearTimer]);

  useEffect(() => () => clearTimer(), [clearTimer]);

  return { isGenerating, startGenerating };
}
