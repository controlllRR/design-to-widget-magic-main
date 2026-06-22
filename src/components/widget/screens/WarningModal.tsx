import { X } from "lucide-react";
import { useWidgetConfig } from "@/widget/config";
import { WarningTriangleIcon } from "@/components/widget/screens/WarningTriangleIcon";

export interface WarningModalProps {
  open: boolean;
  title?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

const WARNING_TOP_BG = "#343537";
const WARNING_BOTTOM_BG = "#f5f5f5";

const warningActionStyle = {
  height: "var(--vf-sz-46)",
  borderRadius: "var(--vf-radius-button)",
  fontFamily: "var(--vf-font-body)",
  fontSize: "var(--vf-fs-12)",
  fontWeight: 800,
  letterSpacing: "0.09em",
  textTransform: "uppercase" as const,
};

/** Pop-Up Warning — Figma `728:3667` / `1159:15847`. */
export function WarningModal({
  open,
  title,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
}: WarningModalProps) {
  const { t } = useWidgetConfig();
  const w = t.screens.warnings.clearOutfit;
  const resolvedTitle = title ?? w.title;
  const resolvedConfirm = confirmLabel ?? w.confirm;
  const resolvedCancel = cancelLabel ?? w.cancel;

  if (!open) return null;

  return (
    <div
      className="absolute inset-0 z-50 flex items-center justify-center p-3"
      style={{
        backgroundColor: "color-mix(in oklab, var(--vf-text) 40%, transparent)",
      }}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full overflow-hidden"
        style={{
          maxWidth: 351,
          borderRadius: 16,
        }}
      >
        <div
          className="relative flex flex-col items-center text-center"
          style={{
            paddingTop: 6,
            paddingInline: 6,
            paddingBottom: 22,
            backgroundColor: WARNING_TOP_BG,
            color: "#ffffff",
          }}
        >
          <button
            type="button"
            aria-label={t.screens.common.close}
            onClick={onCancel}
            className="absolute flex items-center justify-center"
            style={{
              top: 6,
              right: 6,
              width: 22,
              height: 22,
              borderRadius: 20,
              backgroundColor: WARNING_BOTTOM_BG,
            }}
          >
            <X size={14} strokeWidth={1.5} style={{ color: WARNING_TOP_BG }} />
          </button>

          <div
            className="flex flex-col items-center"
            style={{
              gap: "var(--vf-sp-12)",
              paddingTop: 6,
              paddingInline: 32,
              paddingBottom: 6,
              maxWidth: 275,
            }}
          >
            <WarningTriangleIcon size={32} />
            <p
              className="uppercase leading-snug"
              style={{
                fontFamily: "var(--vf-font-heading)",
                fontSize: "var(--vf-fs-14)",
                fontWeight: 700,
                lineHeight: 1.4,
                letterSpacing: "0.01em",
              }}
            >
              {resolvedTitle}
            </p>
          </div>
        </div>

        <div
          className="flex"
          style={{
            gap: "var(--vf-sp-12)",
            padding: "var(--vf-sp-24)",
            backgroundColor: WARNING_BOTTOM_BG,
          }}
        >
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 min-w-0"
            style={{
              ...warningActionStyle,
              backgroundColor: WARNING_TOP_BG,
              color: "#ffffff",
            }}
          >
            {resolvedConfirm}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 min-w-0"
            style={{
              ...warningActionStyle,
              backgroundColor: "transparent",
              color: WARNING_TOP_BG,
              border: `1px solid ${WARNING_TOP_BG}`,
            }}
          >
            {resolvedCancel}
          </button>
        </div>
      </div>
    </div>
  );
}
