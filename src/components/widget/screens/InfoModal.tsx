import { useEffect, useState } from "react";
import { useWidgetConfig } from "@/widget/config";
import type { ProfilePhotoSlotId } from "@/widget/config";
import { useResolvedUploadExamples } from "@/widget/config/useResolvedUploadExamples";
import { PoweredByFooter } from "../PoweredByFooter";
import { AnimatedSheetShell } from "@/components/widget/ui/AnimatedSheetShell";
import {
  UploadTipsExamplesGrid,
  UploadTipsList,
  renderBalancedTitle,
} from "@/components/widget/ui/PhotoUploadTipsContent";
import { primaryButtonStyle } from "@/components/widget/ui/screenShell";

export interface InfoModalProps {
  open?: boolean;
  /** Слот для примеров; по умолчанию portrait. */
  slotId?: ProfilePhotoSlotId;
  gender?: "female" | "male";
  onClose?: () => void;
}

/** Information modal — Figma `674:3415` (bottom sheet как PhotoUploadDialog). */
export function InfoModal({
  open = true,
  slotId = "portrait",
  gender = "female",
  onClose,
}: InfoModalProps) {
  const { config, t } = useWidgetConfig();
  const ud = t.createProfile.uploadDialog;
  const c = t.screens.common;
  const [view, setView] = useState<"examples" | "tips">("examples");

  const rawExamples =
    config.createProfile.uploadExamples[gender]?.[slotId] ??
    config.createProfile.uploadExamples.female?.portrait ?? {
      good: [],
      bad: [],
    };
  const examples = useResolvedUploadExamples(rawExamples);

  const titleBySlot: Record<ProfilePhotoSlotId, string> = {
    portrait: ud.portraitTitle,
    fullHeight: ud.fullHeightTitle,
    back: ud.backTitle,
    profile: ud.profileTitle,
  };
  const title = titleBySlot[slotId];
  const tips = ud.tipsBySlot?.[slotId] ?? ud.tips;

  useEffect(() => {
    if (open) setView("examples");
  }, [open]);

  return (
    <AnimatedSheetShell
      open={open}
      onClose={() => onClose?.()}
      ariaLabel={title}
      panelStyle={{
        backgroundColor: "var(--vf-surface)",
        borderTopLeftRadius: "var(--vf-radius-widget)",
        borderTopRightRadius: "var(--vf-radius-widget)",
        maxHeight: "78%",
        boxShadow: "0 -12px 32px -16px rgba(0,0,0,0.25)",
      }}
    >
      <div
        className="flex items-center justify-center shrink-0"
        style={{ paddingTop: 10, paddingBottom: 6 }}
      >
        <span
          aria-hidden
          style={{
            width: 36,
            height: 4,
            borderRadius: 999,
            backgroundColor: "color-mix(in oklab, var(--vf-text) 18%, transparent)",
          }}
        />
      </div>

      <h2
        className="uppercase text-center shrink-0"
        style={{
          fontFamily: "var(--vf-font-heading)",
          fontWeight: 700,
          fontSize: "var(--vf-fs-22)",
          lineHeight: 1.15,
          letterSpacing: "0.02em",
          color: "var(--vf-text)",
          paddingInline: "var(--vf-sp-20)",
          paddingBottom: "var(--vf-sp-12)",
        }}
      >
        {slotId === "fullHeight" ? renderBalancedTitle(title) : title}
      </h2>

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
        <p
          style={{
            fontSize: "var(--vf-fs-13)",
            fontWeight: 400,
            lineHeight: 1.4,
            color: "color-mix(in oklab, var(--vf-text) 75%, transparent)",
            marginBottom: "var(--vf-sp-16)",
          }}
        >
          {ud.subtitle}
        </p>

        {view === "examples" ? (
          <UploadTipsExamplesGrid good={examples.good} bad={examples.bad} />
        ) : (
          <UploadTipsList tips={tips} />
        )}

        <button
          type="button"
          onClick={() => setView((v) => (v === "examples" ? "tips" : "examples"))}
          className="self-start text-left underline underline-offset-2 transition-opacity hover:opacity-80"
          style={{
            display: "inline-block",
            marginTop: "var(--vf-sp-16)",
            fontFamily: "var(--vf-font-body)",
            fontSize: "var(--vf-fs-13)",
            fontWeight: 500,
            color: "var(--vf-text)",
            background: "transparent",
          }}
        >
          {view === "examples" ? ud.showTips : ud.hideTips}
        </button>
      </div>

      <div
        className="shrink-0"
        style={{
          paddingInline: "var(--vf-sp-20)",
          paddingTop: "var(--vf-sp-12)",
          paddingBottom: "var(--vf-sp-8)",
        }}
      >
        <button
          type="button"
          onClick={onClose}
          className="w-full text-xs font-bold uppercase tracking-wide transition-opacity hover:opacity-90"
          style={primaryButtonStyle(true)}
        >
          {c.ok}
        </button>
      </div>

      <PoweredByFooter />
    </AnimatedSheetShell>
  );
}
