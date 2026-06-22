import alertTriangle from "@/assets/warning/alert-triangle.png";

/** Иконка alert-02 — Figma `728:3672` (жёлтый треугольник с «!»). */
export function WarningTriangleIcon({ size = 32 }: { size?: number }) {
  return (
    <img
      src={alertTriangle}
      alt=""
      aria-hidden
      width={size}
      height={size}
      draggable={false}
      className="shrink-0"
      style={{ width: size, height: size }}
    />
  );
}
