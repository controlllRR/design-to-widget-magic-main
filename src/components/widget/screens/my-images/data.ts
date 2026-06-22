import heroGeneration from "@/assets/generation/hero-generation.png";
import animate1 from "@/assets/animate/tile-1.png";
import animate2 from "@/assets/animate/tile-2.png";
import animate3 from "@/assets/animate/tile-3.png";
import animate4 from "@/assets/animate/tile-4.png";
import animate5 from "@/assets/animate/tile-5.png";
import animate6 from "@/assets/animate/tile-6.png";

export interface TryOnCard {
  id: string;
  imageUrl: string;
}

/** Карточки «мои примерки» — Figma `1169:15884`. */
export const MY_IMAGES_CARDS: TryOnCard[] = [
  { id: "tryon-1", imageUrl: heroGeneration },
  { id: "tryon-2", imageUrl: animate1 },
  { id: "tryon-3", imageUrl: animate2 },
  { id: "tryon-4", imageUrl: animate3 },
  { id: "tryon-5", imageUrl: animate4 },
  { id: "tryon-6", imageUrl: animate5 },
  { id: "tryon-7", imageUrl: animate6 },
];
