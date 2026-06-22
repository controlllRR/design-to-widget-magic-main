export type CatalogColorId =
  | "black"
  | "white"
  | "blue"
  | "red"
  | "yellow"
  | "orange"
  | "beige"
  | "green"
  | "purple"
  | "gray"
  | "pink"
  | "lightBlue"
  | "brown";

export type CatalogCompositionId =
  | "cotton"
  | "linen"
  | "leather"
  | "viscose"
  | "fleece"
  | "wool"
  | "elastane";

export type CatalogProductTypeId =
  | "jacket"
  | "coat"
  | "sheepskinCoat"
  | "downJacket"
  | "cardigan"
  | "sweater"
  | "jumper"
  | "vest"
  | "dress"
  | "sundress"
  | "tshirt"
  | "tankTop"
  | "swimsuit"
  | "bra";

export type CatalogMaterialId =
  | "leather"
  | "ecoLeather"
  | "dermontin"
  | "textile"
  | "velvet"
  | "suede"
  | "denim";

export type CatalogLengthId = "short" | "medium" | "long" | "maxi";

export type CatalogStyleId = "casual" | "classic" | "sport" | "evening";

export type CatalogSeasonId = "spring" | "summer" | "autumn" | "winter";

export type CatalogSleeveId = "short" | "long" | "threeQuarter" | "sleeveless";

export type CatalogCutId = "slim" | "regular" | "oversize" | "fitted";

export type CatalogModelId = "basic" | "fitted" | "relaxed";

export const CATALOG_PRICE_MIN = 0;
export const CATALOG_PRICE_MAX = 100_000;
export const CATALOG_PRICE_DEFAULT_MIN = 1_200;
export const CATALOG_PRICE_DEFAULT_MAX = 40_000;

export interface CatalogItemMeta {
  productTypes: CatalogProductTypeId[];
  colors: CatalogColorId[];
  compositions: CatalogCompositionId[];
  materials: CatalogMaterialId[];
  price: number;
  lengths: CatalogLengthId[];
  styles: CatalogStyleId[];
  seasons: CatalogSeasonId[];
  sleeves: CatalogSleeveId[];
  cuts: CatalogCutId[];
  models: CatalogModelId[];
}

/** Метаданные каталога — для фильтрации магазина и гардероба. */
export const CATALOG_ITEM_META: Record<string, CatalogItemMeta> = {
  coat: {
    productTypes: ["coat", "jacket"],
    colors: ["black", "orange"],
    compositions: ["wool", "fleece"],
    materials: ["textile", "dermontin"],
    price: 28_500,
    lengths: ["medium", "long"],
    styles: ["classic", "casual"],
    seasons: ["autumn", "winter"],
    sleeves: ["long"],
    cuts: ["regular"],
    models: ["basic"],
  },
  shirt: {
    productTypes: ["tshirt"],
    colors: ["white", "beige"],
    compositions: ["cotton", "linen"],
    materials: ["textile"],
    price: 12_900,
    lengths: ["medium"],
    styles: ["classic", "casual"],
    seasons: ["spring", "summer"],
    sleeves: ["long"],
    cuts: ["regular", "slim"],
    models: ["fitted"],
  },
  jeans: {
    productTypes: ["tshirt"],
    colors: ["blue"],
    compositions: ["cotton"],
    materials: ["denim"],
    price: 9_800,
    lengths: ["long"],
    styles: ["casual"],
    seasons: ["spring", "autumn"],
    sleeves: ["long"],
    cuts: ["slim", "regular"],
    models: ["basic"],
  },
  skirt: {
    productTypes: ["dress"],
    colors: ["black"],
    compositions: ["viscose", "elastane"],
    materials: ["textile"],
    price: 7_200,
    lengths: ["short", "medium"],
    styles: ["evening", "classic"],
    seasons: ["spring", "summer"],
    sleeves: ["sleeveless"],
    cuts: ["fitted"],
    models: ["fitted"],
  },
  dress: {
    productTypes: ["dress"],
    colors: ["black"],
    compositions: ["cotton", "elastane"],
    materials: ["textile"],
    price: 18_500,
    lengths: ["medium", "long"],
    styles: ["evening", "classic"],
    seasons: ["spring", "summer"],
    sleeves: ["short", "sleeveless"],
    cuts: ["fitted"],
    models: ["fitted"],
  },
  sneakers: {
    productTypes: ["tshirt"],
    colors: ["white", "gray"],
    compositions: ["fleece", "elastane"],
    materials: ["textile"],
    price: 11_400,
    lengths: ["short"],
    styles: ["sport", "casual"],
    seasons: ["spring", "summer", "autumn"],
    sleeves: ["sleeveless"],
    cuts: ["regular"],
    models: ["basic"],
  },
  heels: {
    productTypes: ["tshirt"],
    colors: ["black", "gray"],
    compositions: ["leather"],
    materials: ["leather"],
    price: 15_600,
    lengths: ["short"],
    styles: ["evening", "classic"],
    seasons: ["spring", "summer", "autumn"],
    sleeves: ["sleeveless"],
    cuts: ["fitted"],
    models: ["fitted"],
  },
  cap: {
    productTypes: ["vest"],
    colors: ["black"],
    compositions: ["cotton"],
    materials: ["textile"],
    price: 3_200,
    lengths: ["short"],
    styles: ["casual", "sport"],
    seasons: ["spring", "summer"],
    sleeves: ["sleeveless"],
    cuts: ["regular"],
    models: ["basic"],
  },
  bag: {
    productTypes: ["vest"],
    colors: ["black", "brown"],
    compositions: ["leather"],
    materials: ["leather", "ecoLeather"],
    price: 42_000,
    lengths: ["short"],
    styles: ["classic"],
    seasons: ["spring", "summer", "autumn", "winter"],
    sleeves: ["sleeveless"],
    cuts: ["regular"],
    models: ["basic"],
  },
  "dress-1": metaDress(),
  "shirt-dg": metaShirt(),
  "dress-2": metaDress(),
  "dress-3": metaDress(),
  "dress-4": metaDress(),
  "dress-5": metaDress(),
  "dress-6": metaDress(),
  "dress-7": metaDress(),
  tee: {
    productTypes: ["tshirt"],
    colors: ["gray", "blue"],
    compositions: ["cotton"],
    materials: ["textile"],
    price: 4_500,
    lengths: ["short"],
    styles: ["casual", "sport"],
    seasons: ["spring", "summer"],
    sleeves: ["short"],
    cuts: ["regular", "oversize"],
    models: ["basic", "relaxed"],
  },
  "dress-8": metaDress(),
  "dress-9": metaDress(),
  "set-spring": {
    productTypes: ["dress", "sundress"],
    colors: ["black", "green"],
    compositions: ["cotton", "linen"],
    materials: ["textile"],
    price: 22_000,
    lengths: ["medium"],
    styles: ["casual", "classic"],
    seasons: ["spring"],
    sleeves: ["short", "sleeveless"],
    cuts: ["regular"],
    models: ["basic"],
  },
  "set-pistachio": {
    productTypes: ["dress", "cardigan"],
    colors: ["green", "beige"],
    compositions: ["cotton", "wool"],
    materials: ["textile", "velvet"],
    price: 31_500,
    lengths: ["medium", "long"],
    styles: ["casual"],
    seasons: ["spring", "summer"],
    sleeves: ["long", "short"],
    cuts: ["regular", "oversize"],
    models: ["relaxed"],
  },
};

function metaDress(): CatalogItemMeta {
  return {
    productTypes: ["dress"],
    colors: ["black"],
    compositions: ["cotton", "elastane"],
    materials: ["textile"],
    price: 16_800,
    lengths: ["medium", "long"],
    styles: ["evening", "classic"],
    seasons: ["spring", "summer", "autumn"],
    sleeves: ["short", "sleeveless"],
    cuts: ["fitted"],
    models: ["fitted"],
  };
}

function metaShirt(): CatalogItemMeta {
  return {
    productTypes: ["tshirt"],
    colors: ["white"],
    compositions: ["cotton", "linen"],
    materials: ["textile"],
    price: 24_500,
    lengths: ["medium"],
    styles: ["classic"],
    seasons: ["spring", "summer", "autumn"],
    sleeves: ["long"],
    cuts: ["slim", "regular"],
    models: ["fitted"],
  };
}

export const CATALOG_COLOR_SWATCH: Record<CatalogColorId, string> = {
  black: "#000000",
  white: "#efefef",
  blue: "#0040ff",
  red: "#f00000",
  yellow: "#edd600",
  orange: "#ff7300",
  beige: "#fee9d0",
  green: "#098800",
  purple: "#a004d9",
  gray: "#8c8c8c",
  pink: "#ff7da8",
  lightBlue: "#85bdf9",
  brown: "#531515",
};

export const CATALOG_COLORS: CatalogColorId[] = [
  "black",
  "white",
  "blue",
  "red",
  "yellow",
  "orange",
  "beige",
  "green",
  "purple",
  "gray",
  "pink",
  "lightBlue",
  "brown",
];

export const CATALOG_COMPOSITIONS: CatalogCompositionId[] = [
  "cotton",
  "linen",
  "leather",
  "viscose",
  "fleece",
  "wool",
  "elastane",
];

export const CATALOG_PRODUCT_TYPES: CatalogProductTypeId[] = [
  "jacket",
  "coat",
  "sheepskinCoat",
  "downJacket",
  "cardigan",
  "sweater",
  "jumper",
  "vest",
  "dress",
  "sundress",
  "tshirt",
  "tankTop",
  "swimsuit",
  "bra",
];

export const CATALOG_MATERIALS: CatalogMaterialId[] = [
  "leather",
  "ecoLeather",
  "dermontin",
  "textile",
  "velvet",
  "suede",
  "denim",
];

export const CATALOG_LENGTHS: CatalogLengthId[] = ["short", "medium", "long", "maxi"];

export const CATALOG_STYLES: CatalogStyleId[] = ["casual", "classic", "sport", "evening"];

export const CATALOG_SEASONS: CatalogSeasonId[] = ["spring", "summer", "autumn", "winter"];

export const CATALOG_SLEEVES: CatalogSleeveId[] = [
  "short",
  "long",
  "threeQuarter",
  "sleeveless",
];

export const CATALOG_CUTS: CatalogCutId[] = ["slim", "regular", "oversize", "fitted"];

export const CATALOG_MODELS: CatalogModelId[] = ["basic", "fitted", "relaxed"];

export interface CatalogFilters {
  productTypes: CatalogProductTypeId[];
  colors: CatalogColorId[];
  compositions: CatalogCompositionId[];
  materials: CatalogMaterialId[];
  priceMin: number | null;
  priceMax: number | null;
  lengths: CatalogLengthId[];
  styles: CatalogStyleId[];
  seasons: CatalogSeasonId[];
  sleeves: CatalogSleeveId[];
  cuts: CatalogCutId[];
  models: CatalogModelId[];
}

export const EMPTY_CATALOG_FILTERS: CatalogFilters = {
  productTypes: [],
  colors: [],
  compositions: [],
  materials: [],
  priceMin: null,
  priceMax: null,
  lengths: [],
  styles: [],
  seasons: [],
  sleeves: [],
  cuts: [],
  models: [],
};

function matchesArray<T>(selected: T[], values: T[]): boolean {
  return selected.length === 0 || selected.some((v) => values.includes(v));
}

export function countActiveCatalogFilters(filters: CatalogFilters): number {
  let count =
    filters.productTypes.length +
    filters.colors.length +
    filters.compositions.length +
    filters.materials.length +
    filters.lengths.length +
    filters.styles.length +
    filters.seasons.length +
    filters.sleeves.length +
    filters.cuts.length +
    filters.models.length;
  if (filters.priceMin !== null || filters.priceMax !== null) count += 1;
  return count;
}

export function hasActiveCatalogFilters(filters: CatalogFilters): boolean {
  return countActiveCatalogFilters(filters) > 0;
}

export function applyCatalogFilters<T extends { id: string }>(
  items: T[],
  filters: CatalogFilters,
): T[] {
  return items.filter((item) => {
    const meta = CATALOG_ITEM_META[item.id];
    if (!meta) return true;

    if (!matchesArray(filters.productTypes, meta.productTypes)) return false;
    if (!matchesArray(filters.colors, meta.colors)) return false;
    if (!matchesArray(filters.compositions, meta.compositions)) return false;
    if (!matchesArray(filters.materials, meta.materials)) return false;
    if (!matchesArray(filters.lengths, meta.lengths)) return false;
    if (!matchesArray(filters.styles, meta.styles)) return false;
    if (!matchesArray(filters.seasons, meta.seasons)) return false;
    if (!matchesArray(filters.sleeves, meta.sleeves)) return false;
    if (!matchesArray(filters.cuts, meta.cuts)) return false;
    if (!matchesArray(filters.models, meta.models)) return false;

    const min = filters.priceMin ?? CATALOG_PRICE_MIN;
    const max = filters.priceMax ?? CATALOG_PRICE_MAX;
    if (filters.priceMin !== null || filters.priceMax !== null) {
      if (meta.price < min || meta.price > max) return false;
    }

    return true;
  });
}

/** @deprecated Используйте applyCatalogFilters. */
export function filterStoreItems<T extends { id: string }>(
  items: T[],
  category: "all" | "tops" | "bottoms" | "footwear" | "accessories",
): T[] {
  if (category === "all") return items;
  const map: Record<string, CatalogProductTypeId[]> = {
    tops: ["tshirt", "dress", "jacket", "coat", "cardigan", "sweater"],
    bottoms: ["tshirt"],
    footwear: ["tshirt"],
    accessories: ["vest"],
  };
  return applyCatalogFilters(items, {
    ...EMPTY_CATALOG_FILTERS,
    productTypes: map[category] ?? [],
  });
}
