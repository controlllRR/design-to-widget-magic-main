import { Meh, X } from "lucide-react";
import { useWidgetConfig } from "@/widget/config";
import { PoweredByFooter } from "@/components/widget/PoweredByFooter";
import { AnimatedSheetShell } from "@/components/widget/ui/AnimatedSheetShell";
import { SegmentedTabs } from "@/components/widget/ui/SegmentedTabs";
import { Slider } from "@/components/widget/ui/Slider";
import type { OutfitItem } from "./data";
import {
  OUTFIT_ITEM_CONFIG_FIELDS,
  hasItemConfig,
  type OutfitConfigField,
  type OutfitItemConfigValues,
} from "./outfitItemConfig";

export interface OutfitItemConfigSheetProps {
  open: boolean;
  item: OutfitItem | null;
  values: OutfitItemConfigValues;
  onChange: (values: OutfitItemConfigValues) => void;
  onClose: () => void;
  onResetAll: () => void;
  onClearItem: () => void;
}

/** Bottom sheet настройки элемента образа — Figma modular config (`1153:14230` … `1157:15152`). */
export function OutfitItemConfigSheet({
  open,
  item,
  values,
  onChange,
  onClose,
  onResetAll,
  onClearItem,
}: OutfitItemConfigSheetProps) {
  const { t } = useWidgetConfig();
  const ic = t.screens.generation.itemConfig;

  const fields = item ? (OUTFIT_ITEM_CONFIG_FIELDS[item.id] ?? []) : [];
  const showSettings = item ? hasItemConfig(item.id) : false;
  const configureLabel = item ? `${ic.configurePrefix} ${item.category.toLowerCase()}` : "";

  const setField = (fieldId: string, value: number | string) => {
    onChange({ ...values, [fieldId]: value });
  };

  const resetField = (field: OutfitConfigField) => {
    const next = { ...values };
    delete next[field.id];
    onChange(next);
  };

  return (
    <AnimatedSheetShell
      open={open && item !== null}
      onClose={onClose}
      ariaLabel={item?.name ?? ic.title}
      panelStyle={{
        backgroundColor: "var(--vf-surface)",
        borderTopLeftRadius: "var(--vf-radius-widget)",
        borderTopRightRadius: "var(--vf-radius-widget)",
        maxHeight: "82%",
        boxShadow: "0 -12px 32px -16px rgba(0,0,0,0.25)",
      }}
    >
      {!item ? null : (
        <>
        <div
          className="flex items-center justify-center shrink-0"
          style={{ paddingTop: 10, paddingBottom: 6 }}
        >
          <span
            aria-hidden
            style={{
              width: 48,
              height: 1,
              backgroundColor: "color-mix(in oklab, var(--vf-text) 18%, transparent)",
            }}
          />
        </div>

        <div
          className="text-center shrink-0"
          style={{ paddingInline: "var(--vf-sp-20)", paddingBottom: "var(--vf-sp-12)" }}
        >
          <h2
            style={{
              fontFamily: "var(--vf-font-heading)",
              fontWeight: 700,
              fontSize: "var(--vf-fs-14)",
              lineHeight: 1.2,
              letterSpacing: "-0.02em",
              color: "var(--vf-text)",
            }}
          >
            {item.name}
          </h2>
          <p
            className="mt-1 lowercase"
            style={{
              fontSize: "var(--vf-fs-12)",
              fontWeight: 400,
              color: "var(--vf-text-muted)",
            }}
          >
            {configureLabel}
          </p>
        </div>

        <div
          className="h-px w-full shrink-0"
          style={{
            backgroundColor: "color-mix(in oklab, var(--vf-text) 10%, transparent)",
          }}
        />

        <div
          className="flex-1 min-h-0 overflow-y-auto"
          style={{
            paddingInline: "var(--vf-sp-20)",
            paddingTop: "var(--vf-sp-16)",
            paddingBottom: "var(--vf-sp-12)",
          }}
        >
          {!showSettings ? (
            <div className="flex flex-col items-center text-center" style={{ gap: "var(--vf-sp-12)" }}>
              <Meh
                strokeWidth={1.5}
                aria-hidden
                style={{ width: 32, height: 32, color: "var(--vf-text-muted)" }}
              />
              <p
                style={{
                  fontSize: "var(--vf-fs-12)",
                  fontWeight: 500,
                  color: "var(--vf-text-muted)",
                  lineHeight: 1.4,
                }}
              >
                {ic.noSettings}
              </p>
            </div>
          ) : (
            <div className="flex flex-col" style={{ gap: "var(--vf-sp-24)" }}>
              {fields.map((field) => (
                <ConfigSection
                  key={field.id}
                  field={field}
                  value={values[field.id]}
                  fieldLabel={ic.fields[field.id]}
                  optionLabel={(key) => ic.options[key as keyof typeof ic.options] ?? key}
                  sliderLabel={(key) => ic.sliderLabels[key as keyof typeof ic.sliderLabels] ?? key}
                  onChange={(v) => setField(field.id, v)}
                  onReset={() => resetField(field)}
                />
              ))}
            </div>
          )}
        </div>

        <div
          className={`flex items-center shrink-0 ${showSettings ? "justify-between" : "justify-center"}`}
          style={{
            paddingInline: "var(--vf-sp-20)",
            paddingTop: "var(--vf-sp-8)",
            paddingBottom: "var(--vf-sp-12)",
            gap: "var(--vf-sp-12)",
          }}
        >
          {showSettings && (
            <button
              type="button"
              onClick={onResetAll}
              className="text-left underline underline-offset-2 lowercase"
              style={{
                fontSize: "var(--vf-fs-12)",
                fontWeight: 500,
                color: "var(--vf-text)",
              }}
            >
              {ic.resetAll}
            </button>
          )}
          <button
            type="button"
            onClick={onClearItem}
            className={`underline underline-offset-2 lowercase ${showSettings ? "text-right" : "text-center"}`}
            style={{
              fontSize: "var(--vf-fs-12)",
              fontWeight: 500,
              color: "var(--vf-text)",
            }}
          >
            {ic.clearItem}
          </button>
        </div>

        <PoweredByFooter />
        </>
      )}
    </AnimatedSheetShell>
  );
}

function ConfigSection({
  field,
  value,
  fieldLabel,
  optionLabel,
  sliderLabel,
  onChange,
  onReset,
}: {
  field: OutfitConfigField;
  value: number | string | undefined;
  fieldLabel: string;
  optionLabel: (key: string) => string;
  sliderLabel: (key: string) => string;
  onChange: (v: number | string) => void;
  onReset: () => void;
}) {
  return (
    <section className="w-full min-w-0">
      <div
        className="flex items-center justify-between"
        style={{ marginBottom: "var(--vf-sp-12)" }}
      >
        <h3
          className="lowercase"
          style={{
            fontFamily: "var(--vf-font-body)",
            fontSize: "var(--vf-fs-14)",
            fontWeight: 700,
            color: "var(--vf-text)",
          }}
        >
          {fieldLabel}
        </h3>
        <button
          type="button"
          aria-label="Сбросить"
          onClick={onReset}
          className="flex items-center justify-center shrink-0 rounded-full"
          style={{
            width: 38,
            height: 38,
            backgroundColor: "var(--vf-surface-muted)",
          }}
        >
          <X strokeWidth={1.5} style={{ width: 16, height: 16, color: "var(--vf-text-muted)" }} />
        </button>
      </div>

      {field.type === "segmented" ? (
        <SegmentedTabs
          variant="pill"
          size="sm"
          value={String(value ?? field.options[0]?.id ?? "")}
          onChange={onChange}
          items={field.options.map((opt) => ({
            id: opt.id,
            label: optionLabel(opt.labelKey),
          }))}
        />
      ) : (
        <LabeledSlider
          value={typeof value === "number" ? value : field.min}
          min={field.min}
          max={field.max}
          step={field.step}
          labels={field.labels.map(sliderLabel)}
          onChange={onChange}
          ariaLabel={fieldLabel}
        />
      )}
    </section>
  );
}

function LabeledSlider({
  value,
  min,
  max,
  step,
  labels,
  onChange,
  ariaLabel,
}: {
  value: number;
  min: number;
  max: number;
  step: number;
  labels: string[];
  onChange: (v: number) => void;
  ariaLabel: string;
}) {
  return (
    <div className="w-full min-w-0">
      <div
        className="flex justify-between"
        style={{
          marginBottom: "var(--vf-sp-8)",
          fontSize: "var(--vf-fs-10)",
          fontWeight: 500,
          color: "var(--vf-text-muted)",
          gap: 4,
        }}
      >
        {labels.map((label) => (
          <span key={label} className="text-center flex-1 min-w-0 truncate lowercase">
            {label}
          </span>
        ))}
      </div>
      <Slider
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={onChange}
        ariaLabel={ariaLabel}
      />
    </div>
  );
}
