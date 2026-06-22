import type { CSSProperties } from "react";

/** Общий контейнер карточек параметров профиля (Figma: лёгкое затемнение по краям). */
export const paramCardStyle: CSSProperties = {
  backgroundColor: "var(--vf-surface-muted)",
  borderRadius: "var(--vf-radius-card)",
  paddingInline: "var(--vf-sp-20)",
  paddingTop: "var(--vf-sp-20)",
  paddingBottom: "var(--vf-sp-20)",
  boxShadow:
    "0 0 0 1px color-mix(in oklab, var(--vf-text) 5%, transparent), 0 2px 8px color-mix(in oklab, var(--vf-text) 5%, transparent)",
};
