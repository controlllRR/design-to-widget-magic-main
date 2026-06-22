import type { ReactNode } from "react";

export interface RadioOption<T extends string> {
  id: T;
  label: ReactNode;
}

interface RadioRowProps<T extends string> {
  options: RadioOption<T>[];
  value: T;
  onChange: (v: T) => void;
  name: string;
}

/**
 * Группа радио-кнопок в строку. Точка-индикатор использует var(--vf-text).
 */
export function RadioRow<T extends string>({
  options,
  value,
  onChange,
  name,
}: RadioRowProps<T>) {
  return (
    <div
      role="radiogroup"
      className="flex items-center min-w-0 flex-wrap"
      style={{ gap: "var(--vf-sp-16)" }}
    >
      {options.map((opt) => {
        const active = opt.id === value;
        return (
          <label
            key={opt.id}
            className="inline-flex items-center cursor-pointer min-w-0"
            style={{ gap: "var(--vf-sp-6)" }}
          >
            <input
              type="radio"
              name={name}
              value={opt.id}
              checked={active}
              onChange={() => onChange(opt.id)}
              className="sr-only"
            />
            <span
              aria-hidden
              className="rounded-full flex items-center justify-center shrink-0"
              style={{
                width: "clamp(14px, 4.4vw, 16px)",
                height: "clamp(14px, 4.4vw, 16px)",
                border: "1.5px solid var(--vf-text)",
              }}
            >
              {active && (
                <span
                  className="rounded-full"
                  style={{
                    width: "clamp(7px, 2.2vw, 8px)",
                    height: "clamp(7px, 2.2vw, 8px)",
                    backgroundColor: "var(--vf-text)",
                  }}
                />
              )}
            </span>
            <span
              className="leading-[1.2]"
              style={{
                fontSize: "var(--vf-fs-13)",
                color: "var(--vf-text)",
                fontWeight: 400,
              }}
            >
              {opt.label}
            </span>
          </label>
        );
      })}
    </div>
  );
}
