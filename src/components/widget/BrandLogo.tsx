import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { useWidgetConfig } from "@/widget/config";
import defaultLogoUrl from "@/assets/brand/default-logo.svg";
import type { LogoAnimationId } from "@/widget/config";
import { isMediaIdbRef, resolveMediaRef } from "@/widget/config/media-assets";

interface BrandLogoProps {
  /** Переопределить тип анимации (для предпросмотра в админке). */
  animationOverride?: LogoAnimationId;
  /** Переопределить включённость анимации (для предпросмотра в админке). */
  enabledOverride?: boolean;
  /** Сделать логотип некликабельным (для предпросмотра). */
  disableLink?: boolean;
  /** Высота логотипа в стиле (по умолчанию var(--vf-sz-22)). */
  height?: string;
  /** Принудительно отключить инверсию в белый. */
  invertOverride?: boolean;
  /** Уникальный ключ — позволяет перезапустить keyframes (нужно для предпросмотра). */
  animationKey?: string | number;
  className?: string;
}

/**
 * Логотип сайта-хоста с поддержкой png / jpg / svg и опциональной анимацией.
 * Все параметры берутся из useWidgetConfig().brand, при необходимости
 * переопределяются для предпросмотра в админке.
 *
 * Важно: анимация «shimmer» использует ::after — его нельзя вешать на <img>
 * (replaced element), поэтому аним-класс всегда на обёртке.
 */
export function BrandLogo({
  animationOverride,
  enabledOverride,
  disableLink,
  height = "var(--vf-sz-22)",
  invertOverride,
  animationKey,
  className,
}: BrandLogoProps) {
  const { config } = useWidgetConfig();
  const { brand } = config;

  const rawUrl = brand.logoUrl ?? defaultLogoUrl;
  const [resolvedUrl, setResolvedUrl] = useState(() =>
    isMediaIdbRef(rawUrl) ? "" : rawUrl,
  );

  useEffect(() => {
    let cancelled = false;
    let objectUrl: string | undefined;

    async function load() {
      if (!isMediaIdbRef(rawUrl)) {
        setResolvedUrl(rawUrl);
        return;
      }
      const url = await resolveMediaRef(rawUrl);
      if (cancelled) {
        if (url.startsWith("blob:")) URL.revokeObjectURL(url);
        return;
      }
      objectUrl = url.startsWith("blob:") ? url : undefined;
      setResolvedUrl(url || defaultLogoUrl);
    }

    void load();

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [rawUrl]);

  const enabled = enabledOverride ?? brand.logoAnimationEnabled;
  const animation: LogoAnimationId = animationOverride ?? brand.logoAnimation;
  const invert = invertOverride ?? brand.logoInvert;

  const animClass = enabled ? `vf-logo-anim-${animation}` : "";

  const imgStyle: CSSProperties = {
    height,
    width: "auto",
    objectFit: "contain",
    display: "block",
    filter: invert ? "brightness(0) invert(1)" : undefined,
  };

  const media: ReactNode = resolvedUrl ? (
    <img
      src={resolvedUrl}
      alt={brand.logoAlt}
      className="block max-h-full w-auto"
      style={imgStyle}
      draggable={false}
    />
  ) : (
    <span
      className="uppercase truncate"
      style={{
        fontSize: "var(--vf-fs-12)",
        color: "var(--vf-on-primary)",
        fontFamily: "var(--vf-font-heading)",
        fontWeight: 600,
        letterSpacing: "0.4em",
      }}
    >
      {brand.logoAlt}
    </span>
  );

  const inner = (
    <span
      key={animationKey}
      className={`vf-logo inline-flex items-center max-w-full ${animClass} ${className ?? ""}`.trim()}
      style={{ height }}
    >
      {media}
    </span>
  );

  if (disableLink || !brand.siteUrl) {
    return inner;
  }

  return (
    <a
      href={brand.siteUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="block min-w-0"
      aria-label={brand.logoAlt}
    >
      {inner}
    </a>
  );
}
