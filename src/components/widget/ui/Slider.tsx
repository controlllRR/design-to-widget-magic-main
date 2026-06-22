import { useId, type ChangeEvent } from "react";

interface SliderProps {
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  ariaLabel?: string;
  /** Прогресс не отображать (вариант 0%-стейта). */
  empty?: boolean;
  /** Цвет «состояния», подменяет основной (например для invalid-карточек). */
  accent?: string;
}

/**
 * Тонкий слайдер по дизайну Figma:
 *  - линия 1px, заполненная часть — текущим текстовым цветом;
 *  - круглый ползунок 16px (var(--vf-text)) с лёгкой тенью.
 * Все размеры и цвета — fluid/токенные. Ничего не хардкодится.
 */
export function Slider({
  value,
  min,
  max,
  step = 1,
  onChange,
  ariaLabel,
  empty,
  accent,
}: SliderProps) {
  const id = useId();
  const pct = empty
    ? 0
    : Math.min(
        100,
        Math.max(0, ((value - min) / Math.max(1e-9, max - min)) * 100),
      );
  const color = accent ?? "var(--vf-text)";

  return (
    <div className="relative w-full min-w-0" style={{ height: "var(--vf-sz-22)" }}>
      <div
        aria-hidden
        className="absolute left-0 right-0 rounded-full"
        style={{
          top: "50%",
          transform: "translateY(-50%)",
          height: 1,
          backgroundColor: "color-mix(in oklab, var(--vf-text) 20%, transparent)",
        }}
      />
      <div
        aria-hidden
        className="absolute left-0 rounded-full vf-slider-fill"
        style={{
          top: "50%",
          transform: "translateY(-50%)",
          height: 2,
          width: `${pct}%`,
          backgroundColor: color,
        }}
      />
      <div
        aria-hidden
        className="absolute rounded-full pointer-events-none vf-slider-thumb"
        style={{
          top: "50%",
          left: `${pct}%`,
          transform: "translate(-50%, -50%)",
          width: "clamp(14px, 4.4cqw, 16px)",
          height: "clamp(14px, 4.4cqw, 16px)",
          backgroundColor: color,
          boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
        }}
      />
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-label={ariaLabel}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          onChange(Number(e.target.value))
        }
        className="absolute inset-0 w-full h-full cursor-pointer opacity-0"
      />
    </div>
  );
}
