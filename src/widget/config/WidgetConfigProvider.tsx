import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { defaultWidgetConfig } from "./defaults";
import type {
  DeepPartial,
  I18nDictionary,
  Locale,
  ThemeMode,
  WidgetColors,
  WidgetConfig,
} from "./types";

/**
 * Глубокий merge partial-конфига с дефолтами (для встраивания на сайт-хост).
 * Массивы заменяются целиком (например, splash.images).
 */
function deepMerge<T>(base: T, partial?: DeepPartial<T>): T {
  if (!partial) return base;
  if (Array.isArray(base)) {
    return (Array.isArray(partial) ? partial : base) as T;
  }
  if (typeof base !== "object" || base === null) {
    return (partial as T) ?? base;
  }
  const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
  for (const key of Object.keys(partial as object)) {
    const baseVal = (base as Record<string, unknown>)[key];
    const partVal = (partial as Record<string, unknown>)[key];
    if (
      baseVal &&
      typeof baseVal === "object" &&
      !Array.isArray(baseVal) &&
      partVal &&
      typeof partVal === "object" &&
      !Array.isArray(partVal)
    ) {
      out[key] = deepMerge(baseVal, partVal as DeepPartial<typeof baseVal>);
    } else if (partVal !== undefined) {
      out[key] = partVal;
    }
  }
  return out as T;
}

interface WidgetConfigContextValue {
  config: WidgetConfig;
  /** Активная палитра с учётом themeMode и системной темы. */
  activeColors: WidgetColors;
  /** Эффективная тема ("light" | "dark"), уже после разрешения "system". */
  effectiveTheme: "light" | "dark";
  /** Активный словарь переводов (по локали). */
  t: I18nDictionary;
  setThemeMode: (mode: ThemeMode) => void;
  setLocale: (locale: Locale) => void;
}

const WidgetConfigContext = createContext<WidgetConfigContextValue | null>(null);

interface ProviderProps {
  /** Частичный конфиг (например, из админки). Сольётся поверх дефолтов. */
  config?: DeepPartial<WidgetConfig>;
  children: ReactNode;
}

/**
 * Корневой провайдер настроек виджета.
 *
 * Применяет CSS-переменные на скоуп виджета (data-vf-root),
 * без влияния на стили сайта-хоста — критично для встраиваемого режима.
 */
export function WidgetConfigProvider({ config: partial, children }: ProviderProps) {
  const merged = useMemo<WidgetConfig>(
    () => deepMerge(defaultWidgetConfig, partial),
    [partial],
  );

  const [themeMode, setThemeMode] = useState<ThemeMode>(merged.themeMode);
  const [locale, setLocale] = useState<Locale>(merged.locale);

  // Синхронизация theme/locale при смене partial-конфига снаружи.
  useEffect(() => setThemeMode(merged.themeMode), [merged.themeMode]);
  useEffect(() => setLocale(merged.locale), [merged.locale]);

  // Системная тема (с подпиской на изменения).
  const [systemDark, setSystemDark] = useState<boolean>(() => {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => setSystemDark(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const effectiveTheme: "light" | "dark" =
    themeMode === "system" ? (systemDark ? "dark" : "light") : themeMode;

  const activeColors =
    effectiveTheme === "dark" ? merged.theme.dark : merged.theme.light;

  const t = merged.i18n[locale] ?? merged.i18n.ru;

  // Логирование (по гайдлайну: важная конфигурация).
  useEffect(() => {
    console.info("[VirtuFit] config applied", {
      theme: effectiveTheme,
      locale,
      splashEnabled: merged.splash.enabled,
      images: merged.splash.images.length,
    });
  }, [effectiveTheme, locale, merged.splash.enabled, merged.splash.images.length]);

  const value: WidgetConfigContextValue = {
    config: merged,
    activeColors,
    effectiveTheme,
    t,
    setThemeMode,
    setLocale,
  };

  return (
    <WidgetConfigContext.Provider value={value}>
      {children}
    </WidgetConfigContext.Provider>
  );
}

export function useWidgetConfig(): WidgetConfigContextValue {
  const ctx = useContext(WidgetConfigContext);
  if (!ctx) {
    throw new Error("useWidgetConfig must be used within <WidgetConfigProvider>");
  }
  return ctx;
}

/**
 * Возвращает inline-style с CSS-переменными виджета — навешивается на корневой
 * контейнер виджета. Все дочерние компоненты читают `var(--vf-*)`.
 */
export function useWidgetCssVars(): CSSProperties {
  const { config, activeColors } = useWidgetConfig();
  const { theme } = config;

  return {
    // Цвета
    ["--vf-primary" as string]: activeColors.primary,
    ["--vf-on-primary" as string]: activeColors.onPrimary,
    ["--vf-surface" as string]: activeColors.surface,
    ["--vf-surface-muted" as string]: activeColors.surfaceMuted,
    ["--vf-text" as string]: activeColors.text,
    ["--vf-text-muted" as string]: activeColors.textMuted,
    ["--vf-border" as string]: activeColors.border,
    ["--vf-btn-bg" as string]: activeColors.btnBg,
    ["--vf-btn-bg-disabled" as string]: activeColors.btnBgDisabled,
    ["--vf-btn-text" as string]: activeColors.btnText,
    ["--vf-error" as string]: activeColors.error,
    ["--vf-success" as string]: activeColors.success,
    ["--vf-card-hero" as string]: activeColors.cardHero,
    // Радиусы
    ["--vf-radius-widget" as string]: theme.radius.widget,
    ["--vf-radius-card" as string]: theme.radius.card,
    ["--vf-radius-tile" as string]: theme.radius.tile,
    ["--vf-radius-button" as string]: theme.radius.button,
    // Тени
    ["--vf-shadow-widget" as string]: theme.shadow.widget,
    ["--vf-shadow-card" as string]: theme.shadow.card,
    // Шрифты
    ["--vf-font-heading" as string]: theme.fonts.heading,
    ["--vf-font-body" as string]: theme.fonts.body,
  } as CSSProperties;
}
