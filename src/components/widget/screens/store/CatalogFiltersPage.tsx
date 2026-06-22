import { useMemo, useState, type ReactNode } from "react";
import { ArrowLeft, ChevronUp, X } from "lucide-react";
import { useWidgetConfig } from "@/widget/config";
import { Watermark } from "@/components/widget/Watermark";
import { WidgetHeader } from "@/components/widget/WidgetHeader";
import {
  CATALOG_COLORS,
  CATALOG_COLOR_SWATCH,
  CATALOG_COMPOSITIONS,
  CATALOG_CUTS,
  CATALOG_LENGTHS,
  CATALOG_MATERIALS,
  CATALOG_MODELS,
  CATALOG_PRODUCT_TYPES,
  CATALOG_SEASONS,
  CATALOG_SLEEVES,
  CATALOG_STYLES,
  CATALOG_PRICE_DEFAULT_MAX,
  CATALOG_PRICE_DEFAULT_MIN,
  EMPTY_CATALOG_FILTERS,
  type CatalogColorId,
  type CatalogCompositionId,
  type CatalogCutId,
  type CatalogFilters,
  type CatalogLengthId,
  type CatalogMaterialId,
  type CatalogModelId,
  type CatalogProductTypeId,
  type CatalogSeasonId,
  type CatalogSleeveId,
  type CatalogStyleId,
  countActiveCatalogFilters,
} from "./catalogFilter";
import { CatalogPriceRange, resolveCatalogPriceRange } from "./CatalogPriceRange";
import {
  primaryButtonStyle,
  secondaryButtonStyle,
  widgetScreenShellStyle,
} from "@/components/widget/ui/screenShell";

function toggle<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

function FilterCheckbox({
  checked,
  label,
  swatch,
  onToggle,
}: {
  checked: boolean;
  label: string;
  swatch?: string;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="w-full flex items-center gap-2 text-left"
      style={{ minHeight: 16 }}
    >
      <span
        className="shrink-0 flex items-center justify-center rounded-sm"
        style={{
          width: 16,
          height: 16,
          border: "0.5px solid #343537",
          backgroundColor: checked ? "#343537" : "transparent",
        }}
        aria-hidden
      >
        {checked ? (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M2.5 6L5 8.5L9.5 3.5"
              stroke="#fff"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : null}
      </span>
      {swatch ? (
        <span
          className="shrink-0 rounded-full"
          style={{
            width: 16,
            height: 16,
            backgroundColor: swatch,
            border: swatch === "#efefef" ? "1px solid #e5e7eb" : undefined,
          }}
          aria-hidden
        />
      ) : null}
      <span style={{ fontSize: 12, fontWeight: 300, color: "#343537" }}>{label}</span>
    </button>
  );
}

function FilterSection({
  title,
  titleTransform = "lowercase",
  open,
  onToggle,
  onReset,
  resetLabel,
  showReset = true,
  scrollInner = false,
  children,
}: {
  title: string;
  titleTransform?: "lowercase" | "capitalize";
  open: boolean;
  onToggle: () => void;
  onReset?: () => void;
  resetLabel: string;
  showReset?: boolean;
  scrollInner?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className="shrink-0"
      style={{
        borderRadius: 24,
        border: "1px solid #f0f0f0",
        backgroundColor: "#fff",
        padding: 22,
      }}
    >
      <div className="flex items-center" style={{ gap: 10 }}>
        <span
          className="flex-1 min-w-0"
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: "#343537",
            textTransform: titleTransform,
          }}
        >
          {title}
        </span>
        <div className="flex items-center shrink-0" style={{ gap: 10 }}>
          {showReset && open && onReset ? (
            <button
              type="button"
              onClick={onReset}
              className="underline"
              style={{ fontSize: 14, fontWeight: 400, color: "#343537" }}
            >
              {resetLabel}
            </button>
          ) : null}
          <button type="button" onClick={onToggle} aria-expanded={open} className="p-0">
            <ChevronUp
              size={20}
              strokeWidth={1.5}
              style={{
                color: "#343537",
                transform: open ? undefined : "rotate(180deg)",
                transition: "transform 0.15s",
              }}
            />
          </button>
        </div>
      </div>
      {open ? (
        <div
          className="flex flex-col"
          style={{
            gap: 10,
            marginTop: 10,
            ...(scrollInner ? { maxHeight: 172, overflowY: "auto", paddingRight: 4 } : {}),
          }}
        >
          {children}
        </div>
      ) : null}
    </div>
  );
}

/** Экран фильтров — Figma `1159:15361`. */
export function CatalogFiltersPage({
  draft,
  onChange,
  onApply,
  onClose,
  onOpenMenu,
  contextChip,
}: {
  draft: CatalogFilters;
  onChange: (next: CatalogFilters) => void;
  onApply: (next: CatalogFilters) => void;
  onClose: () => void;
  onOpenMenu?: () => void;
  contextChip?: string;
}) {
  const { t } = useWidgetConfig();
  const f = t.screens.catalogFilters;
  const [openSections, setOpenSections] = useState({
    color: true,
    composition: true,
    category: true,
    price: true,
    length: false,
    style: false,
    season: false,
    material: false,
    sleeve: false,
    cut: false,
    model: false,
  });

  const priceRange = resolveCatalogPriceRange(draft);

  const chips = useMemo(() => {
    const result: Array<{ key: string; label: string; onRemove: () => void }> = [];
    if (contextChip) {
      result.push({ key: "ctx", label: contextChip, onRemove: () => undefined });
    }
    draft.productTypes.forEach((type) => {
      result.push({
        key: `type-${type}`,
        label: `${f.chipType}: ${f.productTypes[type]}`,
        onRemove: () =>
          onChange({ ...draft, productTypes: draft.productTypes.filter((c) => c !== type) }),
      });
    });
    draft.colors.forEach((color) => {
      result.push({
        key: `color-${color}`,
        label: `${f.chipColor}: ${f.colors[color]}`,
        onRemove: () =>
          onChange({ ...draft, colors: draft.colors.filter((c) => c !== color) }),
      });
    });
    draft.compositions.forEach((comp) => {
      result.push({
        key: `comp-${comp}`,
        label: `${f.chipComposition}: ${f.compositions[comp]}`,
        onRemove: () =>
          onChange({ ...draft, compositions: draft.compositions.filter((c) => c !== comp) }),
      });
    });
    if (priceRange.active) {
      result.push({
        key: "price",
        label: `${f.chipPrice}: ${priceRange.min.toLocaleString("ru-RU")}–${priceRange.max.toLocaleString("ru-RU")}`,
        onRemove: () => onChange({ ...draft, priceMin: null, priceMax: null }),
      });
    }
    return result;
  }, [contextChip, draft, f, onChange, priceRange]);

  const toggleSection = (key: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const resetAll = () => onChange(EMPTY_CATALOG_FILTERS);

  const checkboxList = <T extends string>(
    options: T[],
    selected: T[],
    labels: Record<T, string>,
    field: keyof Pick<
      CatalogFilters,
      | "productTypes"
      | "colors"
      | "compositions"
      | "materials"
      | "lengths"
      | "styles"
      | "seasons"
      | "sleeves"
      | "cuts"
      | "models"
    >,
    swatches?: Record<string, string>,
  ) =>
    options.map((option) => (
      <FilterCheckbox
        key={option}
        checked={selected.includes(option)}
        label={labels[option]}
        swatch={swatches?.[option]}
        onToggle={() =>
          onChange({
            ...draft,
            [field]: toggle(selected as T[], option),
          } as CatalogFilters)
        }
      />
    ));

  return (
    <div
      className="absolute inset-0 z-[60] flex flex-col min-h-0 overflow-hidden"
      style={{ ...widgetScreenShellStyle, backgroundColor: "#fff" }}
    >
      <WidgetHeader
        onMenu={onOpenMenu}
        onProfile={onOpenMenu}
        onClose={onClose}
        profileLabel={t.start.profile}
        headerBorderColor="#f6f6f6"
      />

      <div
        className="flex items-center shrink-0"
        style={{ height: 44, paddingInline: 12, gap: 10 }}
      >
        <button type="button" aria-label={f.back} onClick={onClose} className="shrink-0 p-0">
          <ArrowLeft size={20} strokeWidth={1.5} />
        </button>
        <h1
          className="flex-1 min-w-0"
          style={{
            fontFamily: "var(--vf-font-heading)",
            fontSize: 14,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.04em",
          }}
        >
          {f.title}
        </h1>
        <button
          type="button"
          onClick={resetAll}
          className="shrink-0 underline decoration-dotted"
          style={{ fontSize: 14, fontWeight: 400, color: "#343537" }}
        >
          {f.resetAll}
        </button>
      </div>

      {chips.length > 0 ? (
        <div
          className="flex flex-wrap shrink-0"
          style={{ gap: 8, paddingInline: 12, paddingBottom: 12 }}
        >
          {chips.map((chip) => (
            <span
              key={chip.key}
              className="inline-flex items-center gap-1.5 rounded-full lowercase"
              style={{
                height: 26,
                paddingInline: 10,
                backgroundColor: "#343537",
                color: "#fff",
                fontSize: 12,
                fontWeight: 500,
              }}
            >
              {chip.label}
              {chip.key !== "ctx" ? (
                <button type="button" aria-label={f.removeChip} onClick={chip.onRemove}>
                  <X size={12} strokeWidth={2} />
                </button>
              ) : null}
            </span>
          ))}
        </div>
      ) : null}

      <div
        className="flex-1 min-h-0 overflow-y-auto overscroll-contain"
        style={{ backgroundColor: "#f6f6f6", padding: 12 }}
      >
        <div className="flex flex-col" style={{ gap: 10 }}>
          <FilterSection
            title={f.sections.color}
            titleTransform="capitalize"
            open={openSections.color}
            onToggle={() => toggleSection("color")}
            onReset={() => onChange({ ...draft, colors: [] })}
            resetLabel={f.resetSection}
            scrollInner
          >
            {checkboxList(
              CATALOG_COLORS,
              draft.colors,
              f.colors,
              "colors",
              CATALOG_COLOR_SWATCH,
            )}
          </FilterSection>

          <FilterSection
            title={f.sections.composition}
            open={openSections.composition}
            onToggle={() => toggleSection("composition")}
            resetLabel={f.resetSection}
            showReset={false}
            scrollInner
          >
            {checkboxList(
              CATALOG_COMPOSITIONS,
              draft.compositions,
              f.compositions,
              "compositions",
            )}
          </FilterSection>

          <FilterSection
            title={f.sections.category}
            open={openSections.category}
            onToggle={() => toggleSection("category")}
            onReset={() => onChange({ ...draft, productTypes: [] })}
            resetLabel={f.resetSection}
            scrollInner
          >
            {checkboxList(
              CATALOG_PRODUCT_TYPES,
              draft.productTypes,
              f.productTypes,
              "productTypes",
            )}
          </FilterSection>

          <FilterSection
            title={f.sections.price}
            open={openSections.price}
            onToggle={() => toggleSection("price")}
            resetLabel={f.resetSection}
            showReset={false}
          >
            <CatalogPriceRange
              min={priceRange.min}
              max={priceRange.max}
              onChange={(min, max) =>
                onChange({
                  ...draft,
                  priceMin: min,
                  priceMax: max,
                })
              }
            />
          </FilterSection>

          <FilterSection
            title={f.sections.length}
            open={openSections.length}
            onToggle={() => toggleSection("length")}
            onReset={() => onChange({ ...draft, lengths: [] })}
            resetLabel={f.resetSection}
            showReset={openSections.length}
          >
            {checkboxList(CATALOG_LENGTHS, draft.lengths, f.lengths, "lengths")}
          </FilterSection>

          <FilterSection
            title={f.sections.style}
            open={openSections.style}
            onToggle={() => toggleSection("style")}
            onReset={() => onChange({ ...draft, styles: [] })}
            resetLabel={f.resetSection}
            showReset={openSections.style}
          >
            {checkboxList(CATALOG_STYLES, draft.styles, f.styles, "styles")}
          </FilterSection>

          <FilterSection
            title={f.sections.season}
            open={openSections.season}
            onToggle={() => toggleSection("season")}
            onReset={() => onChange({ ...draft, seasons: [] })}
            resetLabel={f.resetSection}
            showReset={openSections.season}
          >
            {checkboxList(CATALOG_SEASONS, draft.seasons, f.seasons, "seasons")}
          </FilterSection>

          <FilterSection
            title={f.sections.material}
            open={openSections.material}
            onToggle={() => toggleSection("material")}
            onReset={() => onChange({ ...draft, materials: [] })}
            resetLabel={f.resetSection}
            showReset={openSections.material}
          >
            {checkboxList(CATALOG_MATERIALS, draft.materials, f.materials, "materials")}
          </FilterSection>

          <FilterSection
            title={f.sections.sleeve}
            open={openSections.sleeve}
            onToggle={() => toggleSection("sleeve")}
            onReset={() => onChange({ ...draft, sleeves: [] })}
            resetLabel={f.resetSection}
            showReset={openSections.sleeve}
          >
            {checkboxList(CATALOG_SLEEVES, draft.sleeves, f.sleeves, "sleeves")}
          </FilterSection>

          <FilterSection
            title={f.sections.cut}
            open={openSections.cut}
            onToggle={() => toggleSection("cut")}
            onReset={() => onChange({ ...draft, cuts: [] })}
            resetLabel={f.resetSection}
            showReset={openSections.cut}
          >
            {checkboxList(CATALOG_CUTS, draft.cuts, f.cuts, "cuts")}
          </FilterSection>

          <FilterSection
            title={f.sections.model}
            open={openSections.model}
            onToggle={() => toggleSection("model")}
            onReset={() => onChange({ ...draft, models: [] })}
            resetLabel={f.resetSection}
            showReset={openSections.model}
          >
            {checkboxList(CATALOG_MODELS, draft.models, f.models, "models")}
          </FilterSection>
        </div>
      </div>

      <div
        className="shrink-0 vf-pb-safe"
        style={{
          backgroundColor: "#fff",
        }}
      >
        <div
          className="flex"
          style={{
            gap: 10,
            paddingInline: "var(--vf-sp-12)",
            paddingTop: "var(--vf-sp-12)",
          }}
        >
          <button
            type="button"
            onClick={() => {
              const next =
                draft.priceMin === null && draft.priceMax === null
                  ? draft
                  : {
                      ...draft,
                      priceMin: draft.priceMin ?? CATALOG_PRICE_DEFAULT_MIN,
                      priceMax: draft.priceMax ?? CATALOG_PRICE_DEFAULT_MAX,
                    };
              onApply(next);
            }}
            className="flex-1 text-xs font-extrabold uppercase tracking-wide"
            style={{ ...primaryButtonStyle(true), letterSpacing: "0.09em" }}
          >
            {f.show}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 text-xs font-extrabold uppercase tracking-wide"
            style={{ ...secondaryButtonStyle, letterSpacing: "0.09em" }}
          >
            {f.cancel}
          </button>
        </div>
        <Watermark compact />
      </div>
    </div>
  );
}

export { countActiveCatalogFilters };
