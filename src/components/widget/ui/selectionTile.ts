import type { CSSProperties } from "react";

type SelectionTileVariant = "tile" | "muted";

/**
 * Единый стиль плитки выбора.
 * - tile: белая плитка с рамкой (ракурсы на белом фоне)
 * - muted: без рамки на серой карточке (телосложение, грудь…)
 */
export function selectionTileStyle(
  active: boolean,
  opts?: {
    radius?: number | string;
    variant?: SelectionTileVariant;
  },
): CSSProperties {
  const radius = opts?.radius ?? 14;
  const variant = opts?.variant ?? "tile";

  if (variant === "muted") {
    return {
      backgroundColor: active ? "var(--vf-tile-selected-bg, var(--vf-primary))" : "transparent",
      border: "none",
      color: active ? "var(--vf-on-primary)" : "var(--vf-text)",
      transition: "background-color 0.15s ease, color 0.15s ease",
      borderRadius: radius,
    };
  }
  return {
    backgroundColor: active ? "var(--vf-primary)" : "var(--vf-surface)",
    border: active
      ? "1.5px solid var(--vf-primary)"
      : "1.5px solid color-mix(in oklab, var(--vf-text) 16%, var(--vf-surface))",
    color: active ? "var(--vf-on-primary)" : "var(--vf-text)",
    transition: "background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease",
    borderRadius: radius,
  };
}

/** Line-art иконки: тёмные штрихи → белые на выбранной плитке. */
export function selectionLineArtIconFilter(active: boolean): CSSProperties | undefined {
  if (!active) return undefined;
  return { filter: "brightness(0) invert(1)" };
}

/**
 * SVG-спрайты силуэтов → белый контур на тёмной плитке.
 * Спрайты без фона (только #343537 paths) — тот же фильтр, что и для PNG line-art.
 */
export function selectionSpriteIconFilter(active: boolean): CSSProperties | undefined {
  return selectionLineArtIconFilter(active);
}

/** @deprecated use selectionLineArtIconFilter */
export function selectionTileIconFilter(active: boolean): CSSProperties | undefined {
  return selectionLineArtIconFilter(active);
}
