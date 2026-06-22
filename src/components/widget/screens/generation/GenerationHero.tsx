import { GENERATION_HERO } from "@/components/widget/screens/generation/data";
import {
  GenerationHeroOverlay,
  type GenerationHeroOverlayProps,
} from "@/components/widget/screens/generation/GenerationHeroOverlay";
import { GenerationPreloaderOverlay } from "@/components/widget/screens/generation/GenerationPreloaderOverlay";
import type { ReactNode } from "react";

export function GenerationHero({
  height = 516,
  overlay,
  src = GENERATION_HERO.generation,
  wearRails,
  ...wearProps
}: {
  height?: number;
  overlay?: ReactNode;
  src?: string;
  wearRails?: boolean;
} & GenerationHeroOverlayProps) {
  return (
    <div
      className="relative mx-3 overflow-hidden shrink-0"
      style={{
        height,
        backgroundColor: "var(--vf-card-hero)",
      }}
    >
      <img
        src={src}
        alt=""
        className="w-full h-full object-cover object-top"
        draggable={false}
      />
      {wearRails && <GenerationHeroOverlay {...wearProps} />}
      {overlay}
    </div>
  );
}

/** @deprecated Use `GenerationHero` + `GenerationPreloaderOverlay`. */
export function GenerationHeroSkeleton({
  height = 516,
  label = "примерка",
}: {
  height?: number;
  label?: string;
}) {
  return (
    <GenerationHero
      height={height}
      wearRails
      disabled
      overlay={<GenerationPreloaderOverlay label={label} />}
    />
  );
}
