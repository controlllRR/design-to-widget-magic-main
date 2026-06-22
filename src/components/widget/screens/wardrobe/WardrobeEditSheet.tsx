import { ChevronDown, Trash2, Upload, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useWidgetConfig } from "@/widget/config";
import { WarningModal } from "@/components/widget/screens/WarningModal";
import { BottomSheet } from "@/components/widget/ui/BottomSheet";
import { primaryButtonStyle } from "@/components/widget/ui/screenShell";
import type { TileItem } from "./data";

const AREAS = ["Торс", "Ноги", "Голова", "Руки"] as const;

export interface WardrobeEditSheetProps {
  open: boolean;
  item: TileItem | null;
  onClose: () => void;
  onSave?: (payload: { name: string; area: string; preview?: string }) => void;
  onDelete?: () => void;
  /** Gallery QA: сразу показать confirm удаления. */
  initialDeleteOpen?: boolean;
}

/** Редактировать вещь гардерoba — Figma `1151:12252`. */
export function WardrobeEditSheet({
  open,
  item,
  onClose,
  onSave,
  onDelete,
  initialDeleteOpen = false,
}: WardrobeEditSheetProps) {
  const { t } = useWidgetConfig();
  const we = t.screens.wardrobeEdit;
  const [name, setName] = useState("");
  const [area, setArea] = useState<string>(AREAS[0]);
  const [preview, setPreview] = useState<string | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(initialDeleteOpen);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open || !item) return;
    setName(item.label);
    setArea(AREAS[0]);
    setPreview(item.imageUrl ?? null);
    if (initialDeleteOpen) setDeleteOpen(true);
  }, [open, item, initialDeleteOpen]);

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPreview(String(reader.result ?? ""));
    reader.readAsDataURL(file);
  };

  if (!item) return null;

  return (
    <>
      <BottomSheet
        open={open}
        onClose={onClose}
        ariaLabel={we.title}
        title={we.title}
        size="medium"
        scrollBody
        footer={
          <div
            className="flex gap-2.5 shrink-0"
            style={{ paddingInline: "var(--vf-sp-20)", paddingBottom: "var(--vf-sp-8)" }}
          >
            <button
              type="button"
              onClick={() => onSave?.({ name, area, preview: preview ?? undefined })}
              className="flex-1 text-xs font-bold uppercase tracking-wide"
              style={primaryButtonStyle(true)}
            >
              {t.screens.common.save}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="shrink-0 flex items-center justify-center rounded-full border"
              style={{ width: 46, height: 46, borderColor: "var(--vf-border)" }}
            >
              <X size={18} />
            </button>
          </div>
        }
      >
        <div className="flex flex-col" style={{ gap: "var(--vf-sp-12)" }}>
          <label className="block w-full">
            <span className="sr-only">{we.nameLabel}</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 rounded-lg border lowercase"
              style={{
                height: 40,
                borderColor: "var(--vf-border)",
                fontSize: "var(--vf-fs-14)",
              }}
            />
          </label>

          <button
            type="button"
            className="flex items-center justify-between w-full px-4 rounded-lg border lowercase"
            style={{ height: 40, borderColor: "var(--vf-border)", fontSize: "var(--vf-fs-14)" }}
            onClick={() => {
              const idx = AREAS.indexOf(area as (typeof AREAS)[number]);
              setArea(AREAS[(idx + 1) % AREAS.length]);
            }}
          >
            {area}
            <ChevronDown size={18} style={{ color: "var(--vf-text-muted)" }} />
          </button>

          <div className="flex items-center gap-3">
            <div
              className="shrink-0 overflow-hidden flex items-center justify-center"
              style={{
                width: 86,
                height: 86,
                borderRadius: 12,
                border: "1px dashed var(--vf-border)",
                backgroundColor: preview ? "transparent" : "var(--vf-surface-muted)",
              }}
            >
              {preview ? (
                <img src={preview} alt="" className="w-full h-full object-cover" draggable={false} />
              ) : (
                <Upload size={24} style={{ color: "var(--vf-text-muted)" }} />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="text-left lowercase"
                style={{ fontSize: "var(--vf-fs-14)", fontWeight: 700 }}
              >
                {we.uploadPhoto}
              </button>
              <p
                className="mt-1 lowercase underline underline-offset-2 decoration-dotted"
                style={{ fontSize: "var(--vf-fs-12)", color: "var(--vf-text-muted)" }}
              >
                {we.photoTips}
              </p>
            </div>
            <button type="button" aria-label={we.deleteItem} onClick={() => setDeleteOpen(true)}>
              <Trash2 size={18} style={{ color: "var(--vf-text-muted)" }} />
            </button>
          </div>

          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="text-left lowercase underline underline-offset-2"
            style={{ fontSize: "var(--vf-fs-12)", color: "var(--vf-text)" }}
          >
            {we.uploadExtra}
          </button>
        </div>

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </BottomSheet>

      <WarningModal
        open={deleteOpen}
        title={t.screens.warnings.deleteWardrobeItem.title}
        confirmLabel={t.screens.warnings.deleteWardrobeItem.confirm}
        cancelLabel={t.screens.warnings.deleteWardrobeItem.cancel}
        onCancel={() => setDeleteOpen(false)}
        onConfirm={() => {
          setDeleteOpen(false);
          onDelete?.();
          onClose();
        }}
      />
    </>
  );
}
