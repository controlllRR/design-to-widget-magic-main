import { Plus, X } from "lucide-react";
import type { CSSProperties } from "react";
import type { PhotoSlotFitMode } from "@/widget/config";

interface PhotoSlotProps {
  /** URL загруженного фото; если undefined — пустой слот. */
  src?: string;
  label: string;
  /** Подсказка-«звёздочка», что слот обязательный. */
  required?: boolean;
  /** Вариант подсветки: ошибка (красная рамка) для invalid-состояния. */
  invalid?: boolean;
  /**
   * Режим отображения загруженного фото:
   *  - "cover" (default): фото заполняет слот, прижато к верху.
   *  - "contain-fill": фото целиком (contain), а пустоты по бокам — то же фото cover c прозрачностью на подложке fillBg.
   */
  fitMode?: PhotoSlotFitMode;
  /** Цвет подложки под fill-слоем для режима "contain-fill". */
  fillBg?: string;
  onUpload?: () => void;
  onRemove?: () => void;
}

/**
 * Слот загрузки фото профиля.
 * Пустой:   квадрат на surface-muted, круг с пунктиром и плюс посередине, label-pill снизу.
 * Заполнен: фото на всю площадь, крестик в правом верхнем углу, label-pill снизу.
 * При invalid рисуется красная рамка (для ошибки валидации).
 */
export function PhotoSlot({
  src,
  label,
  required,
  invalid,
  fitMode = "cover",
  fillBg = "#ACACAC",
  onUpload,
  onRemove,
}: PhotoSlotProps) {
  const wrapStyle: CSSProperties = {
    aspectRatio: "1 / 1",
    borderRadius: "var(--vf-radius-card)",
    backgroundColor: "var(--vf-surface-muted)",
    border: invalid ? "1px solid var(--vf-error, #e63946)" : "2px solid transparent",
    overflow: "hidden",
  };

  return (
    <div className="relative w-full min-w-0" style={wrapStyle}>
      {src ? (
        <>
          {fitMode === "contain-fill" ? (
            <>
              {/* Подложка-цвет */}
              <div
                className="absolute inset-0"
                style={{ backgroundColor: fillBg }}
                aria-hidden
              />
              {/* Фоновый слой — то же фото cover с прозрачностью */}
              <img
                src={src}
                alt=""
                aria-hidden
                className="absolute inset-0 w-full h-full object-cover"
                style={{ opacity: 0.2 }}
              />
              {/* Передний слой — фото целиком (contain) */}
              <img
                src={src}
                alt={label}
                className="absolute inset-0 w-full h-full object-contain"
              />
            </>
          ) : (
            <img
              src={src}
              alt={label}
              className="absolute inset-0 w-full h-full object-cover"
              style={{ objectPosition: "center top" }}
            />
          )}
          {onRemove && (
            <button
              type="button"
              aria-label="Удалить фото"
              onClick={onRemove}
              className="absolute flex items-center justify-center"
              style={{
                top: 8,
                right: 8,
                width: 28,
                height: 28,
                borderRadius: 999,
                backgroundColor: "rgba(255,255,255,0.9)",
              }}
            >
              <X strokeWidth={1.5} style={{ width: 16, height: 16, color: "var(--vf-text)" }} />
            </button>
          )}
        </>
      ) : (
        <button
          type="button"
          onClick={onUpload}
          className="absolute inset-0 flex items-center justify-center"
          style={{ paddingBottom: "30%" }}
          aria-label={`${label}${required ? " (обязательно)" : ""}`}
        >
          <span
            aria-hidden
            className="rounded-full flex items-center justify-center"
            style={{
              width: "44%",
              aspectRatio: "1 / 1",
              border: "1px dashed color-mix(in oklab, var(--vf-text) 50%, transparent)",
            }}
          >
            <Plus
              strokeWidth={1.2}
              style={{
                width: "32%",
                height: "32%",
                color: "color-mix(in oklab, var(--vf-text) 70%, transparent)",
              }}
            />
          </span>
        </button>
      )}

      {/* Подпись-pill */}
      <div
        className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center"
        style={{
          bottom: 12,
          paddingInline: 12,
          paddingBlock: 6,
          backgroundColor: src ? "var(--vf-surface)" : "var(--vf-surface)",
          borderRadius: 999,
          maxWidth: "calc(100% - 16px)",
          boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
        }}
      >
        <span
          className="truncate"
          style={{
            fontFamily: "var(--vf-font-body)",
            fontSize: "var(--vf-fs-12)",
            fontWeight: 500,
            color: "var(--vf-text)",
          }}
        >
          {label}
        </span>
      </div>
    </div>
  );
}
