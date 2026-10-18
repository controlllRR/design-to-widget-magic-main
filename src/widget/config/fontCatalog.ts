/**
 * Каталог шрифтов для админки и подключения через Google Fonts.
 * `value` — готовый CSS font-family стек для theme.fonts.
 */
export interface FontOption {
  id: string;
  /** Подпись в select. */
  label: string;
  /** CSS font-family. */
  value: string;
  /** Семейство для Google Fonts CSS2 API (без family=). */
  googleFamily?: string;
}

export const FONT_CATALOG: FontOption[] = [
  {
    id: "tiktok-sans",
    label: "TikTok Sans",
    value: "'TikTok Sans', 'Manrope', sans-serif",
    googleFamily: "TikTok+Sans:opsz,wdth,wght@12..36,75..125,300..900",
  },
  {
    id: "manrope",
    label: "Manrope",
    value: "'Manrope', sans-serif",
    googleFamily: "Manrope:wght@200..800",
  },
  {
    id: "inter",
    label: "Inter",
    value: "'Inter', sans-serif",
    googleFamily: "Inter:wght@300..700",
  },
  {
    id: "onest",
    label: "Onest",
    value: "'Onest', sans-serif",
    googleFamily: "Onest:wght@300..800",
  },
  {
    id: "golos-text",
    label: "Golos Text",
    value: "'Golos Text', sans-serif",
    googleFamily: "Golos+Text:wght@400;500;600;700",
  },
  {
    id: "montserrat",
    label: "Montserrat",
    value: "'Montserrat', sans-serif",
    googleFamily: "Montserrat:wght@400;500;600;700",
  },
  {
    id: "nunito",
    label: "Nunito",
    value: "'Nunito', sans-serif",
    googleFamily: "Nunito:wght@400;500;600;700;800",
  },
  {
    id: "rubik",
    label: "Rubik",
    value: "'Rubik', sans-serif",
    googleFamily: "Rubik:wght@300..700",
  },
  {
    id: "pt-sans",
    label: "PT Sans",
    value: "'PT Sans', sans-serif",
    googleFamily: "PT+Sans:wght@400;700",
  },
  {
    id: "source-sans-3",
    label: "Source Sans 3",
    value: "'Source Sans 3', sans-serif",
    googleFamily: "Source+Sans+3:wght@300..700",
  },
  {
    id: "dm-sans",
    label: "DM Sans",
    value: "'DM Sans', sans-serif",
    googleFamily: "DM+Sans:wght@400;500;600;700",
  },
  {
    id: "outfit",
    label: "Outfit",
    value: "'Outfit', sans-serif",
    googleFamily: "Outfit:wght@300..700",
  },
  {
    id: "plus-jakarta",
    label: "Plus Jakarta Sans",
    value: "'Plus Jakarta Sans', sans-serif",
    googleFamily: "Plus+Jakarta+Sans:wght@400;500;600;700",
  },
  {
    id: "space-grotesk",
    label: "Space Grotesk",
    value: "'Space Grotesk', sans-serif",
    googleFamily: "Space+Grotesk:wght@400;500;600;700",
  },
  {
    id: "ibm-plex-sans",
    label: "IBM Plex Sans",
    value: "'IBM Plex Sans', sans-serif",
    googleFamily: "IBM+Plex+Sans:wght@400;500;600;700",
  },
  {
    id: "geologica",
    label: "Geologica",
    value: "'Geologica', sans-serif",
    googleFamily: "Geologica:wght@300..700",
  },
  {
    id: "unbounded",
    label: "Unbounded",
    value: "'Unbounded', sans-serif",
    googleFamily: "Unbounded:wght@400;500;600;700",
  },
  {
    id: "playfair",
    label: "Playfair Display",
    value: "'Playfair Display', serif",
    googleFamily: "Playfair+Display:wght@400;500;600;700",
  },
  {
    id: "literata",
    label: "Literata",
    value: "'Literata', serif",
    googleFamily: "Literata:wght@400;500;600;700",
  },
  {
    id: "roboto",
    label: "Roboto",
    value: "'Roboto', sans-serif",
    googleFamily: "Roboto:wght@300;400;500;700",
  },
  {
    id: "open-sans",
    label: "Open Sans",
    value: "'Open Sans', sans-serif",
    googleFamily: "Open+Sans:wght@400;500;600;700",
  },
];

/** URL Google Fonts со всеми шрифтами каталога. */
export function googleFontsCatalogHref(): string {
  const families = FONT_CATALOG.map((f) => f.googleFamily)
    .filter((f): f is string => Boolean(f))
    .map((f) => `family=${f}`)
    .join("&");
  return `https://fonts.googleapis.com/css2?${families}&display=swap`;
}

/** Найти опцию по сохранённому CSS-стеку (или ближайшую). */
export function matchFontOption(cssValue: string): FontOption {
  const exact = FONT_CATALOG.find((f) => f.value === cssValue);
  if (exact) return exact;
  const normalized = cssValue.toLowerCase();
  const byName = FONT_CATALOG.find((f) =>
    normalized.includes(f.label.toLowerCase().replace(/\s+/g, " ")),
  );
  return byName ?? FONT_CATALOG[0]!;
}
