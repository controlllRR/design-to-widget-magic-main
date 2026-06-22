import { defaultAnimatePoseTiles, defaultBackgroundTiles } from "@/widget/config/default-tiles";
import type { ConfigTile } from "@/widget/config/types";
import wardrobe1 from "@/assets/wardrobe/tile-1.png";
import wardrobe2 from "@/assets/wardrobe/tile-2.png";
import wardrobe3 from "@/assets/wardrobe/tile-3.png";
import wardrobe4 from "@/assets/wardrobe/tile-4.png";
import wardrobe5 from "@/assets/wardrobe/tile-5.png";
import wardrobe6 from "@/assets/wardrobe/tile-6.png";
import wardrobe7 from "@/assets/wardrobe/tile-7.png";
import wardrobe8 from "@/assets/wardrobe/tile-8.png";
import wardrobe9 from "@/assets/wardrobe/tile-9.png";
import wardrobe10 from "@/assets/wardrobe/tile-10.png";
import wardrobe11 from "@/assets/wardrobe/tile-11.png";
import storeCoat from "@/assets/store/tile-coat.png";
import storeJeans from "@/assets/store/tile-jeans.png";
import storeSneakers from "@/assets/store/tile-sneakers.png";
import storeBag from "@/assets/store/tile-bag.png";
import storeShirt from "@/assets/store/tile-shirt.png";
import storeSkirt from "@/assets/store/tile-skirt.png";
import storeDress from "@/assets/store/tile-dress.png";
import storeHeels from "@/assets/store/tile-heels.png";
import storeCap from "@/assets/store/tile-cap.png";

export interface TileItem {
  id: string;
  label: string;
  tint?: string;
  imageUrl?: string;
  /** true — рендерить imageUrl как видео (автоплей, loop, muted). */
  isVideo?: boolean;
  kind?: "item" | "set";
}

function toTileItem(tile: ConfigTile): TileItem {
  return {
    id: tile.id,
    label: tile.label,
    tint: tile.tint,
    imageUrl: tile.image,
  };
}

export const WARDROBE_TILES: TileItem[] = [
  { id: "dress-1", label: "Black midi dress", imageUrl: wardrobe1 },
  { id: "shirt-dg", label: "Рубашка DOLCE & GABBANA", imageUrl: wardrobe2 },
  { id: "dress-2", label: "Black midi dress", imageUrl: wardrobe3 },
  { id: "dress-3", label: "Black midi dress", imageUrl: wardrobe4 },
  { id: "dress-4", label: "Black midi dress", imageUrl: wardrobe5 },
  { id: "dress-5", label: "Black midi dress", imageUrl: wardrobe6 },
  { id: "dress-6", label: "Black midi dress", imageUrl: wardrobe7 },
  { id: "tee", label: "Моя футболка", imageUrl: wardrobe8 },
  { id: "dress-7", label: "Black midi dress", imageUrl: wardrobe9 },
  { id: "dress-8", label: "Black midi dress", imageUrl: wardrobe10 },
  { id: "dress-9", label: "Black midi dress", imageUrl: wardrobe11 },
];

/** Наборы раскладки — Figma `1286:10876` (Сет весна / Сет фисташка). */
export const WARDROBE_SET_TILES: TileItem[] = [
  { id: "set-spring", label: "Сет весна", imageUrl: wardrobe3, kind: "set" },
  { id: "set-pistachio", label: "Сет фисташка", imageUrl: wardrobe5, kind: "set" },
];

export const BACKGROUND_TILES: TileItem[] = defaultBackgroundTiles.map(toTileItem);

export const ANIMATE_TILES: TileItem[] = defaultAnimatePoseTiles.map(toTileItem);

export const STORE_TILES: TileItem[] = [
  { id: "coat", label: "пальто oversize", imageUrl: storeCoat },
  { id: "jeans", label: "джинсы straight", imageUrl: storeJeans },
  { id: "sneakers", label: "кроссовки runner", imageUrl: storeSneakers },
  { id: "bag", label: "сумка mini", imageUrl: storeBag },
  { id: "shirt", label: "рубашка linen", imageUrl: storeShirt },
  { id: "skirt", label: "юбка миди", imageUrl: storeSkirt },
  { id: "dress", label: "Black midi dress", imageUrl: storeDress },
  { id: "heels", label: "туфли Grid", imageUrl: storeHeels },
  { id: "cap", label: "кепка unisex", imageUrl: storeCap },
];
