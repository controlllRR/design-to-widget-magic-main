import type { CSSProperties } from "react";

/** Базовый фон/типографика экрана виджета — как StartPage / CreateProfile. */
export const widgetScreenShellStyle: CSSProperties = {
  fontFamily: "var(--vf-font-body)",
  backgroundColor: "var(--vf-surface)",
  color: "var(--vf-text)",
};

/** Основная CTA-кнопка (pill) — Figma `--vf-radius-button`. */
export function primaryButtonStyle(active = true): CSSProperties {
  return {
    height: "var(--vf-sz-46)",
    borderRadius: "var(--vf-radius-button)",
    backgroundColor: active ? "var(--vf-btn-bg)" : "var(--vf-btn-bg-disabled)",
    color: "var(--vf-btn-text)",
  };
}

/** Заголовок секции wardrobe / animate — lowercase, TikTok Sans. */
export const sectionTitleStyle: CSSProperties = {
  fontFamily: "var(--vf-font-heading)",
  fontSize: "var(--vf-fs-14)",
  fontWeight: 500,
  textTransform: "lowercase",
  lineHeight: 1.75,
};

/** Заголовок Create profile / Upload photo — Figma fs-26 uppercase. */
export const profilePageTitleStyle: CSSProperties = {
  fontFamily: "var(--vf-font-heading)",
  fontSize: "var(--vf-fs-26)",
  fontWeight: 700,
  textTransform: "uppercase",
  lineHeight: 1.05,
  letterSpacing: "0.01em",
};

/** Заголовок экрана grid-экранов — Figma «ГАРДЕРОБ», «ОЖИВИТЬ ОБРАЗ». */
export const pageTitleStyle: CSSProperties = {
  fontFamily: "var(--vf-font-heading)",
  fontSize: "var(--vf-fs-22)",
  fontWeight: 700,
  textTransform: "uppercase",
  lineHeight: 1.25,
  letterSpacing: "0.01em",
};

/** Заголовок блока generation / configuring — UPPERCASE 12px bold. */
export const sectionHeadingStyle: CSSProperties = {
  fontFamily: "var(--vf-font-heading)",
  fontSize: "var(--vf-fs-12)",
  fontWeight: 700,
  letterSpacing: "0.02em",
  textTransform: "uppercase",
};

/** Подзаголовок секции (эффект, длительность) — lowercase heading. */
export const subsectionLabelStyle: CSSProperties = {
  fontFamily: "var(--vf-font-heading)",
  fontSize: "var(--vf-fs-12)",
  textTransform: "lowercase",
};

/** Вторичная outline-кнопка (отмена). */
export const secondaryButtonStyle: CSSProperties = {
  height: "var(--vf-sz-46)",
  borderRadius: "var(--vf-radius-button)",
  border: "1px solid var(--vf-border)",
  color: "var(--vf-text)",
  backgroundColor: "transparent",
};

/** Текстовая ссылка под hero (сменить фон / оживить). */
export const mutedTextLinkStyle: CSSProperties = {
  color: "var(--vf-text-muted)",
  fontSize: "var(--vf-fs-10)",
  textTransform: "lowercase",
  textDecoration: "underline",
};
