import { useState } from "react";
import { useWidgetConfig } from "@/widget/config";
import { useResolvedConfigTiles } from "@/widget/config/useResolvedTiles";
import { WidgetHeader } from "@/components/widget/WidgetHeader";
import { Watermark } from "@/components/widget/Watermark";
import { SearchFilterBar, TileGrid } from "@/components/widget/screens/wardrobe/TileGrid";
import { AddCustomUploadSheet } from "@/components/widget/ui/AddCustomUploadSheet";
import {
  pageTitleStyle,
  primaryButtonStyle,
  secondaryButtonStyle,
  widgetScreenShellStyle,
} from "@/components/widget/ui/screenShell";

export interface ChangeBackgroundProps {
  onOpenMenu?: () => void;
  onClose?: () => void;
  onApply?: (id: string) => void;
  onCancel?: () => void;
  /** Gallery QA: открыть sheet загрузки кастомного фона. */
  initialUploadOpen?: boolean;
}

/** Сменить фон — Figma `773:11505`. */
export function ChangeBackground({
  onOpenMenu,
  onClose,
  onApply,
  onCancel,
  initialUploadOpen = false,
}: ChangeBackgroundProps) {
  const { t, config } = useWidgetConfig();
  const s = t.screens;
  const catalogTiles = useResolvedConfigTiles(config.teleport.backgrounds);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState("studio-cold");
  const [uploadOpen, setUploadOpen] = useState(initialUploadOpen);
  const [customBg, setCustomBg] = useState<string | null>(null);

  const tiles = customBg
    ? [{ id: "custom-bg", label: s.background.addCustom, imageUrl: customBg }, ...catalogTiles]
    : catalogTiles;

  return (
    <div className="relative flex flex-col flex-1 min-h-0" style={widgetScreenShellStyle}>
      <WidgetHeader
        onMenu={onOpenMenu}
        onProfile={onOpenMenu}
        onClose={onClose}
        profileLabel={t.start.profile}
      />

      <div className="flex flex-col flex-1 min-h-0 overflow-y-auto">
        <div className="px-3 pt-4 pb-3">
          <h1 className="text-left" style={pageTitleStyle}>
            {s.background.title}
          </h1>
        </div>

        <SearchFilterBar placeholder={s.background.search} value={query} onChange={setQuery} />

        <div className="pt-4">
          <TileGrid
            columns={3}
            items={tiles}
            addLabel={s.background.addCustom}
            onAdd={() => setUploadOpen(true)}
            selectedId={selected}
            onSelect={setSelected}
            query={query}
            selectionMode="radio"
          />
        </div>
      </div>

      <div className="flex gap-2.5 px-3 pt-3 pb-0 shrink-0">
        <button
          type="button"
          onClick={() => onApply?.(selected)}
          className="flex-1 text-xs font-bold uppercase tracking-wide"
          style={primaryButtonStyle(true)}
        >
          {s.common.apply}
        </button>
        <button
          type="button"
          onClick={onCancel ?? onClose}
          className="flex-1 text-xs lowercase"
          style={secondaryButtonStyle}
        >
          {s.common.cancel}
        </button>
      </div>
      <Watermark />

      <AddCustomUploadSheet
        open={uploadOpen}
        title={s.background.addCustom}
        onClose={() => setUploadOpen(false)}
        onSelected={(url) => {
          setCustomBg(url);
          setSelected("custom-bg");
        }}
      />
    </div>
  );
}
