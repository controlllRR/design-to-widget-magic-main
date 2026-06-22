import type { SVGProps } from "react";

export type SilhouetteProps = SVGProps<SVGSVGElement>;

/** ID-варианты телосложения (одинаковые для женского и мужского). */
export type BodyTypeId =
  | "veryThin"
  | "thin"
  | "average"
  | "slightlyFull"
  | "full";

/** ID-варианты «размер груди»: используется и для женского (грудь), и для мужского (грудная клетка). */
export type BreastSizeId =
  | "verySmall"
  | "small"
  | "average"
  | "large"
  | "veryLarge";

/** ID-варианты «форма плеч» — порядок столбцов в спрайте слева направо. */
export type ShoulderShapeId =
  | "normal"
  | "sloped"
  | "rectangular"
  | "muscular"
  | "bony";

/** ID-варианты «тип фигуры» — порядок столбцов в спрайте Figma. */
export type FigureShapeId =
  | "rectangle"
  | "circle"
  | "invertedTriangle"
  | "hourglass"
  | "triangle";

/** ID-варианты «размер бёдер». */
export type HipsSizeId =
  | "narrow"
  | "slightlyNarrow"
  | "average"
  | "slightlyWide"
  | "wide";

/** ID-варианты «форма бёдер» (5 столбцов). */
export type HipsShapeId =
  | "square"
  | "pear"
  | "invertedTriangle"
  | "circle"
  | "invertedHeart";

/** ID-варианты «живот» (4 столбца). */
export type BellyShapeId = "flat" | "small" | "average" | "large";

/** ID-варианты «длина шеи» (4 столбца). */
export type NeckLengthId = "veryShort" | "short" | "average" | "long";
