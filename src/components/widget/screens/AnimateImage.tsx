import { useState } from "react";
import { useWidgetConfig } from "@/widget/config";
import { useResolvedConfigTiles } from "@/widget/config/useResolvedTiles";
import { WidgetHeader } from "@/components/widget/WidgetHeader";
import { SearchFilterBar, TileGrid } from "@/components/widget/screens/wardrobe/TileGrid";
import { Watermark } from "@/components/widget/Watermark";
import {
  pageTitleStyle,
  primaryButtonStyle,
  secondaryButtonStyle,
  widgetScreenShellStyle,
} from "@/components/widget/ui/screenShell";

export interface AnimateImageProps {
  onOpenMenu?: () => void;
  onClose?: () => void;
  onApply?: (id: string) => void;
  onCancel?: () => void;
}

/** Оживить образ — Figma `833:15546`. */
export function AnimateImage({
  onOpenMenu,
  onClose,
  onApply,
  onCancel,
}: AnimateImageProps) {
  const { t, config } = useWidgetConfig();
  const s = t.screens;
  const tiles = useResolvedConfigTiles(config.animateLook.poses);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState("pose-v1");

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
            {s.animate.title}
          </h1>
        </div>

        <SearchFilterBar placeholder={s.animate.search} value={query} onChange={setQuery} />

        <div className="pt-4">
          <TileGrid
            items={tiles}
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
    </div>
  );
}
