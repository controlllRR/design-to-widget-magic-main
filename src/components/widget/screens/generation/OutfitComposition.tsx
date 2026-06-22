import { AlertTriangle, ShoppingCart } from "lucide-react";
import { useWidgetConfig } from "@/widget/config";
import type { OutfitItem } from "./data";
import {
  iconCartAdd,
  OUTFIT_WARNING_ORANGE,
} from "./outfitCompositionIcons";

export function OutfitComposition({
  items,
  skeleton,
  highlightedId,
  onItemSelect,
  onBuyAll,
}: {
  items: OutfitItem[];
  skeleton?: boolean;
  highlightedId?: string | null;
  onItemSelect?: (id: string) => void;
  onBuyAll?: () => void;
}) {
  const { t } = useWidgetConfig();

  return (
    <section style={{ paddingInline: "var(--vf-sp-12)" }}>
      <h2
        className="mb-3 px-0"
        style={{
          fontFamily: "var(--vf-font-heading)",
          fontSize: "var(--vf-fs-14)",
          fontWeight: 700,
          lineHeight: 1.2,
        }}
      >
        {t.screens.generation.outfitTitle}
      </h2>
      <div className="flex flex-col">
        {items.map((item, index) => {
          const active = highlightedId === item.id;
          const isLast = index === items.length - 1;
          return (
            <div
              key={item.id}
              role="button"
              tabIndex={skeleton ? -1 : 0}
              onClick={() => !skeleton && onItemSelect?.(item.id)}
              onKeyDown={(e) => {
                if (!skeleton && (e.key === "Enter" || e.key === " ")) {
                  e.preventDefault();
                  onItemSelect?.(item.id);
                }
              }}
              className={`flex items-center gap-1 min-h-[48px] py-2 cursor-pointer${isLast ? "" : " border-b"}`}
              style={{
                borderColor: "#e5e7eb",
                backgroundColor: active ? "var(--vf-surface-muted)" : undefined,
                borderRadius: active ? 8 : undefined,
              }}
            >
              <div className="flex-1 min-w-0">
                {skeleton ? (
                  <>
                    <div
                      className="h-3 rounded mb-1.5 animate-pulse"
                      style={{
                        backgroundColor: "var(--vf-surface-muted)",
                        width: "75%",
                      }}
                    />
                    <div
                      className="h-2 rounded animate-pulse"
                      style={{
                        backgroundColor: "var(--vf-surface-muted)",
                        width: "40%",
                      }}
                    />
                  </>
                ) : (
                  <>
                    <p
                      className="truncate leading-tight"
                      style={{
                        fontSize: "var(--vf-fs-14)",
                        fontWeight: 500,
                        letterSpacing: "-0.02em",
                      }}
                    >
                      {item.name}
                    </p>
                    <p
                      className="truncate mt-0.5 leading-tight"
                      style={{
                        fontSize: "var(--vf-fs-10)",
                        fontWeight: 500,
                        color: "#b9b9b9",
                        letterSpacing: "-0.02em",
                      }}
                    >
                      {item.category}
                    </p>
                  </>
                )}
              </div>
              {item.size && (
                <div
                  className="shrink-0 h-8 px-2 flex items-center justify-center rounded-xl text-sm tabular-nums"
                  style={{
                    border: "1px solid #e5e7eb",
                    fontSize: "var(--vf-fs-14)",
                    fontWeight: 500,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {skeleton ? "—" : item.size}
                </div>
              )}
              <button
                type="button"
                aria-label="В корзину"
                disabled={skeleton}
                onClick={(e) => e.stopPropagation()}
                className="shrink-0 w-[42px] h-8 flex items-center justify-center rounded-xl disabled:opacity-40"
                style={{
                  backgroundColor: active ? "var(--vf-primary)" : undefined,
                }}
              >
                <img
                  src={iconCartAdd}
                  alt=""
                  className="w-[18px] h-[18px] object-contain"
                  draggable={false}
                  style={
                    active
                      ? { filter: "brightness(0) invert(1)" }
                      : undefined
                  }
                />
              </button>
            </div>
          );
        })}
      </div>

      <BuyAllButton disabled={skeleton} onClick={onBuyAll} />
    </section>
  );
}

/** Кнопка «купить всё» — Figma `674:4788`. */
export function BuyAllButton({
  disabled,
  onClick,
}: {
  disabled?: boolean;
  onClick?: () => void;
}) {
  const { t } = useWidgetConfig();

  return (
    <div
      style={{
        paddingTop: 12,
        paddingBottom: 8,
        borderTop: "1px solid color-mix(in oklab, var(--vf-primary) 50%, transparent)",
      }}
    >
      <button
        type="button"
        disabled={disabled}
        onClick={onClick}
        className="mt-0 w-full flex items-center justify-center gap-2.5 disabled:opacity-40 disabled:cursor-not-allowed"
        style={{
          height: 46,
          borderRadius: 50,
          backgroundColor: "var(--vf-primary)",
          color: "var(--vf-on-primary)",
          paddingInline: 28,
          paddingBlock: 12,
        }}
      >
        <ShoppingCart size={22} strokeWidth={1.5} aria-hidden />
        <span
          className="uppercase"
          style={{
            fontSize: 12,
            fontWeight: 800,
            letterSpacing: "0.09em",
            lineHeight: 1.2,
          }}
        >
          {t.screens.generation.buyAll}
        </span>
      </button>
    </div>
  );
}

/** Предупреждение о размере — Figma `674:4789` / `674:4790`. */
export function SizeWarningBanner() {
  const { t } = useWidgetConfig();

  return (
    <div
      className="flex gap-3 items-start"
      style={{ paddingInline: "var(--vf-sp-12)" }}
    >
      <AlertTriangle
        size={18}
        strokeWidth={1.5}
        className="shrink-0"
        style={{ color: OUTFIT_WARNING_ORANGE }}
        fill="none"
        aria-hidden
      />
      <p
        className="flex-1 min-w-0"
        style={{
          fontSize: 12,
          fontWeight: 200,
          lineHeight: 1.5,
          color: "var(--vf-text)",
        }}
      >
        {t.screens.generation.sizeWarning}
      </p>
    </div>
  );
}
