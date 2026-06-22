import { useRef } from "react";
import { useHorizontalScrollGestures } from "@/lib/useHorizontalScrollGestures";
import { paramCardStyle } from "./paramCard";
import { selectionTileStyle } from "./selectionTile";

interface SizePickerProps {
  title: string;
  options: string[];
  value: string | null;
  onChange: (v: string) => void;
  /** Форма «таблетки»: круг (для размеров одежды XS/S/M…) или скруглённый квадрат (для размеров обуви). */
  shape?: "circle" | "square";
  ariaLabel?: string;
  /** Префикс «выбрано: » — показывается под рядом, как в ShapePickerCard. */
  chosenPrefix?: string;
}

/**
 * Унифицированный пикер размеров (одежды/обуви).
 *
 * Дизайн соответствует ShapePickerCard (карточка «размер груди»):
 *  - тот же контейнер: var(--vf-surface-muted), радиус var(--vf-radius-card), paddingInline 20px
 *  - тот же заголовок: var(--vf-font-body), 700, var(--vf-fs-14), без uppercase
 *  - под рядом — строка «выбрано: <значение>»
 *
 * Чтобы блок был компактным, размеры выводятся в один ряд с горизонтальной прокруткой
 * (без видимого скроллбара, со снаппингом и тач-инерцией).
 */
export function SizePicker({
  title,
  options,
  value,
  onChange,
  shape = "circle",
  ariaLabel,
  chosenPrefix,
}: SizePickerProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  useHorizontalScrollGestures(scrollRef);

  const radius = shape === "circle" ? 999 : 12;
  const itemSize =
    shape === "circle" ? "clamp(40px, 11vw, 44px)" : "clamp(44px, 12vw, 48px)";

  return (
    <div className="w-full min-w-0" style={paramCardStyle}>
      <h3
        className="text-left"
        style={{
          fontFamily: "var(--vf-font-body)",
          fontWeight: 700,
          fontSize: "var(--vf-fs-14)",
          color: "var(--vf-text)",
          marginBottom: "var(--vf-sp-16)",
        }}
      >
        {title}
      </h3>

      <div
        ref={scrollRef}
        role="radiogroup"
        aria-label={ariaLabel ?? title}
        className="flex w-full min-w-0 overflow-x-auto vf-h-scroll"
        style={{
          gap: "var(--vf-sp-8)",
          scrollSnapType: "x mandatory",
          WebkitOverflowScrolling: "touch",
          paddingBottom: 2,
        }}
      >
        {options.map((opt) => {
          const active = opt === value;
          return (
            <button
              key={opt}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(opt)}
              className="flex items-center justify-center transition-colors shrink-0"
              style={{
                width: itemSize,
                height: itemSize,
                ...selectionTileStyle(active, { radius }),
                fontFamily: "var(--vf-font-body)",
                fontWeight: active ? 700 : 500,
                fontSize: "var(--vf-fs-13)",
                scrollSnapAlign: "start",
              }}
            >
              <span className="truncate px-1">{opt}</span>
            </button>
          );
        })}
      </div>

      {chosenPrefix !== undefined && (
        <p
          className="text-left"
          style={{
            marginTop: "var(--vf-sp-16)",
            fontFamily: "var(--vf-font-body)",
            fontSize: "var(--vf-fs-13)",
            color: "color-mix(in oklab, var(--vf-text) 75%, transparent)",
          }}
        >
          {chosenPrefix}
          <span style={{ color: "var(--vf-text)", fontWeight: 500 }}>
            {value ?? ""}
          </span>
        </p>
      )}
    </div>
  );
}
