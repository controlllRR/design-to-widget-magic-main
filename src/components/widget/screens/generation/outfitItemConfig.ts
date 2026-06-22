/** Поля настройки элемента образа — Figma generation item config sheets. */

export type OutfitConfigFieldId =
  | "visorSide"
  | "style"
  | "fastener"
  | "sleeve"
  | "sleeveRoll"
  | "collarHeight"
  | "collarType"
  | "styling"
  | "cuffRoll"
  | "fit"
  | "carryHand"
  | "lacing"
  | "tuckedInFootwear"
  | "glassesPlacement";

export type OutfitItemConfigValues = Partial<Record<OutfitConfigFieldId, number | string>>;

export type OutfitConfigField =
  | {
      id: OutfitConfigFieldId;
      type: "slider";
      min: number;
      max: number;
      step: number;
      /** Подписи под точками слайдера (равномерно). */
      labels: string[];
    }
  | {
      id: OutfitConfigFieldId;
      type: "segmented";
      options: { id: string; labelKey: string }[];
    };

/** Схема полей по id элемента состава образа (`GENERATION_OUTFIT`). */
export const OUTFIT_ITEM_CONFIG_FIELDS: Record<string, OutfitConfigField[]> = {
  "1": [
    {
      id: "visorSide",
      type: "slider",
      min: 0,
      max: 3,
      step: 1,
      labels: ["visorFront", "visorRight", "visorBack", "visorLeft"],
    },
  ],
  "2": [
    {
      id: "style",
      type: "segmented",
      options: [
        { id: "oversize", labelKey: "oversize" },
        { id: "fitted", labelKey: "fitted" },
      ],
    },
  ],
  "3": [
    {
      id: "style",
      type: "segmented",
      options: [
        { id: "oversize", labelKey: "oversize" },
        { id: "fitted", labelKey: "fitted" },
      ],
    },
    {
      id: "fastener",
      type: "slider",
      min: 0,
      max: 2,
      step: 1,
      labels: ["unbuttoned", "pct50", "buttoned"],
    },
    {
      id: "sleeve",
      type: "segmented",
      options: [
        { id: "straight", labelKey: "sleeveStraight" },
        { id: "rolled", labelKey: "sleeveRolled" },
        { id: "pushed", labelKey: "sleevePushed" },
      ],
    },
    {
      id: "sleeveRoll",
      type: "slider",
      min: 0,
      max: 2,
      step: 1,
      labels: ["pct0", "pct50", "pct100"],
    },
    {
      id: "collarType",
      type: "segmented",
      options: [
        { id: "regular", labelKey: "collarRegular" },
        { id: "standing", labelKey: "collarStanding" },
      ],
    },
  ],
  "4": [
    {
      id: "styling",
      type: "segmented",
      options: [
        { id: "regular", labelKey: "stylingRegular" },
        { id: "cuffed", labelKey: "stylingCuffed" },
      ],
    },
    {
      id: "cuffRoll",
      type: "slider",
      min: 0,
      max: 2,
      step: 1,
      labels: ["pct0", "pct50", "pct100"],
    },
    {
      id: "fit",
      type: "segmented",
      options: [
        { id: "high", labelKey: "fitHigh" },
        { id: "regular", labelKey: "fitRegular" },
        { id: "low", labelKey: "fitLow" },
      ],
    },
    {
      id: "tuckedInFootwear",
      type: "segmented",
      options: [
        { id: "tuckedIn", labelKey: "tuckedIn" },
        { id: "notTuckedIn", labelKey: "notTuckedIn" },
      ],
    },
  ],
  "5": [
    {
      id: "lacing",
      type: "segmented",
      options: [
        { id: "laced", labelKey: "laced" },
        { id: "unlaced", labelKey: "unlaced" },
      ],
    },
  ],
  "6": [
    {
      id: "glassesPlacement",
      type: "segmented",
      options: [
        { id: "onEyes", labelKey: "onEyes" },
        { id: "onHead", labelKey: "onHead" },
        { id: "onClothing", labelKey: "onClothing" },
      ],
    },
  ],
  "7": [
    {
      id: "carryHand",
      type: "segmented",
      options: [
        { id: "left", labelKey: "handLeft" },
        { id: "right", labelKey: "handRight" },
      ],
    },
  ],
  "9": [
    {
      id: "carryHand",
      type: "segmented",
      options: [
        { id: "left", labelKey: "handLeft" },
        { id: "right", labelKey: "handRight" },
      ],
    },
  ],
};

/** Значения по умолчанию — как в макете Figma. */
export const OUTFIT_ITEM_CONFIG_DEFAULTS: Record<string, OutfitItemConfigValues> = {
  "1": { visorSide: 2 },
  "2": { style: "fitted" },
  "3": {
    style: "oversize",
    fastener: 2,
    sleeve: "rolled",
    sleeveRoll: 1,
    collarType: "standing",
  },
  "4": {
    styling: "cuffed",
    cuffRoll: 1,
    fit: "low",
    tuckedInFootwear: "notTuckedIn",
  },
  "5": { lacing: "laced" },
  "6": { glassesPlacement: "onEyes" },
  "7": { carryHand: "left" },
  "9": { carryHand: "right" },
};

export function defaultConfigForItem(itemId: string): OutfitItemConfigValues {
  return { ...(OUTFIT_ITEM_CONFIG_DEFAULTS[itemId] ?? {}) };
}

export function hasItemConfig(itemId: string): boolean {
  return Boolean(OUTFIT_ITEM_CONFIG_FIELDS[itemId]?.length);
}
