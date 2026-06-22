import { useEffect, useMemo, useRef, useState } from "react";
import { useWidgetConfig } from "@/widget/config";
import { WidgetHeader } from "@/components/widget/WidgetHeader";
import { Watermark } from "@/components/widget/Watermark";
import {
  WARDROBE_SET_TILES,
  WARDROBE_TILES,
  type TileItem,
} from "@/components/widget/screens/wardrobe/data";
import { WardrobeEditSheet } from "@/components/widget/screens/wardrobe/WardrobeEditSheet";
import { AddItemSheet } from "@/components/widget/ui/AddItemSheet";
import { AddSetSheet } from "@/components/widget/screens/wardrobe/AddSetSheet";
import { SearchFilterBar, TileGrid } from "@/components/widget/screens/wardrobe/TileGrid";
import { CatalogFiltersPage } from "@/components/widget/screens/store/CatalogFiltersPage";
import {
  applyCatalogFilters,
  EMPTY_CATALOG_FILTERS,
  hasActiveCatalogFilters,
  type CatalogFilters,
} from "@/components/widget/screens/store/catalogFilter";
import { useHorizontalScrollGestures } from "@/lib/useHorizontalScrollGestures";
import {
  pageTitleStyle,
  primaryButtonStyle,
  secondaryButtonStyle,
  widgetScreenShellStyle,
} from "@/components/widget/ui/screenShell";

export type MyWardrobeMode = "default" | "setPick";

export interface MyWardrobeProps {
  mode?: MyWardrobeMode;
  onOpenMenu?: () => void;
  onClose?: () => void;
  onAddFromStore?: () => void;
  onEditItem?: (id: string) => void;
  /** Выбор набора — возврат на generation с выбранным сетом. */
  onSelectSet?: (item: TileItem) => void;
  onCancelPick?: () => void;
  /** Gallery QA: открыть edit sheet для вещи. */
  initialEditItemId?: string;
  /** Gallery QA: edit sheet + confirm удаления. */
  initialDeleteOpen?: boolean;
  /** Gallery QA / навигация: открыть sheet добавления вещи. */
  initialAddOpen?: boolean;
  onAddOpenConsumed?: () => void;
}

/** Гардероб — Figma `910:6736`; выбор набора — `1286:10705` / `1286:10876`. */
export function MyWardrobe({
  mode = "default",
  onOpenMenu,
  onClose,
  onEditItem,
  onSelectSet,
  onCancelPick,
  initialEditItemId,
  initialDeleteOpen = false,
  initialAddOpen = false,
  onAddOpenConsumed,
}: MyWardrobeProps) {
  const { t } = useWidgetConfig();
  const isSetPick = mode === "setPick";
  const [query, setQuery] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [draftFilters, setDraftFilters] = useState<CatalogFilters>(EMPTY_CATALOG_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState<CatalogFilters>(EMPTY_CATALOG_FILTERS);
  const [editItem, setEditItem] = useState<TileItem | null>(null);
  const [addOpen, setAddOpen] = useState(initialAddOpen);
  const [addSetOpen, setAddSetOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [sets, setSets] = useState<TileItem[]>(WARDROBE_SET_TILES);
  const setsScrollRef = useRef<HTMLDivElement>(null);
  useHorizontalScrollGestures(setsScrollRef, isSetPick);
  const s = t.screens;

  useEffect(() => {
    if (!initialEditItemId) return;
    const item = WARDROBE_TILES.find((tile) => tile.id === initialEditItemId) ?? null;
    if (item) setEditItem(item);
  }, [initialEditItemId]);

  useEffect(() => {
    if (!initialAddOpen) return;
    setAddOpen(true);
    onAddOpenConsumed?.();
  }, [initialAddOpen, onAddOpenConsumed]);

  const openEdit = (id: string) => {
    const pool = isSetPick ? sets : WARDROBE_TILES;
    const item = pool.find((tile) => tile.id === id) ?? null;
    if (item) setEditItem(item);
    onEditItem?.(id);
  };

  const handleClose = () => {
    if (isSetPick) {
      onCancelPick?.();
      return;
    }
    onClose?.();
  };

  const handleAddSet = (payload: { preview: string; name: string }) => {
    const id = `set-${Date.now()}`;
    setSets((prev) => [
      ...prev,
      {
        id,
        label: payload.name,
        imageUrl: payload.preview,
        kind: "set",
      },
    ]);
    setSelectedId(id);
  };

  const selectedSet = sets.find((item) => item.id === selectedId) ?? null;

  const filteredWardrobeTiles = useMemo(
    () => applyCatalogFilters(WARDROBE_TILES, appliedFilters),
    [appliedFilters],
  );

  const filteredSets = useMemo(
    () => applyCatalogFilters(sets, appliedFilters),
    [appliedFilters, sets],
  );

  const openFilters = () => {
    setDraftFilters(appliedFilters);
    setFiltersOpen(true);
  };

  const closeFilters = () => {
    setDraftFilters(appliedFilters);
    setFiltersOpen(false);
  };

  return (
    <div className="relative flex flex-col flex-1 min-h-0 min-w-0 h-full w-full" style={widgetScreenShellStyle}>
      <WidgetHeader
        onMenu={onOpenMenu}
        onProfile={onOpenMenu}
        onClose={handleClose}
        profileLabel={t.start.profile}
        showPinnedShortcuts={false}
        headerBorderColor="#f6f6f6"
      />

      <div className="flex flex-col flex-1 min-h-0 overflow-y-auto">
        <div style={{ paddingTop: 16, paddingInline: 12 }}>
          <h1 className="text-left" style={{ ...pageTitleStyle, color: "#343537" }}>
            {t.userMenu.items.wardrobe}
          </h1>
        </div>

        <div style={{ marginTop: 24 }}>
          <SearchFilterBar
            variant="wardrobe"
            placeholder={s.common.search}
            value={query}
            onChange={setQuery}
            onFilter={openFilters}
            filterBadgeDot={hasActiveCatalogFilters(appliedFilters)}
          />
        </div>

        <div style={{ marginTop: 24 }}>
          {isSetPick ? (
            <TileGrid
              variant="wardrobe"
              layout="row"
              scrollRef={setsScrollRef}
              items={filteredSets}
              addLabel={s.wardrobe.addSet}
              onAdd={() => setAddSetOpen(true)}
              selectedId={selectedId}
              onSelect={setSelectedId}
              query={query}
              editable
              onEdit={openEdit}
              selectionMode="radio"
            />
          ) : (
            <TileGrid
              variant="wardrobe"
              items={filteredWardrobeTiles}
              addLabel={s.wardrobe.addItem}
              onAdd={() => setAddOpen(true)}
              query={query}
              editable
              onEdit={openEdit}
            />
          )}
        </div>
      </div>

      {isSetPick ? (
        <div className="shrink-0 vf-pb-safe">
          <div
            className="flex"
            style={{ gap: 10, paddingInline: "var(--vf-sp-12)", paddingTop: "var(--vf-sp-12)" }}
          >
            <button
              type="button"
              disabled={!selectedSet}
              onClick={() => selectedSet && onSelectSet?.(selectedSet)}
              className="flex-1 text-xs font-extrabold uppercase tracking-wide disabled:cursor-not-allowed"
              style={{
                ...primaryButtonStyle(Boolean(selectedSet)),
                letterSpacing: "0.09em",
                opacity: selectedSet ? 1 : undefined,
              }}
            >
              {s.wardrobe.selectSet}
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 text-xs font-extrabold uppercase tracking-wide"
              style={{ ...secondaryButtonStyle, letterSpacing: "0.09em" }}
            >
              {s.wardrobe.cancelPick}
            </button>
          </div>
          <Watermark compact />
        </div>
      ) : (
        <div className="shrink-0 vf-pb-safe">
          <Watermark compact />
        </div>
      )}

      <WardrobeEditSheet
        open={editItem !== null}
        item={editItem}
        initialDeleteOpen={initialDeleteOpen}
        onClose={() => setEditItem(null)}
        onSave={() => setEditItem(null)}
        onDelete={() => setEditItem(null)}
      />

      <AddItemSheet
        open={addOpen && !isSetPick}
        title={s.wardrobeAdd.title}
        onClose={() => setAddOpen(false)}
        onSubmit={() => setAddOpen(false)}
      />

      <AddSetSheet
        open={addSetOpen}
        onClose={() => setAddSetOpen(false)}
        onSubmit={handleAddSet}
      />

      {filtersOpen ? (
        <CatalogFiltersPage
          draft={draftFilters}
          onChange={setDraftFilters}
          onApply={(next) => {
            setAppliedFilters(next);
            setFiltersOpen(false);
          }}
          onClose={closeFilters}
          onOpenMenu={onOpenMenu}
        />
      ) : null}
    </div>
  );
}
