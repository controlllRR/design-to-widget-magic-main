/**
 * Переопределения виджет-конфига (localStorage).
 * Временная админка прототипа → боевой embed передаёт partial через WidgetConfigProvider.
 */
import { useCallback, useEffect, useState } from "react";
import type { DeepPartial, WidgetConfig } from "./types";

const STORAGE_KEY = "vf:widget-overrides:v1";
const EVENT_NAME = "vf:widget-overrides-changed";

export type WidgetOverrides = DeepPartial<WidgetConfig>;

function readOverrides(): WidgetOverrides {
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
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new CustomEvent(EVENT_NAME));
  } catch (err) {
    console.error("[VirtuFit] failed to save overrides", err);
  }
}

export function useWidgetOverrides(): [
  WidgetOverrides,
  (updater: WidgetOverrides | ((prev: WidgetOverrides) => WidgetOverrides)) => void,
  () => void,
] {
  const [state, setState] = useState<WidgetOverrides>(() => readOverrides());

  useEffect(() => {
    if (typeof window === "undefined") return;
    const sync = () => setState(readOverrides());
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
      window.localStorage.removeItem(STORAGE_KEY);
      window.dispatchEvent(new CustomEvent(EVENT_NAME));
    }
    setState({});
  }, []);

  return [state, update, reset];
}
