import { useMemo, useState } from "react";
import { BrandLogo } from "@/components/widget/BrandLogo";
import {
  LOGO_ANIMATION_GROUP_LABELS,
  LOGO_ANIMATION_OPTIONS,
  type LogoAnimationGroup,
  type LogoAnimationId,
} from "@/widget/config";

interface LogoAnimationPickerProps {
  value: LogoAnimationId;
  onChange: (id: LogoAnimationId) => void;
  invert: boolean;
}

const GROUP_ORDER: LogoAnimationGroup[] = ["entrance", "loop", "effect"];

/**
 * Сетка превью анимаций логотипа для админки:
 * каждая плитка крутит свой вариант, выбранная подсвечена.
 */
export function LogoAnimationPicker({
  value,
  onChange,
  invert,
}: LogoAnimationPickerProps) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return LOGO_ANIMATION_OPTIONS;
    return LOGO_ANIMATION_OPTIONS.filter(
      (opt) =>
        opt.label.toLowerCase().includes(q) ||
        opt.hint.toLowerCase().includes(q) ||
        opt.id.toLowerCase().includes(q) ||
        LOGO_ANIMATION_GROUP_LABELS[opt.group].toLowerCase().includes(q),
    );
  }, [query]);

  const byGroup = useMemo(() => {
    const map = new Map<LogoAnimationGroup, typeof filtered>();
    for (const group of GROUP_ORDER) {
      const list = filtered.filter((o) => o.group === group);
      if (list.length) map.set(group, list);
    }
    return map;
  }, [filtered]);

  return (
    <div className="space-y-3">
      <label className="block text-sm">
        <span className="font-medium">Тип анимации</span>
        <p className="text-xs text-neutral-500 mt-0.5">
          Выберите плитку — в ней сразу видно, как будет выглядеть эффект.
        </p>
        <div className="relative mt-2">
          <input
            className="w-full border rounded-lg px-3 py-2 text-sm pr-8"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Поиск анимации…"
            aria-label="Поиск анимации логотипа"
          />
          {query ? (
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 text-sm"
              onClick={() => setQuery("")}
              title="Очистить поиск"
              aria-label="Очистить поиск"
            >
              ×
            </button>
          ) : null}
        </div>
      </label>

      {byGroup.size === 0 ? (
        <p className="text-xs text-neutral-500 py-4 text-center">Ничего не найдено</p>
      ) : (
        GROUP_ORDER.map((group) => {
          const list = byGroup.get(group);
          if (!list) return null;
          return (
            <div key={group} className="space-y-2">
              <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide">
                {LOGO_ANIMATION_GROUP_LABELS[group]}
                <span className="ml-1 font-normal normal-case tracking-normal text-neutral-400">
                  · {list.length}
                </span>
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {list.map((opt) => {
                  const selected = value === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      title={opt.hint}
                      aria-label={`${opt.label}: ${opt.hint}`}
                      aria-pressed={selected}
                      onClick={() => onChange(opt.id)}
                      className={`text-left rounded-xl border p-2.5 transition-shadow ${
                        selected
                          ? "border-neutral-900 ring-2 ring-neutral-900 bg-neutral-50"
                          : "border-neutral-200 bg-white hover:border-neutral-400"
                      }`}
                    >
                      <div
                        className="vf-logo-preview-loop flex items-center justify-center rounded-lg bg-neutral-900 mb-2 overflow-hidden"
                        style={{ height: 52 }}
                      >
                        <BrandLogo
                          animationOverride={opt.id}
                          enabledOverride
                          invertOverride={invert}
                          height="22px"
                          disableLink
                        />
                      </div>
                      <span className="block text-xs font-medium text-neutral-900 truncate">
                        {opt.label}
                      </span>
                      <span className="block text-[11px] text-neutral-500 leading-snug line-clamp-2 mt-0.5">
                        {opt.hint}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
