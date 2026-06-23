import { Sparkles } from "lucide-react";
import { useState } from "react";
import { useWidgetConfig } from "@/widget/config";
import { useWidgetProfile } from "@/widget/WidgetProfileContext";
import { WidgetHeader } from "@/components/widget/WidgetHeader";
import { Watermark } from "@/components/widget/Watermark";
import { type PoseId } from "@/components/widget/screens/generation/data";
import {
  ConfiguringHeroPreview,
  PosePickerGrid,
  ProfileAvatarPicker,
} from "@/components/widget/screens/generation/PosePickerGrid";
import {
  primaryButtonStyle,
  sectionHeadingStyle,
  widgetScreenShellStyle,
} from "@/components/widget/ui/screenShell";

export interface ConfiguringGenerationProps {
  onOpenMenu?: () => void;
  onClose?: () => void;
  onGenerate?: () => void;
}

/** Configuring Generation — Figma `723:3176`. */
export function ConfiguringGeneration({
  onOpenMenu,
  onClose,
  onGenerate,
}: ConfiguringGenerationProps) {
  const { t } = useWidgetConfig();
  const cfg = t.screens.configuring;
  const {
    heroImage,
    configuringProfileIndex,
    setConfiguringProfileIndex,
  } = useWidgetProfile();
  const [selectedPoses, setSelectedPoses] = useState<ReadonlySet<PoseId>>(
    () => new Set<PoseId>(["front", "three-quarter", "back"]),
  );

  const togglePose = (id: PoseId) => {
    setSelectedPoses((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        if (next.size > 1) next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="flex flex-col flex-1 min-h-0" style={widgetScreenShellStyle}>
      <WidgetHeader
        onMenu={onOpenMenu}
        onProfile={onOpenMenu}
        onClose={onClose}
        profileLabel={t.start.profile}
      />

      <div className="flex flex-col flex-1 min-h-0 overflow-y-auto">
        <div
          className="relative w-full overflow-hidden shrink-0"
          style={{
            height: "var(--vf-h-configuring-hero)",
            backgroundColor: "var(--vf-card-hero)",
          }}
        >
          <ConfiguringHeroPreview src={heroImage} />
        </div>

        <section
          style={{
            paddingInline: "var(--vf-sp-12)",
            paddingTop: "var(--vf-sp-24)",
            paddingBottom: "var(--vf-sp-20)",
          }}
        >
          <h2 className="mb-3" style={sectionHeadingStyle}>
            {cfg.selectProfile}
          </h2>
          <ProfileAvatarPicker
            selected={configuringProfileIndex}
            onSelect={setConfiguringProfileIndex}
          />
        </section>

        <div
          style={{
            marginInline: "var(--vf-sp-12)",
            height: 1,
            backgroundColor: "color-mix(in oklab, var(--vf-text) 12%, var(--vf-surface))",
          }}
        />

        <section
          className="pb-4"
          style={{ paddingInline: "var(--vf-sp-12)", paddingTop: "var(--vf-sp-24)" }}
        >
          <h2 className="mb-3" style={sectionHeadingStyle}>
            {cfg.selectPose}
          </h2>
          <PosePickerGrid selected={selectedPoses} onToggle={togglePose} />
        </section>
      </div>

      <div className="px-3 pt-3 pb-0 shrink-0" style={{ paddingInline: "var(--vf-sp-12)" }}>
        <button
          type="button"
          onClick={onGenerate}
          className="w-full flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wide"
          style={primaryButtonStyle(true)}
        >
          <Sparkles size={16} strokeWidth={1.75} />
          {t.screens.generation.tryOn}
        </button>
      </div>
      <Watermark />
    </div>
  );
}
