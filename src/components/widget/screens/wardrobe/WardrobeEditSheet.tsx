import { Check, ChevronDown, Search, Trash2, Upload, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useWidgetConfig } from "@/widget/config";
import { WarningModal } from "@/components/widget/screens/WarningModal";
import { BottomSheet } from "@/components/widget/ui/BottomSheet";
import { ItemPhotoTipsSheet } from "@/components/widget/ui/ItemPhotoTipsSheet";
import { primaryButtonStyle } from "@/components/widget/ui/screenShell";
import type { TileItem } from "./data";

const AREA_IDS = ["torso", "legs", "head", "hands"] as const;
type AreaId = (typeof AREA_IDS)[number];

export interface WardrobeEditSheetProps {
  open: boolean;
  item: TileItem | null;
  onClose: () => void;
  onSave?: (payload: { name: string; area: string; preview?: string }) => void;
  onDelete?: () => void;
  /** Gallery QA: сразу показать confirm удаления. */
  initialDeleteOpen?: boolean;
}

/** Редактировать вещь гардероба — Figma `1151:12252`. */
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
  const [area, setArea] = useState<AreaId>("torso");
  const [areaOpen, setAreaOpen] = useState(false);
  const [areaQuery, setAreaQuery] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(initialDeleteOpen);
  const [tipsOpen, setTipsOpen] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const areaWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open || !item) return;
    setName(item.label);
    setArea("torso");
    setAreaOpen(false);
    setAreaQuery("");
    setPreview(item.imageUrl ?? null);
    setTipsOpen(false);
    if (initialDeleteOpen) setDeleteOpen(true);
  }, [open, item, initialDeleteOpen]);

  useEffect(() => {
    if (!areaOpen) return;
    const onPointer = (e: MouseEvent) => {
      if (!areaWrapRef.current?.contains(e.target as Node)) {
        setAreaOpen(false);
        setAreaQuery("");
      }
    };
    document.addEventListener("mousedown", onPointer);
    return () => document.removeEventListener("mousedown", onPointer);
  }, [areaOpen]);

  const areaOptions = useMemo(
    () =>
      AREA_IDS.map((id) => ({
        id,
        label: we.areas[id],
      })),
    [we.areas],
  );

  const filteredAreas = useMemo(() => {
    const q = areaQuery.trim().toLowerCase();
    if (!q) return areaOptions;
    return areaOptions.filter((opt) => opt.label.toLowerCase().includes(q));
  }, [areaOptions, areaQuery]);

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPreview(String(reader.result ?? ""));
    reader.readAsDataURL(file);
  };

  if (!item) return null;

  const areaLabel = we.areas[area];

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
              onClick={() => onSave?.({ name, area: areaLabel, preview: preview ?? undefined })}
              className="flex-1 text-xs font-bold uppercase tracking-wide"
              style={primaryButtonStyle(true)}
              title={t.screens.common.save}
            >
              {t.screens.common.save}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="shrink-0 flex items-center justify-center rounded-full border"
              style={{ width: 46, height: 46, borderColor: "var(--vf-border)" }}
              title={t.screens.common.close}
              aria-label={t.screens.common.close}
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
              title={we.nameLabel}
            />
          </label>

          <div ref={areaWrapRef} className="relative w-full">
            <button
              type="button"
              className="flex items-center justify-between w-full px-4 rounded-lg border lowercase"
              style={{ height: 40, borderColor: "var(--vf-border)", fontSize: "var(--vf-fs-14)" }}
              aria-expanded={areaOpen}
              aria-haspopup="listbox"
              aria-label={we.areaLabel}
              title={we.areaLabel}
              onClick={() => {
                setAreaOpen((v) => !v);
                setAreaQuery("");
              }}
            >
              {areaLabel}
              <ChevronDown
                size={18}
                style={{
                  color: "var(--vf-text-muted)",
                  transform: areaOpen ? "rotate(180deg)" : undefined,
                  transition: "transform 0.15s ease",
                }}
              />
            </button>

            {areaOpen ? (
              <div
                className="absolute left-0 right-0 z-20 mt-1 overflow-hidden rounded-lg border"
                style={{
                  backgroundColor: "var(--vf-surface)",
                  borderColor: "var(--vf-border)",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                }}
                role="listbox"
                aria-label={we.areaLabel}
              >
                <div
                  className="flex items-center gap-2 px-3 border-b"
                  style={{ height: 36, borderColor: "var(--vf-border)" }}
                >
                  <Search size={14} style={{ color: "var(--vf-text-muted)" }} aria-hidden />
                  <input
                    value={areaQuery}
                    onChange={(e) => setAreaQuery(e.target.value)}
                    placeholder={we.areaSearch}
                    className="flex-1 min-w-0 bg-transparent lowercase outline-none"
                    style={{ fontSize: "var(--vf-fs-12)", color: "var(--vf-text)" }}
                    title={we.areaSearch}
                    autoFocus
                  />
                </div>
                <ul className="max-h-40 overflow-y-auto py-1">
                  {filteredAreas.length === 0 ? (
                    <li
                      className="px-4 py-2 lowercase"
                      style={{ fontSize: "var(--vf-fs-12)", color: "var(--vf-text-muted)" }}
                    >
                      —
                    </li>
                  ) : (
                    filteredAreas.map((opt) => {
                      const selected = opt.id === area;
                      return (
                        <li key={opt.id}>
                          <button
                            type="button"
                            role="option"
                            aria-selected={selected}
                            title={opt.label}
                            className="flex w-full items-center justify-between px-4 lowercase"
                            style={{
                              height: 36,
                              fontSize: "var(--vf-fs-14)",
                              backgroundColor: selected
                                ? "color-mix(in oklab, var(--vf-text) 6%, transparent)"
                                : "transparent",
                              color: "var(--vf-text)",
                            }}
                            onClick={() => {
                              setArea(opt.id);
                              setAreaOpen(false);
                              setAreaQuery("");
                            }}
                          >
                            {opt.label}
                            {selected ? (
                              <Check size={14} strokeWidth={2.5} aria-hidden />
                            ) : null}
                          </button>
                        </li>
                      );
                    })
                  )}
                </ul>
              </div>
            ) : null}
          </div>

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
                title={we.uploadPhoto}
              >
                {we.uploadPhoto}
              </button>
              <button
                type="button"
                onClick={() => setTipsOpen(true)}
                className="mt-1 block text-left lowercase underline underline-offset-2 decoration-dotted"
                style={{ fontSize: "var(--vf-fs-12)", color: "var(--vf-text-muted)" }}
                title={we.photoTips}
              >
                {we.photoTips}
              </button>
            </div>
            <button
              type="button"
              aria-label={we.deleteItem}
              title={we.deleteItem}
              onClick={() => setDeleteOpen(true)}
            >
              <Trash2 size={18} style={{ color: "var(--vf-text-muted)" }} />
            </button>
          </div>

          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="text-left lowercase underline underline-offset-2"
            style={{ fontSize: "var(--vf-fs-12)", color: "var(--vf-text)" }}
            title={we.uploadExtra}
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

      <ItemPhotoTipsSheet open={tipsOpen} onClose={() => setTipsOpen(false)} />

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
