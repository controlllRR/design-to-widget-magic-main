/** Круглый radio на карточках Start-page — как в прототипе. */
export function RadioDot({
  active,
  onDark = false,
}: {
  active: boolean;
  onDark?: boolean;
}) {
  const ring = onDark ? "rgba(255,255,255,0.55)" : "var(--vf-text)";
  const dot = onDark ? "#ffffff" : "var(--vf-text)";

  return (
    <span
      aria-hidden
      className="rounded-full flex items-center justify-center shrink-0"
      style={{
        width: "clamp(14px, 4.4cqw, 16px)",
        height: "clamp(14px, 4.4cqw, 16px)",
        border: `1px solid ${ring}`,
        backgroundColor: "rgba(255,255,255,0.6)",
      }}
    >
      {active && (
        <span
          className="rounded-full"
          style={{
            width: "clamp(7px, 2.2cqw, 8px)",
            height: "clamp(7px, 2.2cqw, 8px)",
            backgroundColor: dot,
          }}
        />
      )}
    </span>
  );
}
