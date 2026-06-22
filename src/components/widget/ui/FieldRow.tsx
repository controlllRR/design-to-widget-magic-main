import type { ReactNode } from "react";
import { Slider } from "./Slider";
import { NumberInput } from "./NumberInput";

interface FieldRowProps {
  label: string;
  value: number | "";
  min: number;
  max: number;
  step?: number;
  onChange: (v: number | "") => void;
  unit?: string;
  /** Ссылка «как определить размер». */
  hint?: boolean;
  hintLabel?: string;
  onHintClick?: () => void;
  invalid?: boolean;
  children?: ReactNode;
}

/**
 * Универсальный ряд: лейбл + NumberInput справа, Slider под ними, опц. hint-link.
 * Используется для возраст/рост/грудь/талия/обхват бёдер и т.д.
 */
export function FieldRow({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  hint,
  hintLabel,
  onHintClick,
  invalid,
}: FieldRowProps) {
  const numeric = typeof value === "number" ? value : (min + max) / 2;
  const isEmpty = value === "" || value === undefined;

  return (
    <div
      className="flex flex-col w-full min-w-0"
      style={{
        gap: "var(--vf-sp-12)",
        padding: invalid ? "var(--vf-sp-16)" : 0,
        borderRadius: invalid ? "var(--vf-radius-card)" : undefined,
        border: invalid ? "1px solid var(--vf-error, #e63946)" : undefined,
      }}
    >
      <div className="flex items-center justify-between w-full min-w-0" style={{ gap: "var(--vf-sp-12)" }}>
        <span
          className="flex-1 min-w-0"
          style={{
            fontFamily: "var(--vf-font-body)",
            fontSize: "var(--vf-fs-13)",
            fontWeight: 500,
            color: "var(--vf-text)",
            lineHeight: 1.25,
            wordBreak: "break-word",
          }}
        >
          {label}
        </span>
        <div className="shrink-0" style={{ width: "clamp(86px, 26cqw, 96px)" }}>
          <NumberInput
            value={value}
            onChange={onChange}
            invalid={invalid}
            ariaLabel={label}
          />
        </div>
      </div>
      <Slider
        value={numeric}
        min={min}
        max={max}
        step={step}
        onChange={(v) => onChange(v)}
        ariaLabel={label}
        empty={isEmpty}
        accent={invalid ? "var(--vf-error, #e63946)" : undefined}
      />
      {hint && (
        <button
          type="button"
          onClick={onHintClick}
          className="self-start text-left underline underline-offset-2"
          style={{
            fontFamily: "var(--vf-font-body)",
            fontSize: "var(--vf-fs-12)",
            fontWeight: 400,
            color: "color-mix(in oklab, var(--vf-text) 70%, transparent)",
          }}
        >
          {hintLabel ?? "как определить размер"}
        </button>
      )}
    </div>
  );
}
