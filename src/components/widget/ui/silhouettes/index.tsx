import type { ComponentType } from "react";
import type {
  BodyTypeId,
  BreastSizeId,
  ShoulderShapeId,
  FigureShapeId,
  HipsSizeId,
  HipsShapeId,
  BellyShapeId,
  NeckLengthId,
  SilhouetteProps,
} from "./types";
import { SilhouetteSprite } from "./SilhouetteSprite";

export type Gender = "female" | "male";

/** Порядок столбцов в спрайтовых SVG (строго слева направо). */
const BODY_ORDER: BodyTypeId[] = [
  "veryThin",
  "thin",
  "average",
  "slightlyFull",
  "full",
];
const BREAST_ORDER: BreastSizeId[] = [
  "verySmall",
  "small",
  "average",
  "large",
  "veryLarge",
];
const SHOULDER_ORDER: ShoulderShapeId[] = [
  "normal",
  "sloped",
  "rectangular",
  "muscular",
  "bony",
];
const FIGURE_ORDER: FigureShapeId[] = [
  "rectangle",
  "circle",
  "invertedTriangle",
  "hourglass",
  "triangle",
];
const HIPS_ORDER: HipsSizeId[] = [
  "narrow",
  "slightlyNarrow",
  "average",
  "slightlyWide",
  "wide",
];
const HIPS_SHAPE_ORDER: HipsShapeId[] = [
  "square",
  "pear",
  "invertedTriangle",
  "circle",
  "invertedHeart",
];
const BELLY_ORDER: BellyShapeId[] = ["flat", "small", "average", "large"];
const NECK_ORDER: NeckLengthId[] = ["veryShort", "short", "average", "long"];

type SpriteCategory =
  | "bodyType"
  | "breastSize"
  | "shoulderShape"
  | "figureShape"
  | "hipsSize"
  | "hipsShape"
  | "belly"
  | "neckLength";

/**
 * Фабрика компонента для одной иконки спрайта.
 * Возвращает мемо-стабильный компонент, чтобы карты ниже создавались один раз.
 */
function makeIcon(
  gender: Gender,
  category: SpriteCategory,
  index: number,
): ComponentType<SilhouetteProps> {
  const Comp = (props: SilhouetteProps) => (
    <SilhouetteSprite
      gender={gender}
      category={category}
      index={index}
      {...props}
    />
  );
  Comp.displayName = `Sprite(${gender},${category},${index})`;
  return Comp;
}

function buildMap<T extends string>(
  gender: Gender,
  category: SpriteCategory,
  order: T[],
) {
  const map = {} as Record<T, ComponentType<SilhouetteProps>>;
  order.forEach((id, i) => {
    map[id] = makeIcon(gender, category, i);
  });
  return map;
}

/** Карты «id → React-компонент SVG», отдельно для каждого пола. */
export const bodyTypeIcons: Record<
  Gender,
  Record<BodyTypeId, ComponentType<SilhouetteProps>>
> = {
  female: buildMap("female", "bodyType", BODY_ORDER),
  male: buildMap("male", "bodyType", BODY_ORDER),
};

export const breastSizeIcons: Record<
  Gender,
  Record<BreastSizeId, ComponentType<SilhouetteProps>>
> = {
  female: buildMap("female", "breastSize", BREAST_ORDER),
  male: buildMap("male", "breastSize", BREAST_ORDER),
};

export const shoulderShapeIcons: Record<
  Gender,
  Record<ShoulderShapeId, ComponentType<SilhouetteProps>>
> = {
  female: buildMap("female", "shoulderShape", SHOULDER_ORDER),
  male: buildMap("male", "shoulderShape", SHOULDER_ORDER),
};

export const figureShapeIcons: Record<
  Gender,
  Record<FigureShapeId, ComponentType<SilhouetteProps>>
> = {
  female: buildMap("female", "figureShape", FIGURE_ORDER),
  male: buildMap("male", "figureShape", FIGURE_ORDER),
};

export const hipsSizeIcons: Record<
  Gender,
  Record<HipsSizeId, ComponentType<SilhouetteProps>>
> = {
  female: buildMap("female", "hipsSize", HIPS_ORDER),
  male: buildMap("male", "hipsSize", HIPS_ORDER),
};

export const hipsShapeIcons: Record<
  Gender,
  Record<HipsShapeId, ComponentType<SilhouetteProps>>
> = {
  female: buildMap("female", "hipsShape", HIPS_SHAPE_ORDER),
  male: buildMap("male", "hipsShape", HIPS_SHAPE_ORDER),
};

export const bellyIcons: Record<
  Gender,
  Record<BellyShapeId, ComponentType<SilhouetteProps>>
> = {
  female: buildMap("female", "belly", BELLY_ORDER),
  male: buildMap("male", "belly", BELLY_ORDER),
};

export const neckLengthIcons: Record<
  Gender,
  Record<NeckLengthId, ComponentType<SilhouetteProps>>
> = {
  female: buildMap("female", "neckLength", NECK_ORDER),
  male: buildMap("male", "neckLength", NECK_ORDER),
};

export type {
  BodyTypeId,
  BreastSizeId,
  ShoulderShapeId,
  FigureShapeId,
  HipsSizeId,
  HipsShapeId,
  BellyShapeId,
  NeckLengthId,
  SilhouetteProps,
};
export type { Gender as SilhouetteGender };
