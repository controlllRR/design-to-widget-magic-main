import type { DeepPartial, I18nDictionary } from "./types";

export interface I18nLeaf {
  /** Путь от корня словаря, например ["start", "cta"]. */
  path: string[];
  /** Ключ для UI / поиска: start.cta */
  pathKey: string;
  /** Верхняя секция (splash, start, screens…). */
  section: string;
  value: string;
}

/** Рекурсивно собрать все строковые листья (включая элементы массивов). */
export function flattenI18nLeaves(dict: I18nDictionary): I18nLeaf[] {
  const out: I18nLeaf[] = [];

  function walk(node: unknown, path: string[]) {
    if (typeof node === "string") {
      out.push({
        path: [...path],
        pathKey: path.join("."),
        section: path[0] ?? "other",
        value: node,
      });
      return;
    }
    if (Array.isArray(node)) {
      node.forEach((item, index) => walk(item, [...path, String(index)]));
      return;
    }
    if (node && typeof node === "object") {
      for (const [key, val] of Object.entries(node as Record<string, unknown>)) {
        walk(val, [...path, key]);
      }
    }
  }

  walk(dict, []);
  return out;
}

/**
 * Построить DeepPartial для одного листа.
 * Если путь идёт через массив — в partial кладётся полная копия массива из `source`
 * (deepMerge заменяет массивы целиком).
 */
export function buildI18nLeafPartial(
  source: I18nDictionary,
  path: string[],
  value: string,
): DeepPartial<I18nDictionary> {
  const root: Record<string, unknown> = {};
  let srcCursor: unknown = source;
  let tgtCursor: Record<string, unknown> | unknown[] = root;

  for (let i = 0; i < path.length; i++) {
    const key = path[i]!;
    const isLast = i === path.length - 1;
    const nextKey = path[i + 1];
    const nextIsIndex = nextKey !== undefined && /^\d+$/.test(nextKey);

    if (isLast) {
      if (Array.isArray(tgtCursor)) {
        tgtCursor[Number(key)] = value;
      } else {
        (tgtCursor as Record<string, unknown>)[key] = value;
      }
      break;
    }

    // Двигаем source
    if (Array.isArray(srcCursor)) {
      srcCursor = srcCursor[Number(key)];
    } else if (srcCursor && typeof srcCursor === "object") {
      srcCursor = (srcCursor as Record<string, unknown>)[key];
    } else {
      srcCursor = undefined;
    }

    if (nextIsIndex && Array.isArray(srcCursor)) {
      // Кладём полный клон массива, дальше правим элемент
      const clone = structuredClone(srcCursor) as unknown[];
      if (Array.isArray(tgtCursor)) {
        tgtCursor[Number(key)] = clone;
        tgtCursor = clone;
      } else {
        (tgtCursor as Record<string, unknown>)[key] = clone;
        tgtCursor = clone;
      }
      continue;
    }

    // Обычный объект
    if (Array.isArray(tgtCursor)) {
      const idx = Number(key);
      const existing = tgtCursor[idx];
      if (!existing || typeof existing !== "object" || Array.isArray(existing)) {
        tgtCursor[idx] = {};
      }
      tgtCursor = tgtCursor[idx] as Record<string, unknown>;
    } else {
      const existing = (tgtCursor as Record<string, unknown>)[key];
      if (!existing || typeof existing !== "object" || Array.isArray(existing)) {
        (tgtCursor as Record<string, unknown>)[key] = {};
      }
      tgtCursor = (tgtCursor as Record<string, unknown>)[key] as Record<string, unknown>;
    }
  }

  return root as DeepPartial<I18nDictionary>;
}

/** Человекочитаемые названия секций i18n в админке. */
export const I18N_SECTION_LABELS: Record<string, string> = {
  splash: "Заставка",
  start: "Стартовый экран",
  userMenu: "Меню пользователя",
  createProfile: "Создание профиля",
  screens: "Экраны и действия",
};
