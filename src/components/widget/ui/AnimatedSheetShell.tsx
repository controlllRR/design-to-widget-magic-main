import { useEffect, type CSSProperties, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useWidgetConfig } from "@/widget/config";
import { useWidgetOverlayRoot } from "@/widget/WidgetOverlayContext";
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
  const overlayRoot = useWidgetOverlayRoot();
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

  const sheet = (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
      className="absolute inset-0 flex flex-col pointer-events-auto"
      style={{ zIndex, fontFamily: "var(--vf-font-body)" }}
    >
      <button
        type="button"
        aria-label={t.screens.common.close}
        onClick={onClose}
        className={`absolute inset-0 w-full h-full z-0 ${animatedPhaseClass("vf-anim-backdrop", phase)}`}
        style={{ backgroundColor: "rgba(0,0,0,0.18)" }}
      />

      <div
        className={`relative z-10 mt-auto flex flex-col w-full min-w-0 ${animatedPhaseClass(
          "vf-anim-sheet",
          phase,
        )} ${panelClassName}`.trim()}
        style={panelStyle}
      >
        {children}
      </div>
    </div>
  );

  if (overlayRoot) {
    return createPortal(sheet, overlayRoot);
  }

  return sheet;
}
