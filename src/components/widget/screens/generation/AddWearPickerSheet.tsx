import { useEffect, useMemo, useRef, useState } from "react";
import { useWidgetConfig } from "@/widget/config";
import { AnimatedSheetShell } from "@/components/widget/ui/AnimatedSheetShell";
import { SegmentedTabs } from "@/components/widget/ui/SegmentedTabs";
import { useHorizontalScrollGestures } from "@/lib/useHorizontalScrollGestures";
import type { AddWearItem, AddWearTab } from "./addWearCatalog";
import { ADD_WEAR_ICONS } from "./addWearIcons";

export type AddWearPickerKind = "outfit" | "accessory";

export interface AddWearPickerSheetProps<T extends string> {
  open: boolean;
  kind: AddWearPickerKind;
  tabs: AddWearTab<T>[];
  onClose: () => void;
  onSelect: (itemId: string, tabId: T) => void;
}

/** Bottom sheet — Figma `873:3554` Add an image element / `873:3585` Add Accessory. */
export function AddWearPickerSheet<T extends string>({
  open,
  kind,
  tabs,
  onClose,
  onSelect,
}: AddWearPickerSheetProps<T>) {
  const { t } = useWidgetConfig();
  const copy = t.screens.generation.addWear;
  const title = kind === "outfit" ? copy.outfitTitle : copy.accessoryTitle;

  const defaultTab = tabs[0]?.id;
  const [activeTab, setActiveTab] = useState<T>(defaultTab);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const itemsScrollRef = useRef<HTMLDivElement>(null);
  useHorizontalScrollGestures(itemsScrollRef, open);

  const activeItems = useMemo(
    () => tabs.find((tab) => tab.id === activeTab)?.items ?? [],
    [activeTab, tabs],
  );

  useEffect(() => {
    if (!open) return;
    const tab = tabs[0];
    if (!tab) return;
    setActiveTab(tab.id);
    const preset = tab.items.find((item) => item.selected)?.id ?? tab.items[0]?.id ?? null;
    setSelectedId(preset);
  }, [open, tabs]);

  useEffect(() => {
    const tab = tabs.find((t) => t.id === activeTab);
    if (!tab) return;
    const preset = tab.items.find((item) => item.selected)?.id ?? tab.items[0]?.id ?? null;
    setSelectedId(preset);
  }, [activeTab, tabs]);

  if (!defaultTab) return null;

  const tabItems = tabs.map((tab) => ({
    id: tab.id,
    label: copy.tabs[tab.id as keyof typeof copy.tabs] ?? tab.label,
  }));

  const pickItem = (item: AddWearItem) => {
    setSelectedId(item.id);
    onSelect(item.id, activeTab);
    onClose();
  };

  return (
    <AnimatedSheetShell
      open={open}
      onClose={onClose}
      ariaLabel={title}
      panelStyle={{
        backgroundColor: "var(--vf-surface)",
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        boxShadow: "0 -4px 18px rgba(0,0,0,0.12)",
        minHeight: 258,
      }}
    >
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

      <h2
        className="text-center uppercase shrink-0"
        style={{
          paddingInline: 20,
          paddingBottom: 12,
          fontFamily: "var(--vf-font-heading)",
          fontWeight: 700,
          fontSize: "var(--vf-fs-14)",
          lineHeight: 1.2,
          letterSpacing: "-0.02em",
          color: "var(--vf-text)",
        }}
      >
        {title}
      </h2>

      <div className="shrink-0" style={{ paddingInline: 20, paddingBottom: 12 }}>
        <SegmentedTabs
          items={tabItems}
          value={activeTab}
          onChange={setActiveTab}
          variant="inverted"
          size="sm"
          ariaLabel={title}
        />
      </div>

      <div
        ref={itemsScrollRef}
        className="flex gap-3 overflow-x-auto min-w-0 shrink-0 vf-h-scroll"
        style={{
          paddingInline: 20,
          paddingBottom: 20,
          WebkitOverflowScrolling: "touch",
        }}
      >
        {activeItems.map((item) => {
          const active = selectedId === item.id;
          const src = ADD_WEAR_ICONS[item.id];
          return (
            <button
              key={item.id}
              type="button"
              aria-pressed={active}
              onClick={() => pickItem(item)}
              className="shrink-0 flex items-center justify-center vf-segment-pill"
              style={{
                width: 86,
                height: 86,
                borderRadius: 12,
                backgroundColor: active ? "#343537" : "transparent",
              }}
            >
              {src ? (
                <img
                  src={src}
                  alt=""
                  draggable={false}
                  className="object-contain"
                  style={{ width: 62, height: 62 }}
                />
              ) : null}
            </button>
          );
        })}
      </div>
    </AnimatedSheetShell>
  );
}
