import { useWidgetConfig } from "@/widget/config";
import { BottomSheet } from "@/components/widget/ui/BottomSheet";

export type StoreFilterCategory = "all" | "tops" | "bottoms" | "footwear" | "accessories";

export interface StoreFilterSheetProps {
  open: boolean;
  value: StoreFilterCategory;
  onChange: (value: StoreFilterCategory) => void;
  onClose: () => void;
  onApply: () => void;
}

const CATEGORIES: StoreFilterCategory[] = ["all", "tops", "bottoms", "footwear", "accessories"];

/** Быстрый фильтр категорий — bottom sheet (Figma `1157:14722` / gallery QA). */
export function StoreFilterSheet({
  open,
  value,
  onChange,
  onClose,
  onApply,
}: StoreFilterSheetProps) {
  const { t } = useWidgetConfig();
  const f = t.screens.storeFilter;

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      ariaLabel={f.title}
      title={f.title}
      size="auto"
      footer={
        <div className="shrink-0" style={{ paddingInline: "var(--vf-sp-20)", paddingBottom: "var(--vf-sp-12)" }}>
          <button
            type="button"
            onClick={() => {
              onApply();
              onClose();
            }}
            className="w-full text-xs font-extrabold uppercase tracking-wide"
            style={{
              height: 46,
              borderRadius: 999,
              backgroundColor: "var(--vf-btn-bg)",
              color: "var(--vf-btn-text)",
              letterSpacing: "0.09em",
            }}
          >
            {f.apply}
          </button>
        </div>
      }
    >
      <div className="flex flex-col" style={{ gap: 8 }}>
        {CATEGORIES.map((cat) => {
          const active = value === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => onChange(cat)}
              className="w-full text-left lowercase rounded-lg border px-4"
              style={{
                height: 40,
                borderColor: active ? "#343537" : "#e5e7eb",
                backgroundColor: "#fff",
                fontSize: 14,
                fontWeight: active ? 700 : 400,
                color: "#343537",
              }}
            >
              {f.categories[cat]}
            </button>
          );
        })}
      </div>
    </BottomSheet>
  );
}

export {
  applyCatalogFilters,
  filterStoreItems,
  CATALOG_ITEM_META,
  EMPTY_CATALOG_FILTERS,
  hasActiveCatalogFilters,
  countActiveCatalogFilters,
} from "./catalogFilter";

export type { CatalogFilters } from "./catalogFilter";

/** @deprecated Используйте CATALOG_ITEM_META. */
export const STORE_ITEM_CATEGORIES: Record<string, StoreFilterCategory> = {
  coat: "tops",
  shirt: "tops",
  tee: "tops",
  cap: "accessories",
  jeans: "bottoms",
  skirt: "bottoms",
  sneakers: "footwear",
  heels: "footwear",
  bag: "accessories",
  dress: "tops",
};
