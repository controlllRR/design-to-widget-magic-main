import { type RefObject } from "react";
import { Filter, Pencil, Plus, Search, X } from "lucide-react";
import { TileMedia } from "@/components/widget/ui/TileMedia";
import { WARDROBE_FIGMA_ICONS } from "./wardrobeIcons";
import type { TileItem } from "./data";

export type TileGridVariant = "default" | "wardrobe";

export function SearchFilterBar({
  placeholder,
  value,
  onChange,
  onFilter,
  filterBadgeCount,
  filterBadgeDot,
  variant = "default",
}: {
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  onFilter?: () => void;
  filterBadgeCount?: number;
  filterBadgeDot?: boolean;
  variant?: TileGridVariant;
}) {
  if (variant === "wardrobe") {
    return (
      <div className="flex" style={{ gap: 10, paddingInline: 12 }}>
        <label
          className="flex flex-1 items-center min-w-0"
          style={{
            gap: 8,
            height: 40,
            paddingInline: 16,
            borderRadius: 9999,
            border: "1px solid #343537",
            backgroundColor: "var(--vf-surface)",
          }}
        >
          <input
            className="flex-1 min-w-0 bg-transparent outline-none lowercase placeholder:lowercase"
            style={{
              fontSize: 14,
              fontWeight: 400,
              color: "var(--vf-text)",
            }}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
          <img
            src={WARDROBE_FIGMA_ICONS.search}
            alt=""
            aria-hidden
            className="shrink-0"
            style={{ width: 20, height: 20 }}
            draggable={false}
          />
        </label>
        {onFilter !== undefined && (
          <button
            type="button"
            aria-label="Фильтр"
            onClick={onFilter}
            className="relative shrink-0 flex items-center justify-center"
            style={{ width: 40, height: 40, borderRadius: 9999, padding: 9 }}
          >
            <img
              src={WARDROBE_FIGMA_ICONS.filter}
              alt=""
              aria-hidden
              style={{ width: 22, height: 22 }}
              draggable={false}
            />
            {filterBadgeDot ? (
              <span
                className="absolute rounded-full"
                style={{
                  top: 0,
                  right: 0,
                  width: 9,
                  height: 9,
                  backgroundColor: "#343537",
                }}
                aria-hidden
              />
            ) : filterBadgeCount !== undefined && filterBadgeCount > 0 ? (
              <span
                className="absolute flex items-center justify-center rounded-full text-[10px] font-bold leading-none"
                style={{
                  top: 4,
                  right: 4,
                  minWidth: 14,
                  height: 14,
                  paddingInline: 3,
                  backgroundColor: "var(--vf-primary)",
                  color: "var(--vf-on-primary)",
                }}
              >
                {filterBadgeCount}
              </span>
            ) : null}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex" style={{ gap: "var(--vf-sp-10)", paddingInline: "var(--vf-sp-12)" }}>
      <label
        className="flex flex-1 items-center min-w-0 px-4 rounded-lg border"
        style={{
          gap: "var(--vf-sp-8)",
          height: "var(--vf-sz-44)",
          borderColor: "var(--vf-border)",
          backgroundColor: "var(--vf-surface)",
        }}
      >
        <input
          className="flex-1 min-w-0 bg-transparent outline-none text-xs uppercase text-[var(--vf-text)] placeholder:text-[var(--vf-text-muted)] placeholder:uppercase"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <Search size={18} style={{ color: "var(--vf-text-muted)" }} className="shrink-0" />
      </label>
      {onFilter !== undefined && (
        <button
          type="button"
          aria-label="Фильтр"
          onClick={onFilter}
          className="relative shrink-0 flex items-center justify-center rounded-lg border"
          style={{
            width: "var(--vf-sz-44)",
            height: "var(--vf-sz-44)",
            borderColor: "var(--vf-border)",
          }}
        >
          <Filter size={18} />
          {filterBadgeCount !== undefined && filterBadgeCount > 0 && (
            <span
              className="absolute flex items-center justify-center rounded-full text-[10px] font-bold leading-none"
              style={{
                top: 6,
                right: 6,
                minWidth: 14,
                height: 14,
                paddingInline: 3,
                backgroundColor: "var(--vf-primary)",
                color: "var(--vf-on-primary)",
              }}
            >
              {filterBadgeCount}
            </span>
          )}
        </button>
      )}
    </div>
  );
}

function SelectionRadio() {
  return (
    <span
      className="absolute top-2 left-2 flex items-center justify-center rounded-full"
      style={{
        width: 18,
        height: 18,
        backgroundColor: "var(--vf-text)",
        border: "2px solid var(--vf-surface)",
      }}
      aria-hidden
    >
      <span
        className="rounded-full"
        style={{ width: 6, height: 6, backgroundColor: "var(--vf-surface)" }}
      />
    </span>
  );
}

export function TileCard({
  label,
  tint,
  imageUrl,
  isVideo,
  selected,
  add,
  editable,
  removable,
  selectionMode = "border",
  variant = "default",
  onClick,
  onEdit,
  onRemove,
}: {
  label: string;
  tint?: string;
  imageUrl?: string;
  isVideo?: boolean;
  selected?: boolean;
  add?: boolean;
  editable?: boolean;
  removable?: boolean;
  selectionMode?: "border" | "radio";
  variant?: TileGridVariant;
  onClick?: () => void;
  onEdit?: () => void;
  onRemove?: () => void;
}) {
  const isWardrobe = variant === "wardrobe";
  const tileRadius = isWardrobe ? 8 : "var(--vf-radius-tile)";
  const tileHeight = isWardrobe ? 161 : 161;

  const borderStyle =
    selectionMode === "radio"
      ? "2px solid transparent"
      : selected
        ? "2px solid var(--vf-text)"
        : "2px solid transparent";

  const addBorder = isWardrobe ? "1px dashed #343537" : "1px dashed var(--vf-border)";

  return (
    <button type="button" onClick={onClick} className="text-left w-full min-w-0">
      <div
        className="w-full overflow-hidden flex items-center justify-center relative"
        style={{
          height: tileHeight,
          borderRadius: tileRadius,
          backgroundColor: add ? "var(--vf-surface)" : (tint ?? "var(--vf-surface-muted)"),
          border: add ? addBorder : borderStyle,
        }}
      >
        {add ? (
          isWardrobe ? (
            <img
              src={WARDROBE_FIGMA_ICONS.plus}
              alt=""
              aria-hidden
              style={{ width: 32, height: 32 }}
              draggable={false}
            />
          ) : (
            <Plus size={32} strokeWidth={1.25} style={{ color: "var(--vf-text-muted)" }} />
          )
        ) : imageUrl ? (
          <TileMedia src={imageUrl} isVideo={isVideo} />
        ) : tint ? (
          <div className="w-full h-full" style={{ backgroundColor: tint }} />
        ) : null}
        {selected && selectionMode === "radio" && <SelectionRadio />}
        {editable && !add && (
          <span
            className="absolute flex items-center justify-center rounded-full"
            style={
              isWardrobe
                ? {
                    top: 6,
                    right: 6,
                    width: 32,
                    height: 32,
                    backgroundColor: "#ffffff",
                  }
                : {
                    top: 8,
                    right: 8,
                    width: 28,
                    height: 28,
                    backgroundColor: "color-mix(in oklab, var(--vf-surface) 88%, transparent)",
                    border: "1px solid var(--vf-border)",
                  }
            }
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.();
            }}
            role="presentation"
          >
            {isWardrobe ? (
              <img
                src={WARDROBE_FIGMA_ICONS.edit}
                alt=""
                aria-hidden
                style={{ width: 16, height: 16 }}
                draggable={false}
              />
            ) : (
              <Pencil size={14} strokeWidth={1.5} style={{ color: "var(--vf-text)" }} />
            )}
          </span>
        )}
        {removable && !add && (
          <button
            type="button"
            aria-label="Удалить"
            className="absolute top-2 right-2 flex items-center justify-center rounded-full"
            style={{
              width: 28,
              height: 28,
              backgroundColor: "color-mix(in oklab, var(--vf-surface) 88%, transparent)",
              border: "1px solid var(--vf-border)",
            }}
            onClick={(e) => {
              e.stopPropagation();
              onRemove?.();
            }}
          >
            <X size={14} strokeWidth={1.5} style={{ color: "var(--vf-text)" }} />
          </button>
        )}
      </div>
      <p
        className="lowercase line-clamp-2 leading-snug"
        style={
          isWardrobe
            ? {
                marginTop: 6,
                fontSize: 12,
                fontWeight: 200,
                color: "#343537",
              }
            : {
                marginTop: 6,
                fontSize: 10,
                color: "var(--vf-text)",
              }
        }
      >
        {label}
      </p>
    </button>
  );
}

export function TileGrid({
  items,
  addLabel,
  onAdd,
  selectedId,
  onSelect,
  query = "",
  columns = 3,
  editable,
  onEdit,
  removableIds,
  onRemove,
  selectionMode = "border",
  variant = "default",
  layout = "grid",
  scrollRef,
}: {
  items: TileItem[];
  addLabel?: string;
  onAdd?: () => void;
  selectedId?: string | null;
  onSelect?: (id: string) => void;
  query?: string;
  columns?: 2 | 3;
  editable?: boolean;
  onEdit?: (id: string) => void;
  removableIds?: Set<string>;
  onRemove?: (id: string) => void;
  selectionMode?: "border" | "radio";
  variant?: TileGridVariant;
  layout?: "grid" | "row";
  scrollRef?: RefObject<HTMLDivElement | null>;
}) {
  const filtered = items.filter((i) =>
    i.label.toLowerCase().includes(query.toLowerCase()),
  );

  const isWardrobe = variant === "wardrobe";

  const tiles = (
    <>
      {addLabel && (
        <TileCard
          label={addLabel}
          add
          variant={variant}
          selectionMode={selectionMode}
          onClick={onAdd}
        />
      )}
      {filtered.map((item) => (
        <TileCard
          key={item.id}
          label={item.label}
          tint={item.tint}
          imageUrl={item.imageUrl}
          isVideo={item.isVideo}
          selected={selectedId === item.id}
          editable={editable}
          removable={removableIds?.has(item.id)}
          selectionMode={selectionMode}
          variant={variant}
          onClick={() => onSelect?.(item.id)}
          onEdit={() => onEdit?.(item.id)}
          onRemove={() => onRemove?.(item.id)}
        />
      ))}
    </>
  );

  if (layout === "row") {
    return (
      <div
        ref={scrollRef}
        className="vf-h-scroll flex overflow-x-auto pb-4"
        style={{
          gap: 12,
          paddingInline: 12,
          scrollSnapType: "x mandatory",
        }}
      >
        {addLabel && (
          <div className="shrink-0" style={{ width: 109, scrollSnapAlign: "start" }}>
            <TileCard
              label={addLabel}
              add
              variant={variant}
              selectionMode={selectionMode}
              onClick={onAdd}
            />
          </div>
        )}
        {filtered.map((item) => (
          <div key={item.id} className="shrink-0" style={{ width: 109, scrollSnapAlign: "start" }}>
            <TileCard
              label={item.label}
              tint={item.tint}
              imageUrl={item.imageUrl}
              isVideo={item.isVideo}
              selected={selectedId === item.id}
              editable={editable}
              selectionMode={selectionMode}
              variant={variant}
              onClick={() => onSelect?.(item.id)}
              onEdit={() => onEdit?.(item.id)}
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className="grid pb-4"
      style={{
        gap: isWardrobe ? undefined : "var(--vf-sp-12)",
        columnGap: isWardrobe ? 12 : undefined,
        rowGap: isWardrobe ? 22 : undefined,
        paddingInline: 12,
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
      }}
    >
      {tiles}
    </div>
  );
}
