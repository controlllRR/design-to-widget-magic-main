import { useEffect, useState } from "react";

interface SplashSliderProps {
  images: string[];
  /** мс; 0 — без автопрокрутки */
  autoplayMs: number;
  /** Начальный слайд (gallery QA). */
  initialIndex?: number;
}

/**
 * Лёгкий fade-слайдер для splash-экрана. Без внешних зависимостей.
 * Пауза на hover/touch, точки-индикаторы, ARIA-метки.
 */
export function SplashSlider({ images, autoplayMs, initialIndex = 0 }: SplashSliderProps) {
  const [index, setIndex] = useState(initialIndex);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (images.length <= 1 || autoplayMs <= 0 || paused) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, autoplayMs);
    return () => window.clearInterval(id);
  }, [images.length, autoplayMs, paused]);

  if (images.length === 0) {
    return (
      <div
        className="absolute inset-0"
        style={{ backgroundColor: "var(--vf-surface-muted)" }}
        aria-hidden
      />
    );
  }

  return (
    <div
      className="absolute inset-0"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
      role="group"
      aria-roledescription="carousel"
    >
      {images.map((src, i) => (
        <div
          key={src + i}
          aria-hidden={i !== index}
          className="absolute inset-0 transition-opacity duration-700 ease-in-out"
          style={{
            backgroundImage: `url(${src})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: i === index ? 1 : 0,
          }}
        />
      ))}

      {images.length > 1 && (
        <div className="absolute bottom-[16px] left-0 right-0 flex items-center justify-center gap-[6px]">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Слайд ${i + 1}`}
              onClick={() => setIndex(i)}
              className="size-[6px] rounded-full transition-all"
              style={{
                backgroundColor:
                  i === index ? "var(--vf-on-primary)" : "rgba(255,255,255,0.4)",
                width: i === index ? 18 : 6,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
