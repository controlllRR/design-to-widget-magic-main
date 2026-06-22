import { useEffect, type CSSProperties, type ReactNode } from "react";
import { useWidgetConfig } from "@/widget/config";
import { animatedPhaseClass, useAnimatedMount } from "@/components/widget/ui/useAnimatedMount";

export interface AnimatedSheetShellProps {
  open: boolean;
  onClose: () => void;
  ariaLabel: string;
  children: ReactNode;
  panelClassName?: string;
  panelStyle?: CSSProperties;
  zIndex?: number;
  durationMs?: number;
}

/** Bottom sheet с анимацией backdrop + slide-up panel. */
export function AnimatedSheetShell({
  open,
  onClose,
  ariaLabel,
  children,
  panelClassName = "",
  panelStyle,
  zIndex = 50,
  durationMs,
}: AnimatedSheetShellProps) {
  const { t } = useWidgetConfig();
  const { mounted, phase } = useAnimatedMount(open, durationMs);

  useEffect(() => {
    if (!mounted) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mounted, onClose]);

  if (!mounted) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
      className="absolute inset-0 flex flex-col"
      style={{ zIndex, fontFamily: "var(--vf-font-body)" }}
    >
      <button
        type="button"
        aria-label={t.screens.common.close}
        onClick={onClose}
        className={`absolute inset-0 w-full h-full ${animatedPhaseClass("vf-anim-backdrop", phase)}`}
        style={{ backgroundColor: "rgba(0,0,0,0.18)" }}
      />

      <div
        className={`${animatedPhaseClass(
          "vf-anim-sheet relative mt-auto flex flex-col w-full min-w-0",
          phase,
        )} ${panelClassName}`.trim()}
        style={panelStyle}
      >
        {children}
      </div>
    </div>
  );
}
