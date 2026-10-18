/**
 * Переопределения виджет-конфига (localStorage).
 * Временная админка прототипа → боевой embed передаёт partial через WidgetConfigProvider.
 */
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import type { DeepPartial, WidgetConfig } from "./types";

const STORAGE_KEY = "vf:widget-overrides:v1";
const EVENT_NAME = "vf:widget-overrides-changed";

export type WidgetOverrides = DeepPartial<WidgetConfig>;

/** Пока пишем из этого таба — игнор собственного EVENT_NAME (без лишнего setState). */
let writingLocally = false;

export function readOverrides(): WidgetOverrides {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? (parsed as WidgetOverrides) : {};
  } catch (err) {
    console.warn("[VirtuFit] failed to read overrides", err);
    return {};
  }
}

function writeOverrides(next: WidgetOverrides) {
  if (typeof window === "undefined") return;
  try {
    writingLocally = true;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new CustomEvent(EVENT_NAME));
  } catch (err) {
    console.error("[VirtuFit] failed to save overrides", err);
  } finally {
    writingLocally = false;
  }
}

export function useWidgetOverrides(): [
  WidgetOverrides,
  (updater: WidgetOverrides | ((prev: WidgetOverrides) => WidgetOverrides)) => void,
  () => void,
  /** false до чтения localStorage (SSR / первый кадр) — не монтировать виджет. */
  boolean,
] {
  // На SSR localStorage недоступен → {}. После гидрации читаем overrides,
  // иначе мелькает дефолтная заставка (splash.enabled=true).
  const [state, setState] = useState<WidgetOverrides>({});
  const [hydrated, setHydrated] = useState(false);

  useLayoutEffect(() => {
    setState(readOverrides());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const sync = () => {
      if (writingLocally) return;
      setState(readOverrides());
    };
    window.addEventListener("storage", sync);
    window.addEventListener(EVENT_NAME, sync as EventListener);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener(EVENT_NAME, sync as EventListener);
    };
  }, []);

  const update = useCallback(
    (updater: WidgetOverrides | ((prev: WidgetOverrides) => WidgetOverrides)) => {
      setState((prev) => {
        const next =
          typeof updater === "function"
            ? (updater as (p: WidgetOverrides) => WidgetOverrides)(prev)
            : updater;
        writeOverrides(next);
        return next;
      });
    },
    [],
  );

  const reset = useCallback(() => {
    if (typeof window !== "undefined") {
      writingLocally = true;
      try {
        window.localStorage.removeItem(STORAGE_KEY);
        window.dispatchEvent(new CustomEvent(EVENT_NAME));
      } finally {
        writingLocally = false;
      }
    }
    setState({});
  }, []);

  return [state, update, reset, hydrated];
}
