import type { CSSProperties } from "react";
import { useWidgetConfig } from "@/widget/config";
import defaultLogoUrl from "@/assets/brand/default-logo.svg";
import type { LogoAnimationId } from "@/widget/config";

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

  const url = brand.logoUrl ?? defaultLogoUrl;
  const enabled = enabledOverride ?? brand.logoAnimationEnabled;
  const animation: LogoAnimationId = animationOverride ?? brand.logoAnimation;
  const invert = invertOverride ?? brand.logoInvert;

  const animClass = enabled ? `vf-logo-anim-${animation}` : "";

  const imgStyle: CSSProperties = {
    height,
    width: "auto",
    objectFit: "contain",
    filter: invert ? "brightness(0) invert(1)" : undefined,
  };

  const inner = url ? (
    <img
      key={animationKey}
      src={url}
      alt={brand.logoAlt}
      className={`vf-logo block ${animClass} ${className ?? ""}`.trim()}
      style={imgStyle}
      draggable={false}
    />
  ) : (
    <span
      key={animationKey}
      className={`vf-logo uppercase truncate ${animClass} ${className ?? ""}`.trim()}
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
