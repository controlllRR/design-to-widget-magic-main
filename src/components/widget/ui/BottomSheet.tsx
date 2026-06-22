import { useEffect, type ReactNode } from "react";
import { useWidgetConfig } from "@/widget/config";
import { PoweredByFooter } from "@/components/widget/PoweredByFooter";

export type BottomSheetSize = "compact" | "medium" | "tall" | "auto";

const SIZE_MAX_HEIGHT: Record<Exclude<BottomSheetSize, "auto">, string> = {
  /** Figma Add your background / Add your pose — 326px @ 812px viewport. */
  compact: "min(326px, 42dvh)",
  /** Figma Edit wardrobe item — 420px. */
  medium: "min(420px, 52dvh)",
  /** Figma profile photo upload with tips — ~78% / 692px expanded. */
  tall: "min(78dvh, 692px)",
};

export type BottomSheetTitleVariant = "sheet" | "dialog";

export interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  ariaLabel: string;
  title?: ReactNode;
  titleVariant?: BottomSheetTitleVariant;
  size?: BottomSheetSize;
  children?: ReactNode;
  footer?: ReactNode;
  scrollBody?: boolean;
  showPoweredBy?: boolean;
}

/** Общий bottom sheet — Figma grabber, radius 24px, тень снизу. */
export function BottomSheet({
  open,
  onClose,
  ariaLabel,
  title,
  titleVariant = "sheet",
  size = "compact",
  children,
  footer,
  scrollBody = false,
  showPoweredBy = true,
}: BottomSheetProps) {
  const { t } = useWidgetConfig();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const titleStyle =
    titleVariant === "dialog"
      ? {
          fontFamily: "var(--vf-font-heading)",
          fontWeight: 700,
          fontSize: "var(--vf-fs-22)",
          lineHeight: 1.15,
          letterSpacing: "0.02em",
          textTransform: "uppercase" as const,
        }
      : {
          fontFamily: "var(--vf-font-heading)",
          fontWeight: 700,
          fontSize: "var(--vf-fs-14)",
          lineHeight: 1.2,
          textTransform: "uppercase" as const,
        };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
      className="absolute inset-0 z-50 flex flex-col"
      style={{ fontFamily: "var(--vf-font-body)" }}
    >
      <button
        type="button"
        aria-label={t.screens.common.close}
        onClick={onClose}
        className="absolute inset-0 w-full h-full"
        style={{ backgroundColor: "rgba(0,0,0,0.18)" }}
      />

      <div
        className="relative mt-auto flex flex-col w-full min-w-0"
        style={{
          backgroundColor: "var(--vf-surface)",
          borderTopLeftRadius: "var(--vf-radius-widget)",
          borderTopRightRadius: "var(--vf-radius-widget)",
          maxHeight: size === "auto" ? undefined : SIZE_MAX_HEIGHT[size],
          boxShadow: "0 -4px 18px rgba(0,0,0,0.12)",
        }}
      >
        <div className="flex items-center justify-center shrink-0" style={{ paddingTop: 10, paddingBottom: 6 }}>
          <span
            aria-hidden
            style={{
              width: 48,
              height: 3,
              borderRadius: 999,
              backgroundColor: "#acafb5",
            }}
          />
        </div>

        {title != null && (
          <div
            className="text-center shrink-0"
            style={{
              paddingInline: "var(--vf-sp-20)",
              paddingBottom: titleVariant === "dialog" ? "var(--vf-sp-12)" : "var(--vf-sp-16)",
            }}
          >
            <h2 style={{ ...titleStyle, color: "var(--vf-text)" }}>{title}</h2>
          </div>
        )}

        {children != null &&
          (scrollBody ? (
            <div
              className="flex-1 min-h-0 overflow-y-auto"
              style={{ paddingInline: "var(--vf-sp-20)", paddingBottom: "var(--vf-sp-12)" }}
            >
              {children}
            </div>
          ) : (
            <div style={{ paddingInline: "var(--vf-sp-20)", paddingBottom: "var(--vf-sp-12)" }}>{children}</div>
          ))}

        {footer}

        {showPoweredBy && <PoweredByFooter />}
      </div>
    </div>
  );
}
