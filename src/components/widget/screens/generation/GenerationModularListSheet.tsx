import { X, type LucideIcon } from "lucide-react";
import { useEffect, type ReactNode } from "react";
import { useWidgetConfig } from "@/widget/config";
import { PoweredByFooter } from "@/components/widget/PoweredByFooter";

export interface ModularListItem {
  id: string;
  label: string;
  icon: LucideIcon;
  onClick: () => void;
}

/** Bottom list — Figma `732:3913` List-more / `732:4119` List-Share. */
export function GenerationModularListSheet({
  open,
  title,
  items,
  onClose,
  footer,
}: {
  open: boolean;
  title: string;
  items: ModularListItem[];
  onClose: () => void;
  footer?: ReactNode;
}) {
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

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
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
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          boxShadow: "0 -4px 18px rgba(0,0,0,0.12)",
        }}
      >
        <div
          className="flex items-center shrink-0"
          style={{
            gap: 5,
            padding: "16px 20px",
            borderBottom: "1px solid #f5f5f5",
          }}
        >
          <h2
            className="flex-1 min-w-0 uppercase"
            style={{
              fontFamily: "var(--vf-font-heading)",
              fontWeight: 700,
              fontSize: "var(--vf-fs-14)",
              lineHeight: 1.2,
              color: "var(--vf-text)",
            }}
          >
            {title}
          </h2>
          <button
            type="button"
            aria-label={t.screens.common.close}
            onClick={onClose}
            className="flex items-center justify-center shrink-0"
            style={{
              width: 22,
              height: 22,
              borderRadius: 20,
              backgroundColor: "#f5f5f5",
            }}
          >
            <X size={16} strokeWidth={1.5} />
          </button>
        </div>

        <div className="flex flex-col">
          {items.map(({ id, label, icon: Icon, onClick }) => (
            <button
              key={id}
              type="button"
              onClick={onClick}
              className="flex items-center w-full text-left hover:bg-neutral-50"
              style={{ gap: 16, padding: "16px 20px", minHeight: 54 }}
            >
              <Icon size={22} strokeWidth={1.5} style={{ color: "var(--vf-text)", shrink: 0 }} />
              <span
                className="lowercase"
                style={{
                  fontSize: 18,
                  fontWeight: 400,
                  lineHeight: 1.2,
                  letterSpacing: "0.09em",
                  color: "var(--vf-text)",
                }}
              >
                {label}
              </span>
            </button>
          ))}
        </div>

        {footer}
        <PoweredByFooter />
      </div>
    </div>
  );
}
