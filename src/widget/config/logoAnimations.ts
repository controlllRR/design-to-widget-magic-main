import type { LogoAnimationId } from "./types";

export type LogoAnimationGroup = "entrance" | "loop" | "effect";

export interface LogoAnimationOption {
  id: LogoAnimationId;
  label: string;
  hint: string;
  group: LogoAnimationGroup;
}

export const LOGO_ANIMATION_GROUP_LABELS: Record<LogoAnimationGroup, string> = {
  entrance: "Появление",
  loop: "Цикл",
  effect: "Эффект",
};

/** Полный каталог анимаций логотипа (порядок = UI). */
export const LOGO_ANIMATION_OPTIONS: LogoAnimationOption[] = [
  // —— появление ——
  {
    id: "fadeIn",
    label: "Fade",
    hint: "Плавное появление",
    group: "entrance",
  },
  {
    id: "slideDown",
    label: "Сверху",
    hint: "Съезд сверху",
    group: "entrance",
  },
  {
    id: "slideUp",
    label: "Снизу",
    hint: "Съезд снизу",
    group: "entrance",
  },
  {
    id: "slideLeft",
    label: "Слева",
    hint: "Выезд слева",
    group: "entrance",
  },
  {
    id: "slideRight",
    label: "Справа",
    hint: "Выезд справа",
    group: "entrance",
  },
  {
    id: "scaleIn",
    label: "Масштаб",
    hint: "Увеличение из центра",
    group: "entrance",
  },
  {
    id: "pop",
    label: "Pop",
    hint: "Упругое появление",
    group: "entrance",
  },
  {
    id: "rotateIn",
    label: "Поворот",
    hint: "Лёгкий поворот при появлении",
    group: "entrance",
  },
  {
    id: "flipX",
    label: "Flip X",
    hint: "Переворот по горизонтали",
    group: "entrance",
  },
  {
    id: "flipY",
    label: "Flip Y",
    hint: "Переворот по вертикали",
    group: "entrance",
  },
  {
    id: "blurIn",
    label: "Blur",
    hint: "Из размытия в фокус",
    group: "entrance",
  },
  {
    id: "bounceIn",
    label: "Bounce",
    hint: "Отскок при появлении",
    group: "entrance",
  },
  {
    id: "dropIn",
    label: "Drop",
    hint: "Падение сверху с отскоком",
    group: "entrance",
  },
  {
    id: "expandX",
    label: "Растяг",
    hint: "Раскрытие по ширине",
    group: "entrance",
  },
  {
    id: "skewIn",
    label: "Skew",
    hint: "Появление со сдвигом",
    group: "entrance",
  },
  // —— цикл ——
  {
    id: "float",
    label: "Парение",
    hint: "Мягкое покачивание вверх-вниз",
    group: "loop",
  },
  {
    id: "pulse",
    label: "Пульс",
    hint: "Пульсация прозрачности",
    group: "loop",
  },
  {
    id: "breathe",
    label: "Дыхание",
    hint: "Лёгкое изменение масштаба",
    group: "loop",
  },
  {
    id: "bounce",
    label: "Прыжок",
    hint: "Небольшой прыжок по кругу",
    group: "loop",
  },
  {
    id: "wiggle",
    label: "Wiggle",
    hint: "Покачивание влево-вправо",
    group: "loop",
  },
  {
    id: "swing",
    label: "Маятник",
    hint: "Качели вокруг верха",
    group: "loop",
  },
  {
    id: "sway",
    label: "Sway",
    hint: "Мягкий наклон",
    group: "loop",
  },
  {
    id: "heartbeat",
    label: "Сердце",
    hint: "Двойной удар масштаба",
    group: "loop",
  },
  {
    id: "jelly",
    label: "Желе",
    hint: "Упругая деформация",
    group: "loop",
  },
  // —— эффект ——
  {
    id: "shimmer",
    label: "Блик",
    hint: "Бегущий блик по логотипу",
    group: "effect",
  },
  {
    id: "glow",
    label: "Свечение",
    hint: "Пульсирующее свечение",
    group: "effect",
  },
  {
    id: "glitch",
    label: "Glitch",
    hint: "Цифровой сбой",
    group: "effect",
  },
  {
    id: "neon",
    label: "Неон",
    hint: "Неоновое мерцание",
    group: "effect",
  },
  {
    id: "zoomPulse",
    label: "Zoom",
    hint: "Пульс масштаба с fade",
    group: "effect",
  },
];

export const LOGO_ANIMATION_IDS = LOGO_ANIMATION_OPTIONS.map((o) => o.id);

export function isLogoAnimationId(value: string): value is LogoAnimationId {
  return LOGO_ANIMATION_IDS.includes(value as LogoAnimationId);
}
