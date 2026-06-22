import { NumberInput } from "./NumberInput";
import { paramCardStyle } from "./paramCard";
import { Slider } from "./Slider";

interface AgeCardProps {
  /** Заголовок карточки, например «возраст (лет)». */
  label: string;
  /** Текущее значение (или null — поле очищено). */
  value: number | null;
  min: number;
  max: number;
  step?: number;
  defaultValue: number;
  onChange: (v: number | null) => void;
}

/**
 * Карточка «возраст».
 * Стиль контейнера, заголовка и отступов унифицирован с ShapePickerCard:
 *  - фон var(--vf-surface-muted), радиус var(--vf-radius-card)
 *  - paddingInline/paddingBlock: var(--vf-sp-20)
 *  - заголовок: 700, var(--vf-fs-14), marginBottom var(--vf-sp-16)
 */
export function AgeCard({
  label,
  value,
  min,
  max,
  step = 1,
  defaultValue,
  onChange,
}: AgeCardProps) {
  const isEmpty = value === null;

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
        <div className="shrink-0" style={{ width: "clamp(86px, 26cqw, 96px)" }}>
          <NumberInput
            value={isEmpty ? "" : value}
            onChange={(v) => {
              if (v === "") onChange(null);
              else onChange(Math.min(max, Math.max(min, Math.round(v))));
            }}
            placeholder="—"
            ariaLabel={label}
            integer
          />
        </div>
      </div>

      <Slider
        value={isEmpty ? defaultValue : value}
        min={min}
        max={max}
        step={step}
        empty={isEmpty}
        onChange={(v) => onChange(v)}
        ariaLabel={label}
      />
    </div>
  );
}
