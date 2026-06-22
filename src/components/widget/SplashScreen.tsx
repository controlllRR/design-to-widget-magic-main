import { useWidgetConfig } from "@/widget/config";
import { useResolvedSplashImages } from "@/widget/config/useResolvedSplashImages";
import { SplashSlider } from "./SplashSlider";
import { Watermark } from "./Watermark";
import { BrandLogo } from "./BrandLogo";

interface SplashScreenProps {
  onStart: () => void;
  /** Начальный слайд hero-карусели (0-based). */
  initialSlideIndex?: number;
  /** Зафиксировать слайд (gallery QA). */
  freezeSlider?: boolean;
}

/**
 * Splash-экран виджета — первое, что видит пользователь.
 * Все тексты, изображения, цвета, watermark и логотип берутся из useWidgetConfig().
 * Размеры — fluid через clamp() (см. styles.css → [data-vf-root]).
 */
export function SplashScreen({
  onStart,
  initialSlideIndex = 0,
  freezeSlider = false,
}: SplashScreenProps) {
  const { config, t } = useWidgetConfig();
  const { splash } = config;
  const slideImages = useResolvedSplashImages(splash.images);
  const slideIndex = Math.min(
    Math.max(initialSlideIndex, 0),
    Math.max(slideImages.length - 1, 0),
  );
  const autoplayMs = freezeSlider ? 0 : splash.autoplayMs;

  return (
    <div
      className="flex flex-col w-full h-full min-w-0"
      style={{ fontFamily: "var(--vf-font-body)" }}
    >
      {/* Hero card */}
      <div
        className="flex flex-col w-full min-w-0"
        style={{
          paddingInline: "var(--vf-sp-12)",
          paddingTop: "var(--vf-sp-12)",
        }}
      >
        <div
          className="relative w-full overflow-hidden"
          style={{
            height: "var(--vf-h-hero)",
            borderRadius: "var(--vf-radius-card)",
            backgroundColor: "var(--vf-primary)",
            boxShadow: "var(--vf-shadow-card)",
          }}
        >
          <SplashSlider
            images={slideImages}
            autoplayMs={autoplayMs}
            initialIndex={slideIndex}
          />

          {/* Лёгкое тёмное затемнение снизу для контраста точек */}
          <div
            className="absolute inset-x-0 bottom-0 pointer-events-none"
            style={{
              height: "clamp(64px, 21cqw, 80px)",
              background:
                "linear-gradient(to top, rgba(0,0,0,0.35), rgba(0,0,0,0))",
            }}
            aria-hidden
          />

          {/* Логотип сайта-хоста */}
          <div
            className="absolute left-0 right-0 flex items-center justify-center min-w-0"
            style={{
              top: "var(--vf-sp-20)",
              paddingInline: "var(--vf-sp-20)",
            }}
          >
            <BrandLogo />
          </div>
        </div>
      </div>

      {/* Текстовый блок */}
      <div
        className="flex flex-col items-center w-full min-w-0 text-center"
        style={{
          gap: "var(--vf-sp-12)",
          paddingInline: "var(--vf-sp-24)",
          paddingTop: "var(--vf-sp-28)",
          paddingBottom: "var(--vf-sp-8)",
        }}
      >
        <h1
          className="uppercase leading-[1.1]"
          style={{
            fontFamily: "var(--vf-font-heading)",
            fontWeight: 700,
            fontSize: "var(--vf-fs-26)",
            color: "var(--vf-text)",
            letterSpacing: "0.01em",
          }}
        >
          {t.splash.title}
        </h1>
        <p
          className="leading-[1.5]"
          style={{
            fontSize: "var(--vf-fs-13)",
            maxWidth: "min(280px, 100%)",
            color: "var(--vf-text-muted)",
            fontWeight: 300,
          }}
        >
          {t.splash.subtitle}
        </p>
      </div>

      {/* CTA + watermark прижаты к низу */}
      <div className="mt-auto flex flex-col w-full min-w-0">
        <div
          className="flex flex-col w-full min-w-0"
          style={{
            paddingInline: "var(--vf-sp-12)",
            paddingTop: "var(--vf-sp-20)",
          }}
        >
          <button
            type="button"
            onClick={onStart}
            className="flex items-center justify-center w-full transition-colors hover:opacity-90 min-w-0"
            style={{
              gap: "var(--vf-sp-10)",
              height: "var(--vf-sz-46)",
              paddingInline: "var(--vf-sp-28)",
              paddingBlock: "var(--vf-sp-12)",
              backgroundColor: "var(--vf-btn-bg)",
              borderRadius: "var(--vf-radius-button)",
            }}
          >
            <span
              className="uppercase whitespace-nowrap"
              style={{
                fontFamily: "var(--vf-font-body)",
                fontSize: "var(--vf-fs-12)",
                fontWeight: 800,
                letterSpacing: "1.08px",
                color: "var(--vf-btn-text)",
              }}
            >
              {t.splash.cta}
            </span>
          </button>
        </div>

        <Watermark />
      </div>
    </div>
  );
}
