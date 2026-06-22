import { Camera, Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useWidgetConfig } from "@/widget/config";
import type { ProfilePhotoSlotId } from "@/widget/config";
import { useResolvedUploadExamples } from "@/widget/config/useResolvedUploadExamples";
import { BottomSheet } from "@/components/widget/ui/BottomSheet";
import {
  UploadTipsExamplesGrid,
  UploadTipsList,
  renderBalancedTitle,
} from "./PhotoUploadTipsContent";

interface PhotoUploadDialogProps {
  open: boolean;
  slotId: ProfilePhotoSlotId;
  /** Пол выбранного профиля — определяет, какие примеры показать. */
  gender: "female" | "male";
  onClose: () => void;
  onSelected: (dataUrl: string) => void;
}

/**
 * Bottom-sheet диалог загрузки фото профиля.
 * Два режима:
 *   - examples (по умолчанию): сетка примеров «хорошо/плохо»
 *   - tips: текстовые рекомендации
 * Кнопки внизу:
 *   - Камера → input[capture=user]
 *   - Выбрать → input[file]
 */
export function PhotoUploadDialog({
  open,
  slotId,
  gender,
  onClose,
  onSelected,
}: PhotoUploadDialogProps) {
  const { t, config } = useWidgetConfig();
  const ud = t.createProfile.uploadDialog;
  const rawExamples =
    config.createProfile.uploadExamples[gender]?.[slotId] ??
    { good: [], bad: [] };
  const examples = useResolvedUploadExamples(rawExamples);
  const [view, setView] = useState<"examples" | "tips">("examples");

  const cameraRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) setView("examples");
  }, [open]);

  const titleBySlot: Record<ProfilePhotoSlotId, string> = {
    portrait: ud.portraitTitle,
    fullHeight: ud.fullHeightTitle,
    back: ud.backTitle,
    profile: ud.profileTitle,
  };
  const title = titleBySlot[slotId];
  const displayTitle = slotId === "fullHeight" ? renderBalancedTitle(title) : title;

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const url = String(reader.result ?? "");
      if (!url) return;
      console.info("[VirtuFit] photo selected", { slotId, size: file.size });
      onSelected(url);
      onClose();
    };
    reader.onerror = () => {
      console.error("[VirtuFit] FileReader error", reader.error);
    };
    reader.readAsDataURL(file);
  };

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      ariaLabel={title}
      title={displayTitle}
      titleVariant="dialog"
      size="tall"
      scrollBody
      footer={
        <div
          className="flex w-full min-w-0 shrink-0"
          style={{
            gap: "var(--vf-sp-12)",
            paddingInline: "var(--vf-sp-20)",
            paddingTop: "var(--vf-sp-12)",
            paddingBottom: "var(--vf-sp-8)",
          }}
        >
            <ActionButton
              icon={<Camera strokeWidth={1.5} style={iconStyle} />}
              label={ud.cameraBtn}
              onClick={() => cameraRef.current?.click()}
            />
            <ActionButton
              icon={<Upload strokeWidth={1.5} style={iconStyle} />}
              label={ud.selectBtn}
              onClick={() => fileRef.current?.click()}
            />
        </div>
      }
    >
      <div
        className="h-px w-full -mx-[var(--vf-sp-20)] mb-4"
        style={{
          width: "calc(100% + 2 * var(--vf-sp-20))",
          backgroundColor: "color-mix(in oklab, var(--vf-text) 10%, transparent)",
        }}
      />
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
        <UploadTipsExamplesGrid
          good={examples.good}
          bad={examples.bad}
          onSelectGood={(url) => {
            onSelected(url);
            onClose();
          }}
        />
      ) : (
        <UploadTipsList tips={ud.tipsBySlot?.[slotId] ?? ud.tips} />
      )}

      <button
        type="button"
        onClick={() => setView((v) => (v === "examples" ? "tips" : "examples"))}
        className="self-start text-left underline underline-offset-2"
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

      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="user"
        hidden
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </BottomSheet>
  );
}

const iconStyle = {
  width: 18,
  height: 18,
  color: "var(--vf-btn-text)",
};

function ActionButton({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center justify-center flex-1 min-w-0 uppercase"
      style={{
        gap: "var(--vf-sp-10)",
        height: 52,
        borderRadius: "var(--vf-radius-button)",
        backgroundColor: "var(--vf-btn-bg)",
        color: "var(--vf-btn-text)",
        fontFamily: "var(--vf-font-heading)",
        fontWeight: 700,
        fontSize: "var(--vf-fs-13)",
        letterSpacing: "0.04em",
      }}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
