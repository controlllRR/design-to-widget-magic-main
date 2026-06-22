import { useMemo, useState } from "react";
import { useWidgetConfig } from "@/widget/config";
import { WidgetHeader } from "@/components/widget/WidgetHeader";
import { Watermark } from "@/components/widget/Watermark";
import { STORE_TILES, WARDROBE_TILES } from "@/components/widget/screens/wardrobe/data";
import { SearchFilterBar, TileGrid } from "@/components/widget/screens/wardrobe/TileGrid";
import { CatalogFiltersPage } from "@/components/widget/screens/store/CatalogFiltersPage";
import {
  applyCatalogFilters,
  EMPTY_CATALOG_FILTERS,
  hasActiveCatalogFilters,
  type CatalogFilters,
} from "@/components/widget/screens/store/catalogFilter";
import { SegmentedTabs } from "@/components/widget/ui/SegmentedTabs";
import {
  pageTitleStyle,
  primaryButtonStyle,
  secondaryButtonStyle,
  widgetScreenShellStyle,
} from "@/components/widget/ui/screenShell";

export interface AddFromStoreProps {
  onOpenMenu?: () => void;
  onClose?: () => void;
  onAdd?: (id: string) => void;
  /** Открыть экран фильтров при монтировании (gallery QA). */
  initialFilterOpen?: boolean;
  /** Подпись чипа контекста, например «тип: платье». */
  contextChip?: string;
}

/** Выбор вещи из магазина / гардероба — Figma `1157:14722`, фильтры `1159:15361`. */
export function AddFromStore({
  onOpenMenu,
  onClose,
  onAdd,
  initialFilterOpen = false,
  contextChip,
}: AddFromStoreProps) {
  const { t } = useWidgetConfig();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [tab, setTab] = useState<"store" | "wardrobe">("store");
  const [filtersOpen, setFiltersOpen] = useState(initialFilterOpen);
  const [draftFilters, setDraftFilters] = useState<CatalogFilters>(EMPTY_CATALOG_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState<CatalogFilters>(EMPTY_CATALOG_FILTERS);
  const s = t.screens;

  const sourceTiles = tab === "store" ? STORE_TILES : WARDROBE_TILES;

  const filteredTiles = useMemo(
    () => applyCatalogFilters(sourceTiles, appliedFilters),
    [appliedFilters, sourceTiles],
  );

  const emptyAfterFilter = filteredTiles.length === 0 && query.trim() === "";

  const openFilters = () => {
    setDraftFilters(appliedFilters);
    setFiltersOpen(true);
  };

  const closeFilters = () => {
    setDraftFilters(appliedFilters);
    setFiltersOpen(false);
  };

  return (
    <div className="relative flex flex-col flex-1 min-h-0 h-full w-full" style={widgetScreenShellStyle}>
      <WidgetHeader
        onMenu={onOpenMenu}
        onProfile={onOpenMenu}
        onClose={onClose}
        profileLabel={t.start.profile}
        headerBorderColor="#f6f6f6"
      />

      <div className="flex flex-col flex-1 min-h-0 overflow-y-auto">
        <div style={{ paddingTop: 16, paddingInline: 12 }}>
          <h1 className="text-left" style={{ ...pageTitleStyle, color: "#343537" }}>
            {s.store.pickTitle}
          </h1>
        </div>

        <div style={{ marginTop: 16, paddingInline: 12 }}>
          <SegmentedTabs
            variant="pill"
            size="sm"
            value={tab}
            onChange={(id) => {
              setTab(id as "store" | "wardrobe");
              setSelected(null);
            }}
            items={[
              { id: "store", label: s.store.tabStore },
              { id: "wardrobe", label: s.store.tabWardrobe },
            ]}
          />
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
          {emptyAfterFilter ? (
            <p
              className="text-center lowercase"
              style={{ paddingInline: 12, fontSize: 14, color: "#343537" }}
            >
              {s.store.emptySearch}
            </p>
          ) : (
            <TileGrid
              variant="wardrobe"
              items={filteredTiles}
              selectedId={selected}
              onSelect={setSelected}
              query={query}
              selectionMode="radio"
              editable={false}
            />
          )}
        </div>
      </div>

      <div
        className="shrink-0 flex"
        style={{ gap: 10, paddingInline: 12, paddingTop: 12, paddingBottom: 0 }}
      >
        <button
          type="button"
          disabled={!selected}
          onClick={() => selected && onAdd?.(selected)}
          className="flex-1 text-xs font-extrabold uppercase tracking-wide disabled:cursor-not-allowed"
          style={{
            ...primaryButtonStyle(Boolean(selected)),
            letterSpacing: "0.09em",
            opacity: selected ? 1 : undefined,
          }}
        >
          {s.store.select}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="flex-1 text-xs font-extrabold uppercase tracking-wide"
          style={{ ...secondaryButtonStyle, letterSpacing: "0.09em" }}
        >
          {s.store.cancel}
        </button>
      </div>
      <Watermark />

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
          contextChip={contextChip}
        />
      ) : null}
    </div>
  );
}
