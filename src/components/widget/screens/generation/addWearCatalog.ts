/** Каталог пикеров — Figma `873:3554` Add an image element / `873:3585` Add Accessory. */

export type OutfitTabId = "head" | "torso" | "legs" | "feet";
export type AccessoryTabId = "face" | "ears" | "neck" | "hands" | "back";

export interface AddWearItem {
  id: string;
  /** Figma Image element node для экспорта иконки. */
  figmaNodeId: string;
  /** В макете плитка с тёмным фоном (#343537). */
  selected?: boolean;
}

export interface AddWearTab<T extends string> {
  id: T;
  label: string;
  items: AddWearItem[];
}

export const ADD_OUTFIT_SHEET_FIGMA = "873:3554";
export const ADD_ACCESSORY_SHEET_FIGMA = "873:3585";

export const OUTFIT_ADD_TABS: AddWearTab<OutfitTabId>[] = [
  {
    id: "head",
    label: "голова",
    items: [
      { id: "head-cap", figmaNodeId: "873:3916", selected: true },
      { id: "head-bandana", figmaNodeId: "873:3927" },
      { id: "head-wig", figmaNodeId: "873:3938" },
    ],
  },
  {
    id: "torso",
    label: "торс",
    items: [
      { id: "torso-jacket", figmaNodeId: "873:3947", selected: true },
      { id: "torso-hoodie", figmaNodeId: "873:3954" },
      { id: "torso-blazer", figmaNodeId: "873:3966" },
      { id: "torso-vest", figmaNodeId: "873:3975" },
      { id: "torso-dress", figmaNodeId: "873:3983" },
      { id: "torso-tee", figmaNodeId: "873:3993" },
      { id: "torso-tank", figmaNodeId: "873:4003" },
      { id: "torso-swimsuit", figmaNodeId: "873:4596" },
      { id: "torso-bra", figmaNodeId: "873:4603" },
    ],
  },
  {
    id: "legs",
    label: "ноги",
    items: [
      { id: "legs-skirt", figmaNodeId: "873:4706" },
      { id: "legs-pants", figmaNodeId: "873:4713", selected: true },
      { id: "legs-leggings", figmaNodeId: "873:4723" },
      { id: "legs-shorts", figmaNodeId: "873:4734" },
      { id: "legs-underwear", figmaNodeId: "873:4745" },
    ],
  },
  {
    id: "feet",
    label: "стопы",
    items: [
      { id: "feet-shoes", figmaNodeId: "873:4753", selected: true },
      { id: "feet-socks", figmaNodeId: "873:4754" },
    ],
  },
];

export const ACCESSORY_ADD_TABS: AddWearTab<AccessoryTabId>[] = [
  {
    id: "face",
    label: "лицо",
    items: [
      { id: "face-glasses", figmaNodeId: "873:4610", selected: true },
      { id: "face-makeup", figmaNodeId: "873:4616" },
      { id: "face-beard", figmaNodeId: "1223:27458" },
    ],
  },
  {
    id: "ears",
    label: "уши",
    items: [{ id: "ears-earrings", figmaNodeId: "873:4649", selected: true }],
  },
  {
    id: "neck",
    label: "шея",
    items: [
      { id: "neck-chain", figmaNodeId: "873:4678", selected: true },
      { id: "neck-tie", figmaNodeId: "873:4686" },
      { id: "neck-scarf", figmaNodeId: "873:4697" },
    ],
  },
  {
    id: "hands",
    label: "руки",
    items: [
      { id: "hands-bag", figmaNodeId: "873:4900", selected: true },
      { id: "hands-watch-l", figmaNodeId: "873:4905" },
      { id: "hands-watch-r", figmaNodeId: "873:4912" },
      { id: "hands-bracelet-l", figmaNodeId: "873:4917" },
      { id: "hands-bracelet-r", figmaNodeId: "873:4922" },
    ],
  },
  {
    id: "back",
    label: "спина",
    items: [{ id: "back-backpack", figmaNodeId: "873:4927" }],
  },
];
