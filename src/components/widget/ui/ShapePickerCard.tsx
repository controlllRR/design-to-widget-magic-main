import type { ComponentType } from "react";
import { useRef } from "react";
import type { SilhouetteProps } from "./silhouettes";
import { useHorizontalScrollGestures } from "@/lib/useHorizontalScrollGestures";
import {
  selectionSpriteIconFilter,
  selectionTileStyle,
} from "./selectionTile";
import { paramCardStyle } from "./paramCard";

export interface ShapePickerOption<T extends string> {
  id: T;
  label: string;
  Icon: ComponentType<SilhouetteProps>;
}

interface ShapePickerCardProps<T extends string> {
  /** Заголовок карточки (например, «телосложение»). */
  title: string;
  /** Префикс «выбрано: ». */
  chosenPrefix: string;
  options: ShapePickerOption<T>[];
  value: T;
  onChange: (id: T) => void;
  ariaLabel?: string;
  /**
   * Если true — рендерит без внешнего фона/паддинга/заголовка,
   * чтобы карточку можно было вкладывать внутрь другого блока
   * (как в дизайне «расширенные параметры»).
   */
  flush?: boolean;
}

/**
 * Карточка-пикер «телосложение» / «размер груди» из Figma 674:4976.
 * Серый фон, заголовок, ряд из N силуэтов, активный — на тёмной плашке
 * с подписью-tooltip снизу. Под рядом — «выбрано: <название>».
 *
 * Все цвета/радиусы/шрифты — через CSS-переменные виджета (var(--vf-*)).
 */
export function ShapePickerCard<T extends string>({
  title,
  chosenPrefix,
  options,
  value,
  onChange,
  ariaLabel,
  flush,
}: ShapePickerCardProps<T>) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  useHorizontalScrollGestures(scrollRef);

  const selected = options.find((o) => o.id === value);

  return (
    <div
      className="w-full min-w-0"
      style={
        flush
          ? undefined
          : paramCardStyle
      }
    >
      {!flush && title && (
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
      )}

      <div
        ref={scrollRef}
        role="radiogroup"
        aria-label={ariaLabel ?? title}
        className="flex w-full min-w-0 overflow-x-auto vf-h-scroll"
        style={{
          gap: "var(--vf-sp-8)",
          scrollSnapType: "x mandatory",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {options.map((opt) => {
          const active = opt.id === value;
          const Icon = opt.Icon;
          return (
            <div
              key={opt.id}
              className="flex flex-col items-center shrink-0"
              style={{ scrollSnapAlign: "start" }}
            >
              <button
                type="button"
                role="radio"
                aria-checked={active}
                aria-label={opt.label}
                onClick={() => onChange(opt.id)}
                className="flex items-center justify-center overflow-hidden transition-colors shrink-0"
                style={{
                  width: "var(--vf-sz-shape-tile)",
                  height: "var(--vf-sz-shape-tile)",
                  ...selectionTileStyle(active, { radius: 14, variant: "muted" }),
                }}
              >
                <Icon
                  style={{
                    display: "block",
                    width: "72%",
                    height: "72%",
                    flexShrink: 0,
                    ...selectionSpriteIconFilter(active),
                  }}
                />
              </button>
            </div>
          );
        })}
      </div>

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
    </div>
  );
}
