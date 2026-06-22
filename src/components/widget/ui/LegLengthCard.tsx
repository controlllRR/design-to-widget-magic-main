import { X } from "lucide-react";
import { paramCardStyle } from "./paramCard";

interface LegLengthCardProps {
  label: string;
  options: { id: string; label: string }[];
  value: string | null;
  onChange: (id: string | null) => void;
}

/**
 * Карточка «длина ног» — Figma: тёмная пилюля-переключатель,
 * выбранное значение на белом круге внутри бара.
 */
export function LegLengthCard({
  label,
  options,
  value,
  onChange,
}: LegLengthCardProps) {
  return (
    <div className="w-full min-w-0" style={paramCardStyle}>
      <div
        className="flex items-center justify-between gap-3 min-w-0"
        style={{ marginBottom: "var(--vf-sp-16)" }}
      >
        <h3
          className="text-left truncate"
          style={{
            fontFamily: "var(--vf-font-body)",
            fontWeight: 700,
            fontSize: "var(--vf-fs-14)",
            color: "var(--vf-text)",
          }}
        >
          {label}
        </h3>
        <button
          type="button"
          aria-label="сбросить"
          onClick={() => onChange(null)}
          className="flex items-center justify-center shrink-0"
          style={{
            width: 38,
            height: 38,
            borderRadius: 999,
            backgroundColor: "var(--vf-surface)",
          }}
        >
          <X size={18} strokeWidth={2} color="var(--vf-text)" />
        </button>
      </div>

      <div
        role="radiogroup"
        aria-label={label}
        className="flex w-full min-w-0"
        style={{
          backgroundColor: "var(--vf-primary)",
          borderRadius: 999,
          padding: 4,
        }}
      >
        {options.map((opt) => {
          const active = opt.id === value;
          return (
            <button
              key={opt.id}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(opt.id)}
              className="flex flex-1 items-center justify-center min-w-0"
              style={{
                height: "clamp(36px, 10vw, 40px)",
                background: "transparent",
                border: "none",
                padding: 0,
                cursor: "pointer",
              }}
            >
              <span
                className="inline-flex items-center justify-center"
                style={{
                  minWidth: active ? "clamp(36px, 10vw, 40px)" : undefined,
                  height: "clamp(32px, 9vw, 36px)",
                  paddingInline: active ? "var(--vf-sp-12)" : 0,
                  borderRadius: 999,
                  backgroundColor: active ? "var(--vf-surface)" : "transparent",
                  color: active ? "var(--vf-text)" : "var(--vf-on-primary)",
                  fontFamily: "var(--vf-font-body)",
                  fontWeight: active ? 700 : 500,
                  fontSize: "var(--vf-fs-13)",
                  transition: "background-color 0.15s ease, color 0.15s ease",
                  whiteSpace: "nowrap",
                }}
              >
                {opt.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
