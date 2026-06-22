import { X } from "lucide-react";
import { useEffect, useRef } from "react";
import type { HeightRangeOption } from "@/widget/config";
import { useHorizontalScrollGestures } from "@/lib/useHorizontalScrollGestures";
import { paramCardStyle } from "./paramCard";
import { selectionTileStyle } from "./selectionTile";

interface HeightCardProps {
  /** Заголовок карточки. */
  label: string;
  options: HeightRangeOption[];
  /** id выбранного диапазона или null. */
  value: string | null;
  onChange: (id: string | null) => void;
  /** Префикс «выбрано: » — показывается под рядом. */
  chosenPrefix?: string;
}

/**
 * Карточка «рост».
 * Стиль контейнера, заголовка и отступов унифицирован с ShapePickerCard:
 *  - фон var(--vf-surface-muted), радиус var(--vf-radius-card)
 *  - paddingInline/paddingBlock: var(--vf-sp-20)
 *  - заголовок: 700, var(--vf-fs-14), marginBottom var(--vf-sp-16)
 *
 * Диапазоны выводятся горизонтальным скролл-пикером (snap, без видимого
 * скроллбара), активный — тёмная пилюля. Сброс — крестик в углу заголовка.
 */
export function HeightCard({
  label,
  options,
  value,
  onChange,
  chosenPrefix,
}: HeightCardProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  useHorizontalScrollGestures(scrollRef);

  // авто-скролл к активному элементу при смене значения / при первом рендере
  useEffect(() => {
    const root = scrollRef.current;
    if (!root || !value) return;
    const el = root.querySelector<HTMLElement>(`[data-height-id="${value}"]`);
    if (!el) return;
    const target =
      el.offsetLeft - root.clientWidth / 2 + el.clientWidth / 2;
    root.scrollTo({ left: Math.max(0, target), behavior: "smooth" });
  }, [value]);

  const selected = options.find((o) => o.id === value);

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
        ref={scrollRef}
        role="radiogroup"
        aria-label={label}
        className="flex w-full min-w-0 overflow-x-auto vf-h-scroll"
        style={{
          gap: "var(--vf-sp-8)",
          scrollSnapType: "x mandatory",
          WebkitOverflowScrolling: "touch",
          paddingBottom: 2,
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
              data-height-id={opt.id}
              onClick={() => onChange(opt.id)}
              className="flex items-center justify-center transition-colors shrink-0"
              style={{
                height: "clamp(40px, 11cqw, 44px)",
                paddingInline: "var(--vf-sp-16)",
                ...selectionTileStyle(active, { radius: 999 }),
                fontFamily: "var(--vf-font-body)",
                fontWeight: active ? 700 : 500,
                fontSize: "var(--vf-fs-13)",
                scrollSnapAlign: "center",
                whiteSpace: "nowrap",
              }}
            >
              {opt.label}
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
            {selected?.label ?? ""}
          </span>
        </p>
      )}
    </div>
  );
}
