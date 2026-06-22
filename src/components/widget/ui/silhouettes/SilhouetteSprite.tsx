import femaleSprite from "@/assets/silhouettes/female-sprite.svg";
import maleSprite from "@/assets/silhouettes/male-sprite.svg";
import type { Gender } from "./index";
import type { SilhouetteProps } from "./types";

/**
 * Категории иконок, которые поддерживаются.
 * Соответствуют рядам карточек в исходных макетах Figma
 * (`Иконки_женские-2.svg` / `Иконки_мужские-2.svg`).
 *
 * ВАЖНО: layout у двух гендеров отличается — у женщин есть дополнительная
 * строка «форма груди», поэтому y-координаты строк ниже неё сдвинуты.
 * Координаты получены из позиций rect-карточек: y_строки = y_карточки + 60.
 */
type IconCategory =
  | "bodyType"
  | "figureShape"
  | "breastSize"
  | "hipsSize"
  | "hipsShape"
  | "belly"
  | "neckLength"
  | "shoulderShape";

interface CategoryLayout {
  /** Y-координата верхней границы строки иконок (в координатах исходного SVG 375×N). */
  y: number;
  /** Высота строки иконок. */
  h: number;
}

/**
 * Layout для женского спрайта.
 * Порядок строк (y карточек +60 для области иконок):
 *   1) bodyType        y=22
 *   2) figureShape     y=193.4
 *   3) breastSize      y=372.8
 *   4) breastShape     y=544.2  (пропускаем — нет в UI)
 *   5) hipsSize        y=723.6
 *   6) hipsShape       y=895     (пропускаем — нет в UI)
 *   7) belly           y=1074.4
 *   8) neckLength      y=1245.8
 *   9) shoulderShape   y=1417.2
 */
/**
 * Унифицированная высота строки иконок — одинаковая для всех категорий,
 * чтобы силуэты на разных карточках выглядели одного визуального размера
 * (как в карточке «телосложение»). y подобран так, чтобы контент строки
 * остался центрированным относительно своей исходной области.
 */
const ROW_H = 60;

const FEMALE_ROW_LAYOUT: Record<IconCategory, CategoryLayout> = {
  bodyType:       { y: 82,     h: ROW_H },
  figureShape:    { y: 255.5,  h: ROW_H }, // было y=253, h=65
  breastSize:     { y: 433,    h: ROW_H },
  hipsSize:       { y: 781.5,  h: ROW_H }, // было y=784, h=55
  hipsShape:      { y: 955,    h: ROW_H },
  belly:          { y: 1134,   h: ROW_H },
  neckLength:     { y: 1306,   h: ROW_H },
  shoulderShape:  { y: 1482,   h: ROW_H }, // было y=1477, h=70
};

const MALE_ROW_LAYOUT: Record<IconCategory, CategoryLayout> = {
  bodyType:       { y: 82,     h: ROW_H },
  figureShape:    { y: 255.5,  h: ROW_H },
  breastSize:     { y: 433,    h: ROW_H },
  hipsSize:       { y: 601.5,  h: ROW_H }, // было y=604, h=55
  hipsShape:      { y: 775.6,  h: ROW_H },
  belly:          { y: 955,    h: ROW_H },
  neckLength:     { y: 1126,   h: ROW_H },
  shoulderShape:  { y: 1303,   h: ROW_H }, // было y=1298, h=70
};

/** X-центры пяти столбцов иконок (одинаковы для всех строк и гендеров). */
const COL_CENTERS = [64.5, 126.5, 188.5, 250.5, 312.5] as const;
/** Окно кропа — симметрично вокруг центра столбца, только область силуэта. */
const ICON_W = 48;
const ICON_H = 46;
const ICON_PAD_TOP = 5;

interface SilhouetteSpriteProps extends Omit<SilhouetteProps, "viewBox"> {
  gender: Gender;
  category: IconCategory;
  /** Индекс варианта 0..4 слева направо. Для категорий с 4 вариантами допустимо 0..3. */
  index: number;
}

/**
 * Универсальный рендер одной иконки из спрайта Figma.
 * Использует `<image href={spriteUrl}>` со смещённым `viewBox`,
 * чтобы вырезать ровно нужный фрагмент исходного SVG без
 * необходимости вручную редактировать пути.
 *
 * Цвет берётся из самого SVG (#343537). На активной плашке
 * силуэт инвертируется через CSS-фильтр (родитель добавляет класс).
 */
export function SilhouetteSprite({
  gender,
  category,
  index,
  ...rest
}: SilhouetteSpriteProps) {
  const sprite = gender === "female" ? femaleSprite : maleSprite;
  const layout =
    gender === "female"
      ? FEMALE_ROW_LAYOUT[category]
      : MALE_ROW_LAYOUT[category];
  const cx = COL_CENTERS[Math.max(0, Math.min(4, index))];
  // У «широких» бёдер силуэт шире и левый контур упирается в край окна кропа.
  const cropShiftX = category === "hipsSize" && index === 4 ? -2 : 0;
  const cropExtraW = category === "hipsSize" && index === 4 ? 4 : 0;
  const x = cx - ICON_W / 2 + cropShiftX;
  const cropW = ICON_W + cropExtraW;
  const cropY = layout.y + ICON_PAD_TOP;
  const cropH = ICON_H;

  // Спрайты имеют разную полную высоту, но image тегу важна только
  // та область, которую обрезает viewBox.
  const SPRITE_W = 375;
  const SPRITE_H = gender === "female" ? 1786 : 1607;

  return (
    <svg
      viewBox={`${x} ${cropY} ${cropW} ${cropH}`}
      preserveAspectRatio="xMidYMid meet"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <image href={sprite} width={SPRITE_W} height={SPRITE_H} x={0} y={0} />
    </svg>
  );
}

export type { IconCategory };
