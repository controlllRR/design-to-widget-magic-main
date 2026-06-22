import heroConfiguring from "@/assets/generation/hero-configuring.png";
import heroGeneration from "@/assets/generation/hero-generation.png";
import profile0 from "@/assets/generation/profile-0.png";
import profile1 from "@/assets/generation/profile-1.png";
import profileAdd from "@/assets/generation/profile-add.png";

import poseFront from "@/assets/generation/pose-front.png";
import poseThreeQuarter from "@/assets/generation/pose-three-quarter.png";
import poseBack from "@/assets/generation/pose-back.png";
import poseSide from "@/assets/generation/pose-side.png";
import poseDetail from "@/assets/generation/pose-detail.png";
import poseDecollete from "@/assets/generation/pose-decollete.png";
import poseFace from "@/assets/generation/pose-face.png";
import poseEar from "@/assets/generation/pose-ear.png";
import poseHand from "@/assets/generation/pose-hand.png";
import poseLegs from "@/assets/generation/pose-legs.png";

import wearCap from "@/assets/generation/wear/cap.png";
import wearTee from "@/assets/generation/wear/tee.png";
import wearShirt from "@/assets/generation/wear/shirt.png";
import wearJeans from "@/assets/generation/wear/jeans.png";
import wearSneakers from "@/assets/generation/wear/sneakers.png";
import wearGlasses from "@/assets/generation/wear/glasses.png";
import wearWatch from "@/assets/generation/wear/watch.png";
import wearBag from "@/assets/generation/wear/bag.png";
import wearLooks from "@/assets/generation/wear/looks.png";

import btnPlus from "@/assets/generation/add-wear/btn-plus.png";
import type { LucideIcon } from "lucide-react";

export interface OutfitItem {
  id: string;
  name: string;
  category: string;
  size?: string;
}

export type WearSlotKind = "item" | "add" | "looks";

export interface WearSlot {
  id: string;
  kind: WearSlotKind;
  outfitItemId?: string;
  thumbnail?: string;
  icon?: LucideIcon;
}

export const GENERATION_HERO = {
  configuring: heroConfiguring,
  generation: heroGeneration,
} as const;

export const PROFILE_AVATARS = [
  { src: profile0, kind: "photo" as const },
  { src: profile1, kind: "photo" as const },
  { src: profileAdd, kind: "add" as const },
] as const;

/** Состав образа — Figma `674:4769` / `1157:14519` (название + категория). */
export const GENERATION_OUTFIT: OutfitItem[] = [
  { id: "1", name: "Бейсболка Unisex базовая", category: "Кепка", size: "56/60" },
  { id: "2", name: "Футболка LOVALU", category: "Футболка", size: "48 RU / M" },
  { id: "3", name: "Рубашка Getoni приталенная", category: "Рубашка", size: "46 RU / M" },
  { id: "4", name: "Джинсы GaaM прямые", category: "Джинсы", size: "50 RU / 34" },
  { id: "5", name: "Кеды adidas URBAN COURT", category: "Кеды", size: "42" },
  {
    id: "6",
    name: "Солнцезащитные очки мужские женские, для взрослых, повседневные, солнечные, классические Clubmaster",
    category: "Очки солнцезащитные",
  },
  {
    id: "7",
    name: "Casio Часы наручные Кварцевые Часы классические",
    category: "Часы",
  },
  {
    id: "9",
    name: "Спортивная дорожная сумка (21л; Чёрная; Кожаная)",
    category: "Сумка",
  },
];

export const PRELOADER_OUTFIT: OutfitItem[] = GENERATION_OUTFIT;

/** Боковые плитки hero — Figma `674:4649` / nEJeT6wB7wu3XOya5ZMPPH. */
export const GENERATION_WEAR_LEFT: WearSlot[] = [
  { id: "cap", kind: "item", outfitItemId: "1", thumbnail: wearCap },
  { id: "tee", kind: "item", outfitItemId: "2", thumbnail: wearTee },
  { id: "shirt", kind: "item", outfitItemId: "3", thumbnail: wearShirt },
  { id: "jeans", kind: "item", outfitItemId: "4", thumbnail: wearJeans },
  { id: "sneakers", kind: "item", outfitItemId: "5", thumbnail: wearSneakers },
  { id: "add-left", kind: "add", thumbnail: btnPlus },
];

export const GENERATION_WEAR_RIGHT: WearSlot[] = [
  { id: "glasses", kind: "item", outfitItemId: "6", thumbnail: wearGlasses },
  { id: "watch", kind: "item", outfitItemId: "7", thumbnail: wearWatch },
  { id: "bag", kind: "item", outfitItemId: "9", thumbnail: wearBag },
  { id: "add-right", kind: "add", thumbnail: btnPlus },
  { id: "looks", kind: "looks", thumbnail: wearLooks },
];

export const OUTFIT_TO_WEAR: Record<string, string> = {
  "1": "cap",
  "2": "tee",
  "3": "shirt",
  "4": "jeans",
  "5": "sneakers",
  "6": "glasses",
  "7": "watch",
  "9": "bag",
};

export const POSE_ROW_1 = ["front", "three-quarter", "back", "side", "detail"] as const;
export const POSE_ROW_2 = ["decollete", "face", "ear", "hand", "legs"] as const;

export type PoseId = (typeof POSE_ROW_1)[number] | (typeof POSE_ROW_2)[number];

export const POSE_IMAGES: Record<PoseId, string> = {
  front: poseFront,
  "three-quarter": poseThreeQuarter,
  side: poseSide,
  back: poseBack,
  detail: poseDetail,
  decollete: poseDecollete,
  face: poseFace,
  ear: poseEar,
  hand: poseHand,
  legs: poseLegs,
};

export const POSE_LABELS: Record<string, string> = {
  front: "спереди",
  "three-quarter": "3/4",
  side: "сбоку",
  back: "сзади",
  detail: "торс",
  decollete: "декольте",
  face: "лицо",
  ear: "ухо",
  hand: "рука",
  legs: "ноги",
};
