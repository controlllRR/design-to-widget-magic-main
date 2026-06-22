import { X } from "lucide-react";
import {
  useId,
  useState,
  type ChangeEvent,
  type CSSProperties,
  type FocusEvent,
} from "react";

export type NumberInputState =
  | "default"
  | "focus"
  | "filled"
  | "focus-filled"
  | "readonly"
  | "invalid";

interface NumberInputProps {
  value: number | "";
  onChange: (v: number | "") => void;
  placeholder?: string;
  readOnly?: boolean;
  invalid?: boolean;
  ariaLabel?: string;
  onClear?: () => void;
  /** Только целые числа (возраст и т.п.). */
  integer?: boolean;
}

/**
 * Pill-инпут по дизайну Figma — компактное скругл. поле с числом и крестиком.
 * Состояния:
 *  - default     — белый фон, плейсхолдер
 *  - focus       — белый фон + тонкая граница var(--vf-text)
 *  - filled      — белый фон, есть значение, виден крестик
 *  - focus-filled— filled + рамка
 *  - readonly    — серый фон, value тусклый
 *  - invalid     — рамка var(--vf-error), всегда видна
 */
export function NumberInput({
  value,
  onChange,
  placeholder = "00",
  readOnly,
  invalid,
  ariaLabel,
  onClear,
  integer,
}: NumberInputProps) {
  const id = useId();
  const [focused, setFocused] = useState(false);

  const filled = value !== "" && value !== undefined;
  const showClear = filled && !readOnly;

  const borderColor = invalid
    ? "var(--vf-error, #e63946)"
    : focused
      ? "var(--vf-text)"
      : "transparent";

  const bg = readOnly
    ? "color-mix(in oklab, var(--vf-text) 24%, var(--vf-surface))"
    : "var(--vf-surface)";

  const valueColor = readOnly
    ? "color-mix(in oklab, var(--vf-text) 50%, transparent)"
    : "var(--vf-text)";

  const wrapStyle: CSSProperties = {
    backgroundColor: bg,
    border: `1px solid ${borderColor}`,
    borderRadius: 999,
    height: "clamp(32px, 9.6cqw, 36px)",
    paddingInline: "var(--vf-sp-12)",
  };

  return (
    <label
      htmlFor={id}
      className="inline-flex items-center justify-end gap-[6px] min-w-0"
      style={wrapStyle}
    >
      <input
        id={id}
        type="text"
        inputMode={integer ? "numeric" : "decimal"}
        readOnly={readOnly}
        aria-label={ariaLabel}
        aria-invalid={invalid || undefined}
        placeholder={placeholder}
        value={value === "" || value === undefined ? "" : String(value)}
        onFocus={(_: FocusEvent<HTMLInputElement>) => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          const raw = integer
            ? e.target.value.replace(/\D/g, "")
            : e.target.value.replace(",", ".").replace(/[^\d.]/g, "");
          if (raw === "") onChange("");
          else {
            const n = Number(raw);
            if (!Number.isNaN(n)) onChange(n);
          }
        }}
        className="w-full bg-transparent outline-none text-right tabular-nums"
        style={{
          color: filled ? valueColor : "color-mix(in oklab, var(--vf-text) 40%, transparent)",
          fontFamily: "var(--vf-font-body)",
          fontSize: "var(--vf-fs-13)",
          fontWeight: 500,
          minWidth: 36,
        }}
      />
      {showClear && (
        <button
          type="button"
          aria-label="Очистить"
          onClick={(e) => {
            e.preventDefault();
            onChange("");
            onClear?.();
          }}
          className="flex items-center justify-center shrink-0"
          style={{ width: 18, height: 18 }}
        >
          <X
            strokeWidth={1.5}
            style={{ width: 14, height: 14, color: "var(--vf-text)" }}
          />
        </button>
      )}
    </label>
  );
}
