import { useCallback, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { X } from "lucide-react";
import {
  CATALOG_PRICE_DEFAULT_MAX,
  CATALOG_PRICE_DEFAULT_MIN,
  CATALOG_PRICE_MAX,
  CATALOG_PRICE_MIN,
} from "./catalogFilter";

const PRICE_STEP = 100;

function formatPrice(value: number): string {
  return value.toLocaleString("ru-RU");
}

function parsePrice(raw: string): number | null {
  const digits = raw.replace(/\s/g, "").replace(/[^\d]/g, "");
  if (!digits) return null;
  const n = Number(digits);
  return Number.isFinite(n) ? n : null;
}

function clampPrice(value: number): number {
  return Math.min(CATALOG_PRICE_MAX, Math.max(CATALOG_PRICE_MIN, value));
}

function snapPrice(value: number): number {
  const snapped = Math.round(value / PRICE_STEP) * PRICE_STEP;
  return clampPrice(snapped);
}

function PricePill({
  value,
  onChange,
  onClear,
  ariaLabel,
}: {
  value: number;
  onChange: (next: number) => void;
  onClear: () => void;
  ariaLabel: string;
}) {
  return (
    <label
      className="flex flex-1 items-center min-w-0"
      style={{
        gap: 6,
        height: 40,
        paddingInline: 14,
        borderRadius: 9999,
        backgroundColor: "#fff",
      }}
    >
      <input
        type="text"
        inputMode="numeric"
        aria-label={ariaLabel}
        className="flex-1 min-w-0 bg-transparent outline-none"
        style={{ fontSize: 14, fontWeight: 400, color: "#343537" }}
        value={formatPrice(value)}
        onChange={(e) => {
          const parsed = parsePrice(e.target.value);
          if (parsed !== null) onChange(clampPrice(parsed));
        }}
      />
      <button type="button" aria-label="Очистить" onClick={onClear} className="shrink-0 p-0">
        <X size={14} strokeWidth={1.5} style={{ color: "#343537" }} />
      </button>
    </label>
  );
}

/** Диапазон цены — Figma `1159:15361` / блок «цена (₽)». */
export function CatalogPriceRange({
  min,
  max,
  onChange,
}: {
  min: number;
  max: number;
  onChange: (min: number, max: number) => void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef<"min" | "max" | null>(null);
  const [dragging, setDragging] = useState<"min" | "max" | null>(null);

  const safeMin = clampPrice(Math.min(min, max));
  const safeMax = clampPrice(Math.max(min, max));
  const span = CATALOG_PRICE_MAX - CATALOG_PRICE_MIN;
  const leftPct = ((safeMin - CATALOG_PRICE_MIN) / span) * 100;
  const rightPct = ((safeMax - CATALOG_PRICE_MIN) / span) * 100;

  const valueFromClientX = useCallback((clientX: number): number => {
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect || rect.width <= 0) return safeMin;
    const pct = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    return snapPrice(CATALOG_PRICE_MIN + pct * span);
  }, [safeMin, span]);

  const pickThumb = useCallback(
    (clientX: number): "min" | "max" => {
      const value = valueFromClientX(clientX);
      return Math.abs(value - safeMin) <= Math.abs(value - safeMax) ? "min" : "max";
    },
    [safeMin, safeMax, valueFromClientX],
  );

  const applyThumb = useCallback(
    (thumb: "min" | "max", next: number) => {
      if (thumb === "min") {
        onChange(clampPrice(Math.min(next, safeMax)), safeMax);
        return;
      }
      onChange(safeMin, clampPrice(Math.max(next, safeMin)));
    },
    [onChange, safeMin, safeMax],
  );

  const onTrackPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    const thumb = pickThumb(e.clientX);
    draggingRef.current = thumb;
    setDragging(thumb);
    applyThumb(thumb, valueFromClientX(e.clientX));
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onTrackPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const thumb = draggingRef.current;
    if (!thumb || !e.currentTarget.hasPointerCapture(e.pointerId)) return;
    applyThumb(thumb, valueFromClientX(e.clientX));
  };

  const onTrackPointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    draggingRef.current = null;
    setDragging(null);
  };

  return (
    <div
      className="flex flex-col"
      style={{
        gap: 12,
        padding: 12,
        borderRadius: 16,
        backgroundColor: "#f6f6f6",
      }}
    >
      <div className="flex items-center min-w-0" style={{ gap: 8 }}>
        <PricePill
          value={safeMin}
          ariaLabel="Минимальная цена"
          onChange={(next) => onChange(clampPrice(Math.min(next, safeMax)), safeMax)}
          onClear={() => onChange(CATALOG_PRICE_DEFAULT_MIN, safeMax)}
        />
        <span style={{ fontSize: 14, color: "#343537" }}>—</span>
        <PricePill
          value={safeMax}
          ariaLabel="Максимальная цена"
          onChange={(next) => onChange(safeMin, clampPrice(Math.max(next, safeMin)))}
          onClear={() => onChange(safeMin, CATALOG_PRICE_DEFAULT_MAX)}
        />
      </div>

      <div
        ref={trackRef}
        className="relative touch-none select-none"
        style={{ height: 24, cursor: dragging ? "grabbing" : "pointer" }}
        onPointerDown={onTrackPointerDown}
        onPointerMove={onTrackPointerMove}
        onPointerUp={onTrackPointerUp}
        onPointerCancel={onTrackPointerUp}
        role="group"
        aria-label="Диапазон цены"
      >
        <div
          className="absolute left-0 right-0 rounded-full pointer-events-none"
          style={{
            top: "50%",
            transform: "translateY(-50%)",
            height: 1,
            backgroundColor: "#e5e7eb",
          }}
          aria-hidden
        />
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            top: "50%",
            transform: "translateY(-50%)",
            height: 3,
            left: `${leftPct}%`,
            width: `${Math.max(0, rightPct - leftPct)}%`,
            backgroundColor: "#343537",
          }}
          aria-hidden
        />
        <button
          type="button"
          tabIndex={0}
          aria-label={`Минимальная цена ${formatPrice(safeMin)}`}
          aria-valuemin={CATALOG_PRICE_MIN}
          aria-valuemax={safeMax}
          aria-valuenow={safeMin}
          className="absolute rounded-full p-0 border-0"
          style={{
            top: "50%",
            left: `${leftPct}%`,
            transform: "translate(-50%, -50%)",
            width: 16,
            height: 16,
            backgroundColor: "#343537",
            cursor: dragging === "min" ? "grabbing" : "grab",
          }}
          onPointerDown={(e) => {
            e.stopPropagation();
            draggingRef.current = "min";
            setDragging("min");
            e.currentTarget.setPointerCapture(e.pointerId);
          }}
          onPointerMove={(e) => {
            if (!e.currentTarget.hasPointerCapture(e.pointerId)) return;
            applyThumb("min", valueFromClientX(e.clientX));
          }}
          onPointerUp={(e) => {
            if (e.currentTarget.hasPointerCapture(e.pointerId)) {
              e.currentTarget.releasePointerCapture(e.pointerId);
            }
            draggingRef.current = null;
            setDragging(null);
          }}
          onPointerCancel={(e) => {
            if (e.currentTarget.hasPointerCapture(e.pointerId)) {
              e.currentTarget.releasePointerCapture(e.pointerId);
            }
            draggingRef.current = null;
            setDragging(null);
          }}
        />
        <button
          type="button"
          tabIndex={0}
          aria-label={`Максимальная цена ${formatPrice(safeMax)}`}
          aria-valuemin={safeMin}
          aria-valuemax={CATALOG_PRICE_MAX}
          aria-valuenow={safeMax}
          className="absolute rounded-full p-0 border-0"
          style={{
            top: "50%",
            left: `${rightPct}%`,
            transform: "translate(-50%, -50%)",
            width: 16,
            height: 16,
            backgroundColor: "#343537",
            cursor: dragging === "max" ? "grabbing" : "grab",
          }}
          onPointerDown={(e) => {
            e.stopPropagation();
            draggingRef.current = "max";
            setDragging("max");
            e.currentTarget.setPointerCapture(e.pointerId);
          }}
          onPointerMove={(e) => {
            if (!e.currentTarget.hasPointerCapture(e.pointerId)) return;
            applyThumb("max", valueFromClientX(e.clientX));
          }}
          onPointerUp={(e) => {
            if (e.currentTarget.hasPointerCapture(e.pointerId)) {
              e.currentTarget.releasePointerCapture(e.pointerId);
            }
            draggingRef.current = null;
            setDragging(null);
          }}
          onPointerCancel={(e) => {
            if (e.currentTarget.hasPointerCapture(e.pointerId)) {
              e.currentTarget.releasePointerCapture(e.pointerId);
            }
            draggingRef.current = null;
            setDragging(null);
          }}
        />
      </div>
    </div>
  );
}

export function resolveCatalogPriceRange(filters: {
  priceMin: number | null;
  priceMax: number | null;
}): { min: number; max: number; active: boolean } {
  const active = filters.priceMin !== null || filters.priceMax !== null;
  return {
    active,
    min: filters.priceMin ?? CATALOG_PRICE_DEFAULT_MIN,
    max: filters.priceMax ?? CATALOG_PRICE_DEFAULT_MAX,
  };
}
