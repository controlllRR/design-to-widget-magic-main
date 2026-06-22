import { useWidgetConfig } from "@/widget/config";

/**
 * Водяной знак внизу экранов и bottom sheet'ов.
 * Единый источник: config.watermark (админка).
 */
export function Watermark({ compact }: { compact?: boolean } = {}) {
  const { config } = useWidgetConfig();
  const { watermark } = config;
  const visible = watermark.removableOnPlan ? watermark.enabled : true;

  if (!visible) return null;

  const linkProps = watermark.openInNewTab
    ? { target: "_blank" as const, rel: "noopener noreferrer" }
    : {};

  const content = watermark.href ? (
    <a
      href={watermark.href}
      {...linkProps}
      className="uppercase tracking-wide hover:opacity-70 transition-opacity truncate"
      style={{
        fontSize: "var(--vf-fs-10)",
        color: "var(--vf-text)",
        fontFamily: "var(--vf-font-body)",
        fontWeight: 500,
      }}
    >
      {watermark.text}
    </a>
  ) : (
    <span
      className="uppercase tracking-wide truncate"
      style={{
        fontSize: "var(--vf-fs-10)",
        color: "var(--vf-text)",
        fontFamily: "var(--vf-font-body)",
        fontWeight: 500,
      }}
    >
      {watermark.text}
    </span>
  );

  return (
    <div
      className="flex items-center justify-center w-full min-w-0"
      style={{
        paddingLeft: "var(--vf-sp-10)",
        paddingRight: "var(--vf-sp-10)",
        paddingTop: compact ? "var(--vf-sp-6)" : "var(--vf-sp-12)",
        paddingBottom: compact ? "var(--vf-sp-6)" : "var(--vf-sp-12)",
      }}
    >
      {content}
    </div>
  );
}
