import { Camera, ChevronDown, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useWidgetConfig } from "@/widget/config";
import { BottomSheet } from "@/components/widget/ui/BottomSheet";
import { primaryButtonStyle } from "@/components/widget/ui/screenShell";

export interface AddSetSheetProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: { preview: string; name: string }) => void;
}

/** Sheet «добавить набор» — Figma `1129:8989` / `1286:10790`. */
export function AddSetSheet({ open, onClose, onSubmit }: AddSetSheetProps) {
  const { t } = useWidgetConfig();
  const copy = t.screens.wardrobeSetAdd;
  const sheet = t.screens.addSheet;
  const [name, setName] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) return;
    setName("");
    setPreview(null);
  }, [open]);

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPreview(String(reader.result ?? ""));
    reader.readAsDataURL(file);
  };

  const canSubmit = Boolean(preview);

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      ariaLabel={copy.title}
      title={copy.title}
      size="compact"
      showPoweredBy
      footer={
        <div
          className="shrink-0"
          style={{ paddingInline: "var(--vf-sp-20)", paddingBottom: "var(--vf-sp-12)" }}
        >
          <button
            type="button"
            disabled={!canSubmit}
            onClick={() => {
              if (!preview) return;
              onSubmit({ preview, name: name.trim() || copy.typeValue });
              onClose();
            }}
            className="w-full text-xs font-bold uppercase tracking-wide disabled:cursor-not-allowed disabled:opacity-40"
            style={primaryButtonStyle(canSubmit)}
          >
            {sheet.add}
          </button>
        </div>
      }
    >
      <div className="flex flex-col" style={{ gap: "var(--vf-sp-16)" }}>
        <label className="block w-full">
          <span className="sr-only">{sheet.namePlaceholder}</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={sheet.namePlaceholder}
            className="w-full px-4 lowercase border"
            style={{
              height: 46,
              borderRadius: 999,
              borderColor: "var(--vf-border)",
              fontSize: "var(--vf-fs-14)",
              color: "var(--vf-text)",
            }}
          />
        </label>

        <div
          className="flex items-center justify-between px-4 border"
          style={{
            height: 46,
            borderRadius: 999,
            borderColor: "var(--vf-border)",
            fontSize: "var(--vf-fs-14)",
            color: "#6d6f73",
          }}
        >
          <span className="lowercase">{copy.typeValue}</span>
          <ChevronDown size={18} strokeWidth={1.5} aria-hidden />
        </div>

        <p
          className="lowercase"
          style={{ fontSize: "var(--vf-fs-12)", color: "var(--vf-text-muted)", lineHeight: 1.4 }}
        >
          {copy.typeHint}
        </p>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
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
              <Camera size={24} strokeWidth={1.5} style={{ color: "var(--vf-text-muted)" }} />
            )}
          </button>

          <div className="flex flex-1 min-w-0 items-center gap-2">
            <div className="flex-1 min-w-0 text-left">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="lowercase"
                style={{ fontSize: "var(--vf-fs-14)", fontWeight: 700, color: "var(--vf-text)" }}
              >
                {sheet.uploadPhoto}
              </button>
              <button
                type="button"
                className="mt-1 block lowercase underline underline-offset-2 decoration-dotted"
                style={{ fontSize: "var(--vf-fs-12)", color: "var(--vf-text-muted)" }}
              >
                {sheet.photoTips}
              </button>
            </div>
            {preview ? (
              <button
                type="button"
                aria-label={t.screens.wardrobeEdit.deleteItem}
                onClick={() => setPreview(null)}
                className="shrink-0 flex items-center justify-center"
                style={{ width: 32, height: 32 }}
              >
                <Trash2 size={18} strokeWidth={1.5} style={{ color: "var(--vf-text)" }} />
              </button>
            ) : null}
          </div>
        </div>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </BottomSheet>
  );
}
