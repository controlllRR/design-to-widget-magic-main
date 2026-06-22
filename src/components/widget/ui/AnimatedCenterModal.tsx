import { useEffect, type CSSProperties, type ReactNode } from "react";
import { animatedPhaseClass, useAnimatedMount } from "@/components/widget/ui/useAnimatedMount";

export interface AnimatedCenterModalProps {
  open: boolean;
  onClose?: () => void;
  ariaLabel?: string;
  children: ReactNode;
  panelStyle?: CSSProperties;
  panelClassName?: string;
  backdropClassName?: string;
  zIndex?: number;
  durationMs?: number;
}

/** Центрированный modal (Warning и т.п.) — fade backdrop + scale panel. */
export function AnimatedCenterModal({
  open,
  onClose,
  ariaLabel,
  children,
  panelStyle,
  panelClassName = "",
  backdropClassName = "",
  zIndex = 50,
  durationMs,
}: AnimatedCenterModalProps) {
  const { mounted, phase } = useAnimatedMount(open, durationMs);

  useEffect(() => {
    if (!mounted || !onClose) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mounted, onClose]);

  if (!mounted) return null;

  return (
    <div
      className="absolute inset-0 flex items-center justify-center p-3"
      style={{ zIndex }}
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
    >
      <button
        type="button"
        aria-label="Закрыть"
        onClick={onClose}
        className={`absolute inset-0 ${animatedPhaseClass("vf-anim-backdrop", phase)} ${backdropClassName}`.trim()}
        style={{
          backgroundColor: "color-mix(in oklab, var(--vf-text) 40%, transparent)",
        }}
      />
      <div
        className={`${animatedPhaseClass("vf-anim-modal relative w-full", phase)} ${panelClassName}`.trim()}
        style={panelStyle}
      >
        {children}
      </div>
    </div>
  );
}
