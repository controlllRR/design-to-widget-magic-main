import type { ProfileFieldId } from "./types";
import heightFemale from "@/assets/measure-guides/figma/height-female.png";
import heightMale from "@/assets/measure-guides/figma/height-male.png";
import chestFemale from "@/assets/measure-guides/figma/chest-female.png";
import chestMale from "@/assets/measure-guides/figma/chest-male.png";
import shoulderFemale from "@/assets/measure-guides/figma/shoulder-female.png";
import shoulderMale from "@/assets/measure-guides/figma/shoulder-male.png";
import waistFemale from "@/assets/measure-guides/figma/waist-female.png";
import waistMale from "@/assets/measure-guides/figma/waist-male.png";
import hipsFemale from "@/assets/measure-guides/figma/hips-female.png";
import hipsMale from "@/assets/measure-guides/figma/hips-male.png";
import legLengthFemale from "@/assets/measure-guides/figma/leg-length-female.png";
import legLengthMale from "@/assets/measure-guides/figma/leg-length-male.png";
import footLength from "@/assets/measure-guides/figma/foot-length.png";
import footWidth from "@/assets/measure-guides/figma/foot-width.png";
import footArch from "@/assets/measure-guides/figma/foot-arch.png";
import sizeChartLegLength from "@/assets/measure-guides/figma/size-chart-leg-length.png";

export type MeasureGuideGender = "female" | "male";

/** Поля bottom-sheet «как измерить» + длина ног (из таблицы размеров). */
export type MeasureGuideKey = ProfileFieldId | "legLength";

type MeasureGuideCardEntry =
  | Partial<Record<MeasureGuideGender, string>>
  | string;

/** Figma-карточки 411px — pixel-perfect экспорт (Info*.png). */
export const MEASURE_GUIDE_CARDS: Partial<
  Record<MeasureGuideKey, MeasureGuideCardEntry>
> = {
  height: { female: heightFemale, male: heightMale },
  chest: { female: chestFemale, male: chestMale },
  shoulderSize: { female: shoulderFemale, male: shoulderMale },
  waist: { female: waistFemale, male: waistMale },
  hips: { female: hipsFemale, male: hipsMale },
  legLength: { female: legLengthFemale, male: legLengthMale },
  footLength,
  footWidth,
  footArch,
};

export const SIZE_CHART_LEG_LENGTH_CARD = sizeChartLegLength;

export function resolveMeasureGuideCard(
  fieldId: MeasureGuideKey,
  gender: MeasureGuideGender,
): string | undefined {
  const entry = MEASURE_GUIDE_CARDS[fieldId];
  if (!entry) return undefined;
  if (typeof entry === "string") return entry;
  return entry[gender] ?? entry.female;
}
