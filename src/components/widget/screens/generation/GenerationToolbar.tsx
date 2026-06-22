import { GENERATION_TOOLBAR_ICONS } from "@/components/widget/screens/generation/toolbarIcons";

/** Toolbar под hero — Figma `674:4760`: share, sliders, ai-image, ai-video. */
export function GenerationToolbar({
  primaryLabel = "примерить",
  shareLabel = "Поделиться",
  settingsLabel = "Настроить образ",
  enhanceLabel = "Сменить фон",
  videoLabel = "Оживить",
  disabled,
  onPrimary,
  onShare,
  onSettings,
  onEnhance,
  onVideo,
}: {
  primaryLabel?: string;
  shareLabel?: string;
  settingsLabel?: string;
  enhanceLabel?: string;
  videoLabel?: string;
  disabled?: boolean;
  onPrimary?: () => void;
  onShare?: () => void;
  onSettings?: () => void;
  onEnhance?: () => void;
  onVideo?: () => void;
}) {
  const secondaryActions: Array<{
    id: "share" | "settings" | "enhance" | "video";
    iconSrc: string;
    label: string;
    onClick?: () => void;
  }> = [
    { id: "share", iconSrc: GENERATION_TOOLBAR_ICONS.share, label: shareLabel, onClick: onShare },
    {
      id: "settings",
      iconSrc: GENERATION_TOOLBAR_ICONS.settings,
      label: settingsLabel,
      onClick: onSettings,
    },
    {
      id: "enhance",
      iconSrc: GENERATION_TOOLBAR_ICONS.changeBackground,
      label: enhanceLabel,
      onClick: onEnhance,
    },
    { id: "video", iconSrc: GENERATION_TOOLBAR_ICONS.animate, label: videoLabel, onClick: onVideo },
  ];

  return (
    <div className="flex items-center gap-1.5 px-3">
      <button
        type="button"
        disabled={disabled}
        onClick={onPrimary}
        className="flex-1 text-xs font-bold uppercase tracking-wide shrink-0 disabled:cursor-not-allowed disabled:opacity-40"
        style={{
          height: "var(--vf-sz-46)",
          borderRadius: "var(--vf-radius-button)",
          backgroundColor: "var(--vf-btn-bg)",
          color: "var(--vf-btn-text)",
        }}
      >
        {primaryLabel}
      </button>
      {secondaryActions.map(({ id, iconSrc, label, onClick }) => (
        <button
          key={id}
          type="button"
          disabled={disabled && id !== "share"}
          aria-label={label}
          onClick={onClick}
          className="shrink-0 flex items-center justify-center rounded-full overflow-hidden disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            width: "var(--vf-sz-46)",
            height: "var(--vf-sz-46)",
            backgroundColor: "var(--vf-surface)",
          }}
        >
          <img src={iconSrc} alt="" className="w-full h-full object-contain" draggable={false} />
        </button>
      ))}
    </div>
  );
}
