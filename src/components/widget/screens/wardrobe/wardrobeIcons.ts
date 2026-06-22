/** Иконки гардероба — Figma `910:6736` / nodes `910:6755`–`910:6771`. */
import iconSearch from "@/assets/wardrobe/icon-search.svg";
import iconFilter from "@/assets/wardrobe/icon-filter.svg";
import iconEdit from "@/assets/wardrobe/icon-edit.svg";
import iconPlus from "@/assets/wardrobe/icon-plus.svg";

export const WARDROBE_FIGMA_ICONS = {
  search: iconSearch,
  filter: iconFilter,
  edit: iconEdit,
  plus: iconPlus,
} as const;

export const WARDROBE_FIGMA_NODES = {
  screen: "910:6736",
  search: "910:6755",
  filter: "910:6757",
  edit: "910:6771",
  addPlus: "910:6765",
  addTile: "910:6764",
} as const;
