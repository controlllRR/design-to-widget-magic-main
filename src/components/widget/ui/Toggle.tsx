import type { ReactNode } from "react";

interface ToggleProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: ReactNode;
  ariaLabel?: string;
}

/**
 * Pill-toggle: трек ~36×18px с кружком 14px. Цвета — из токенов виджета.
 */
export function Toggle({ checked, onChange, label, ariaLabel }: ToggleProps) {
  return (
    <label
      className="inline-flex items-center cursor-pointer min-w-0"
      style={{ gap: "var(--vf-sp-8)" }}
    >
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={ariaLabel}
        onClick={() => onChange(!checked)}
        className="relative shrink-0 transition-colors"
        style={{
          width: 36,
          height: 18,
          borderRadius: 999,
          backgroundColor: checked
            ? "var(--vf-primary)"
            : "color-mix(in oklab, var(--vf-text) 30%, transparent)",
        }}
      >
        <span
          aria-hidden
          className="absolute top-1/2 -translate-y-1/2 rounded-full transition-all"
          style={{
            left: checked ? 20 : 2,
            width: 14,
            height: 14,
            backgroundColor: "var(--vf-surface)",
            boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
          }}
        />
      </button>
      {label && (
        <span
          className="leading-[1.2]"
          style={{
            fontSize: "var(--vf-fs-13)",
            color: "var(--vf-text)",
            fontWeight: 400,
          }}
        >
          {label}
        </span>
      )}
    </label>
  );
}
