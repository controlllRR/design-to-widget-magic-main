import { useMemo, useState, type ReactNode } from "react";
import {
  defaultWidgetConfig,
  type Locale,
  type WidgetOverrides,
} from "@/widget/config";
import { deepMerge } from "@/widget/config/WidgetConfigProvider";
import {
  buildI18nLeafPartial,
  flattenI18nLeaves,
  I18N_SECTION_LABELS,
  type I18nLeaf,
} from "@/widget/config/i18nFlat";

function FieldHint({ children }: { children: ReactNode }) {
  return <p className="text-xs text-neutral-500 mt-0.5">{children}</p>;
}

interface AdminI18nEditorProps {
  overrides: WidgetOverrides;
  patch: (updater: (prev: WidgetOverrides) => WidgetOverrides) => void;
}

/**
 * Редактор всех строк i18n (ru / en) — каждая надпись виджета.
 */
export function AdminI18nEditor({ overrides, patch }: AdminI18nEditorProps) {
  const [editLocale, setEditLocale] = useState<Locale>("ru");
  const [query, setQuery] = useState("");
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    splash: true,
    start: true,
  });

  const previewLocale = (overrides.locale ?? defaultWidgetConfig.locale) as Locale;

  const dict = useMemo(
    () =>
      deepMerge(
        defaultWidgetConfig.i18n[editLocale],
        overrides.i18n?.[editLocale],
      ),
    [editLocale, overrides.i18n],
  );

  const leaves = useMemo(() => flattenI18nLeaves(dict), [dict]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return leaves;
    return leaves.filter(
      (leaf) =>
        leaf.pathKey.toLowerCase().includes(q) ||
        leaf.value.toLowerCase().includes(q) ||
        (I18N_SECTION_LABELS[leaf.section] ?? leaf.section).toLowerCase().includes(q),
    );
  }, [leaves, query]);

  const bySection = useMemo(() => {
    const map = new Map<string, I18nLeaf[]>();
    for (const leaf of filtered) {
      const list = map.get(leaf.section) ?? [];
      list.push(leaf);
      map.set(leaf.section, list);
    }
    return map;
  }, [filtered]);

  const setLeaf = (path: string[], value: string) => {
    const partial = buildI18nLeafPartial(dict, path, value);
    patch((prev) => ({
      ...prev,
      i18n: {
        ...prev.i18n,
        [editLocale]: deepMerge(prev.i18n?.[editLocale], partial),
      },
    }));
  };

  const setPreviewLocale = (locale: Locale) => {
    patch((prev) => ({ ...prev, locale }));
  };

  const resetLocale = () => {
    patch((prev) => {
      if (!prev.i18n?.[editLocale]) return prev;
      const nextI18n = { ...prev.i18n };
      delete nextI18n[editLocale];
      const next: WidgetOverrides = { ...prev, i18n: nextI18n };
      if (Object.keys(nextI18n).length === 0) {
        delete next.i18n;
      }
      return next;
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium mr-1">Редактировать язык:</span>
        {(["ru", "en"] as const).map((loc) => (
          <button
            key={loc}
            type="button"
            onClick={() => setEditLocale(loc)}
            className={`text-xs px-3 py-1.5 rounded-full border ${
              editLocale === loc
                ? "bg-neutral-900 text-white border-neutral-900"
                : "bg-white border-neutral-300"
            }`}
          >
            {loc === "ru" ? "Русский" : "English"}
          </button>
        ))}
        <button
          type="button"
          onClick={resetLocale}
          className="text-xs px-3 py-1.5 rounded-full bg-white border border-neutral-300 text-red-600 ml-auto"
        >
          Сбросить {editLocale === "ru" ? "RU" : "EN"}
        </button>
      </div>

      <div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium mr-1">Язык превью виджета:</span>
          {(["ru", "en"] as const).map((loc) => (
            <button
              key={loc}
              type="button"
              onClick={() => setPreviewLocale(loc)}
              className={`text-xs px-3 py-1.5 rounded-full border ${
                previewLocale === loc
                  ? "bg-neutral-900 text-white border-neutral-900"
                  : "bg-white border-neutral-300"
              }`}
            >
              {loc === "ru" ? "RU" : "EN"}
            </button>
          ))}
        </div>
        <FieldHint>
          Переключите превью на EN, чтобы сразу видеть английские надписи справа.
        </FieldHint>
      </div>

      <label className="block text-sm">
        <span className="font-medium">Поиск по надписям</span>
        <input
          className="mt-1 w-full border rounded px-3 py-2 text-sm"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Например: cta, сохранить, profile…"
        />
      </label>

      <p className="text-xs text-neutral-500">
        Найдено: {filtered.length} из {leaves.length}
      </p>

      <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
        {[...bySection.entries()].map(([section, items]) => {
          const open = openSections[section] ?? false;
          const label = I18N_SECTION_LABELS[section] ?? section;
          return (
            <div key={section} className="border border-neutral-200 rounded-lg overflow-hidden">
              <button
                type="button"
                className="w-full flex items-center justify-between px-3 py-2.5 text-left bg-neutral-50 hover:bg-neutral-100"
                onClick={() =>
                  setOpenSections((prev) => ({ ...prev, [section]: !open }))
                }
              >
                <span className="text-sm font-medium">
                  {label}{" "}
                  <span className="text-neutral-400 font-normal">({items.length})</span>
                </span>
                <span className="text-neutral-400 text-xs">{open ? "▾" : "▸"}</span>
              </button>
              {open ? (
                <ul className="divide-y divide-neutral-100 p-2 space-y-0">
                  {items.map((leaf) => {
                    const long = leaf.value.length > 80 || leaf.value.includes("\n");
                    return (
                      <li key={leaf.pathKey} className="py-2.5 px-1">
                        <label className="block text-sm">
                          <span className="font-mono text-[11px] text-neutral-500 break-all">
                            {leaf.pathKey}
                          </span>
                          {long ? (
                            <textarea
                              className="mt-1 w-full border rounded px-3 py-2 text-sm min-h-[72px]"
                              value={leaf.value}
                              onChange={(e) => setLeaf(leaf.path, e.target.value)}
                            />
                          ) : (
                            <input
                              className="mt-1 w-full border rounded px-3 py-2 text-sm"
                              value={leaf.value}
                              onChange={(e) => setLeaf(leaf.path, e.target.value)}
                            />
                          )}
                        </label>
                      </li>
                    );
                  })}
                </ul>
              ) : null}
            </div>
          );
        })}
        {filtered.length === 0 ? (
          <p className="text-sm text-neutral-500 py-4 text-center">Ничего не найдено</p>
        ) : null}
      </div>
    </div>
  );
}
