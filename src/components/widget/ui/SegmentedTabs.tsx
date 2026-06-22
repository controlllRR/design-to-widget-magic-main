import type { CSSProperties, ReactNode } from "react";

export interface SegmentedTabItem<T extends string> {
  id: T;
  label: ReactNode;
  disabled?: boolean;
}

interface SegmentedTabsProps<T extends string> {
  items: SegmentedTabItem<T>[];
  value: T;
  onChange: (v: T) => void;
  /** Pill-вариант (свои фото / использовать модель). */
  variant?: "pill" | "underline" | "inverted";
  size?: "md" | "sm";
  ariaLabel?: string;
}

/**
 * Универсальный сегментный переключатель.
 *  - "pill"       — два сегмента в общей капсуле, активный — заполненный
 *  - "underline"  — текстовые табы с активной подчёркивающей линией (для «Образ 1»)
 * Цвета и радиусы — токены виджета.
 */
export function SegmentedTabs<T extends string>({
  items,
  value,
  onChange,
  variant = "pill",
  size = "md",
  ariaLabel,
}: SegmentedTabsProps<T>) {
  if (variant === "inverted") {
    const heights = size === "sm" ? "clamp(36px, 10.4cqw, 40px)" : "clamp(40px, 12.3cqw, 46px)";
    return (
      <div
        role="tablist"
        aria-label={ariaLabel}
        className="grid w-full min-w-0"
        style={{
          gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))`,
          backgroundColor: "#343537",
          borderRadius: 999,
          padding: 3,
          height: heights,
        }}
      >
        {items.map((it) => {
          const active = it.id === value;
          const style: CSSProperties = {
            fontFamily: "var(--vf-font-body)",
            fontSize: "var(--vf-fs-12)",
            fontWeight: active ? 700 : 500,
            color: active ? "#343537" : "var(--vf-surface)",
            backgroundColor: active ? "var(--vf-surface)" : "transparent",
            borderRadius: 999,
            opacity: it.disabled ? 0.4 : 1,
          };
          return (
            <button
              key={it.id}
              type="button"
              role="tab"
              aria-selected={active}
              disabled={it.disabled}
              onClick={() => onChange(it.id)}
              className="flex items-center justify-center min-w-0 vf-segment-pill lowercase"
              style={style}
            >
              <span className="truncate px-2">{it.label}</span>
            </button>
          );
        })}
      </div>
    );
  }

  if (variant === "underline") {
    return (
      <div
        role="tablist"
        aria-label={ariaLabel}
        className="flex items-center w-full min-w-0"
        style={{
          gap: "var(--vf-sp-12)",
          borderBottom:
            "1px solid color-mix(in oklab, var(--vf-text) 12%, transparent)",
        }}
      >
        {items.map((it) => {
          const active = it.id === value;
          return (
            <button
              key={it.id}
              type="button"
              role="tab"
              aria-selected={active}
              disabled={it.disabled}
              onClick={() => onChange(it.id)}
              className="relative shrink-0 vf-segment-pill"
              style={{
                paddingBlock: "var(--vf-sp-8)",
                fontFamily: "var(--vf-font-body)",
                fontSize: "var(--vf-fs-13)",
                fontWeight: active ? 600 : 400,
                color: active
                  ? "var(--vf-text)"
                  : "color-mix(in oklab, var(--vf-text) 60%, transparent)",
                opacity: it.disabled ? 0.4 : 1,
              }}
            >
              {it.label}
              {active && (
                <span
                  aria-hidden
                  className="absolute left-0 right-0 -bottom-px h-[2px]"
                  style={{ backgroundColor: "var(--vf-text)" }}
                />
              )}
            </button>
          );
        })}
      </div>
    );
  }

  // pill
  const heights = size === "sm" ? "clamp(36px, 10.4cqw, 40px)" : "clamp(40px, 12.3cqw, 46px)";
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className="grid w-full min-w-0"
      style={{
        gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))`,
        backgroundColor: "var(--vf-surface)",
        border: "1px solid color-mix(in oklab, var(--vf-text) 8%, transparent)",
        borderRadius: 999,
        padding: 3,
        height: heights,
      }}
    >
      {items.map((it) => {
        const active = it.id === value;
        const style: CSSProperties = {
          fontFamily: "var(--vf-font-body)",
          fontSize: "var(--vf-fs-12)",
          fontWeight: active ? 700 : 500,
          color: active ? "var(--vf-on-primary)" : "var(--vf-text)",
          backgroundColor: active ? "var(--vf-primary)" : "transparent",
          borderRadius: 999,
          opacity: it.disabled ? 0.4 : 1,
        };
        return (
          <button
            key={it.id}
            type="button"
            role="tab"
            aria-selected={active}
            disabled={it.disabled}
            onClick={() => onChange(it.id)}
            className="flex items-center justify-center min-w-0 vf-segment-pill"
            style={style}
          >
            <span className="truncate px-2">{it.label}</span>
          </button>
        );
      })}
    </div>
  );
}
