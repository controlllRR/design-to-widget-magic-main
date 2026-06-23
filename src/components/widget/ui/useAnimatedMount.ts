import { useEffect, useState } from "react";

export type AnimatedPhase = "hidden" | "enter" | "visible" | "exit";

const DEFAULT_MS = 280;

/** Монтирование с enter/exit-фазами для overlay, sheet и modal. */
export function useAnimatedMount(open: boolean, durationMs = DEFAULT_MS) {
  const [phase, setPhase] = useState<AnimatedPhase>(open ? "enter" : "hidden");

  useEffect(() => {
    if (open) {
      setPhase("enter");
      const raf = requestAnimationFrame(() => {
        requestAnimationFrame(() => setPhase("visible"));
      });
      return () => cancelAnimationFrame(raf);
    }

    setPhase((current) => (current === "hidden" ? "hidden" : "exit"));
  }, [open]);

  useEffect(() => {
    if (phase !== "exit") return;
    const timer = window.setTimeout(() => setPhase("hidden"), durationMs);
    return () => window.clearTimeout(timer);
  }, [phase, durationMs]);

  return {
    mounted: phase !== "hidden",
    phase,
  };
}

/** @param base один CSS-класс анимации, без tailwind-утилит. */
export function animatedPhaseClass(base: string, phase: AnimatedPhase): string {
  if (phase === "hidden") return base;
  if (phase === "enter") return `${base} ${base}--from`;
  if (phase === "visible") return `${base} ${base}--active`;
  return `${base} ${base}--to`;
}
