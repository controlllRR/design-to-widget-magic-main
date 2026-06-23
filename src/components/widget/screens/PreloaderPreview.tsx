import { useWidgetConfig } from "@/widget/config";
import { WidgetHeader } from "@/components/widget/WidgetHeader";
import { Watermark } from "@/components/widget/Watermark";
import { PRELOADER_OUTFIT } from "@/components/widget/screens/generation/data";
import { GenerationHero } from "@/components/widget/screens/generation/GenerationHero";
import { GenerationPreloaderOverlay } from "@/components/widget/screens/generation/GenerationPreloaderOverlay";
import { GenerationToolbar } from "@/components/widget/screens/generation/GenerationToolbar";
import {
  OutfitComposition,
  SizeWarningBanner,
} from "@/components/widget/screens/generation/OutfitComposition";
import { widgetScreenShellStyle } from "@/components/widget/ui/screenShell";

export interface PreloaderPreviewProps {
  variant?: "v1" | "v2";
  onDone?: () => void;
}

/** Preloader Preview — Figma `1183:16399` / `1192:16812`. */
export function PreloaderPreview({ variant = "v1", onDone }: PreloaderPreviewProps) {
  const { t } = useWidgetConfig();
  const loading = true;

  return (
    <div className="flex flex-col flex-1 min-h-0" style={widgetScreenShellStyle}>
      <WidgetHeader profileLabel={t.start.profile} showPinnedShortcuts={false} />

      <div className="flex flex-col flex-1 min-h-0 overflow-y-auto pb-2">
        <GenerationHero
          height={516}
          wearRails
          disabled
          overlay={<GenerationPreloaderOverlay label={t.screens.preloader.label} />}
        />

        <div
          style={{
            paddingInline: "var(--vf-sp-12)",
            paddingTop: "var(--vf-sp-24)",
            paddingBottom: "var(--vf-sp-24)",
          }}
        >
          <GenerationToolbar primaryLabel={t.screens.generation.tryOn} disabled={loading} />
        </div>

        <OutfitComposition items={PRELOADER_OUTFIT} skeleton={variant === "v1"} />

        <div className="pt-2">
          <SizeWarningBanner />
        </div>

        {import.meta.env.DEV && onDone && (
          <button
            type="button"
            onClick={onDone}
            className="mx-3 mb-4 text-[10px] underline text-left"
            style={{ color: "var(--vf-text-muted)", paddingInline: "var(--vf-sp-12)" }}
          >
            {t.screens.preloader.devDone}
          </button>
        )}
      </div>
      <Watermark compact />
    </div>
  );
}
