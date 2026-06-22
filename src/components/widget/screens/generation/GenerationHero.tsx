import { GENERATION_HERO } from "@/components/widget/screens/generation/data";
import {
  GenerationHeroOverlay,
  type GenerationHeroOverlayProps,
} from "@/components/widget/screens/generation/GenerationHeroOverlay";
import { GenerationPreloaderOverlay } from "@/components/widget/screens/generation/GenerationPreloaderOverlay";
import type { ReactNode } from "react";

export function GenerationHero({
  height,
  overlay,
  src = GENERATION_HERO.generation,
  wearRails,
  ...wearProps
}: {
  height?: number | string;
  overlay?: ReactNode;
  src?: string;
  wearRails?: boolean;
} & GenerationHeroOverlayProps) {
  return (
    <div
      className="relative mx-3 overflow-hidden shrink-0 min-w-0"
      style={{
        height: height ?? "var(--vf-h-hero)",
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
  height,
  label = "примерка",
}: {
  height?: number | string;
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
