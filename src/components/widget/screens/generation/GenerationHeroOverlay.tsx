import { BrushCleaning, MoreHorizontal, type LucideIcon } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";
import {
  GENERATION_WEAR_LEFT,
  GENERATION_WEAR_RIGHT,
  type WearSlot,
} from "./data";

const TILE = "var(--vf-sz-46)";

function wearTileStyle(isAdd: boolean): CSSProperties {
  if (isAdd) {
    return {
      width: TILE,
      height: TILE,
      borderRadius: 12,
      backgroundColor: "var(--vf-surface)",
    };
  }

  return {
    width: TILE,
    height: TILE,
    borderRadius: 12,
    backgroundColor: "var(--vf-surface)",
    overflow: "hidden",
  };
}

function WearRailButton({
  slot,
  disabled,
  onClick,
}: {
  slot: WearSlot;
  disabled?: boolean;
  onClick: () => void;
}) {
  const isAdd = slot.kind === "add";
  const isIconTile = isAdd || slot.kind === "looks";
  const Icon = slot.icon;

  return (
    <button
      type="button"
      disabled={disabled}
      aria-label={slot.id}
      onClick={onClick}
      className="shrink-0 flex items-center justify-center disabled:opacity-40"
      style={wearTileStyle(isAdd)}
    >
      {slot.thumbnail ? (
        <img
          src={slot.thumbnail}
          alt=""
          className={isIconTile ? "w-full h-full object-contain" : "w-full h-full object-cover"}
          draggable={false}
        />
      ) : Icon ? (
        <Icon size={isAdd ? 22 : 18} strokeWidth={1.5} />
      ) : null}
    </button>
  );
}

function HeroUtilityButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled?: boolean;
  onClick?: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      aria-label={label}
      onClick={onClick}
      className="shrink-0 flex items-center justify-center disabled:opacity-40"
      style={{
        width: TILE,
        height: TILE,
        borderRadius: 12,
        backgroundColor: "var(--vf-surface)",
      }}
    >
      {children}
    </button>
  );
}

export type { WearSlot };

export interface GenerationHeroOverlayProps {
  selectedWearId?: string | null;
  slideIndex?: number;
  slideCount?: number;
  disabled?: boolean;
  onWearSelect?: (slot: WearSlot) => void;
  onSlideChange?: (index: number) => void;
  /** Figma `clean` — очистить весь образ. */
  onClearOutfit?: () => void;
  /** Figma `more-horizontal` — доп. действия (гардероб). */
  onMore?: () => void;
  clearOutfitLabel?: string;
  moreActionsLabel?: string;
  /** Превью выбранного набора на кнопке лукбука. */
  looksThumbnail?: string;
}

/** Боковые колонки + контролы — Figma `674:4653` / `674:4649`. */
export function GenerationHeroOverlay({
  slideIndex = 0,
  slideCount = 3,
  disabled,
  onWearSelect,
  onSlideChange,
  onClearOutfit,
  onMore,
  clearOutfitLabel = "Очистить образ",
  moreActionsLabel = "Ещё",
  looksThumbnail,
}: GenerationHeroOverlayProps) {
  const leftItems = GENERATION_WEAR_LEFT.filter((s) => s.kind === "item");
  const leftAdd = GENERATION_WEAR_LEFT.find((s) => s.kind === "add");
  const rightItems = GENERATION_WEAR_RIGHT.filter((s) => s.kind === "item");
  const rightAdd = GENERATION_WEAR_RIGHT.find((s) => s.kind === "add");
  const rightLooksBase = GENERATION_WEAR_RIGHT.find((s) => s.kind === "looks");
  const rightLooks =
    rightLooksBase && looksThumbnail
      ? { ...rightLooksBase, thumbnail: looksThumbnail }
      : rightLooksBase;

  const railBtn = (slot: WearSlot) => (
    <WearRailButton
      key={slot.id}
      slot={slot}
      disabled={disabled}
      onClick={() => onWearSelect?.(slot)}
    />
  );

  return (
    <>
      <div className="vf-hero-rail vf-hero-rail--left" aria-label="Одежда образа">
        <div className="flex flex-col gap-1.5">{leftItems.map(railBtn)}</div>
        {leftAdd && railBtn(leftAdd)}
        <div className="flex-1 min-h-0" />
        <HeroUtilityButton
          label={clearOutfitLabel}
          disabled={disabled}
          onClick={onClearOutfit}
        >
          <BrushCleaning size={18} strokeWidth={1.5} />
        </HeroUtilityButton>
      </div>

      <div className="vf-hero-rail vf-hero-rail--right" aria-label="Аксессуары">
        <div className="flex flex-col gap-1.5">{rightItems.map(railBtn)}</div>
        {rightAdd && railBtn(rightAdd)}
        {rightLooks && railBtn(rightLooks)}
        <div className="flex-1 min-h-0" />
        <HeroUtilityButton label={moreActionsLabel} disabled={disabled} onClick={onMore}>
          <MoreHorizontal size={18} strokeWidth={1.5} />
        </HeroUtilityButton>
      </div>

      <div className="vf-hero-dots" role="tablist" aria-label="Кадры">
        {Array.from({ length: slideCount }, (_, i) => (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={slideIndex === i}
            disabled={disabled}
            onClick={() => onSlideChange?.(i)}
            className="rounded-full disabled:opacity-40"
            style={{
              width: slideIndex === i ? 6 : 4,
              height: slideIndex === i ? 6 : 4,
              backgroundColor:
                slideIndex === i
                  ? "var(--vf-text)"
                  : "color-mix(in oklab, var(--vf-text) 20%, transparent)",
            }}
          />
        ))}
      </div>
    </>
  );
}
