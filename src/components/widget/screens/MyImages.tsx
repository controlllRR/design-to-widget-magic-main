import { Trash2 } from "lucide-react";
import { useMemo, useState, type MouseEvent } from "react";
import { useWidgetConfig } from "@/widget/config";
import { WidgetHeader } from "@/components/widget/WidgetHeader";
import { Watermark } from "@/components/widget/Watermark";
import { WarningModal } from "@/components/widget/screens/WarningModal";
import { MY_IMAGES_CARDS, type TryOnCard } from "@/components/widget/screens/my-images/data";
import {
  pageTitleStyle,
  primaryButtonStyle,
  widgetScreenShellStyle,
} from "@/components/widget/ui/screenShell";

export interface MyImagesProps {
  onOpenMenu?: () => void;
  onClose?: () => void;
  onNewTryOn?: () => void;
  onOpenTryOn?: (id: string) => void;
  /** Gallery QA: открыть confirm удаления примерки. */
  initialDeleteWarning?: boolean;
}

/** Мои примерки — Figma `1169:15884`. */
export function MyImages({
  onOpenMenu,
  onClose,
  onNewTryOn,
  onOpenTryOn,
  initialDeleteWarning = false,
}: MyImagesProps) {
  const { t } = useWidgetConfig();
  const mi = t.screens.myImages;
  const deleteWarning = t.screens.warnings.deleteTryOn;
  const [cards, setCards] = useState<TryOnCard[]>(() => [...MY_IMAGES_CARDS]);
  const [deleteOpen, setDeleteOpen] = useState(initialDeleteWarning);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(
    initialDeleteWarning ? (MY_IMAGES_CARDS[0]?.id ?? null) : null,
  );

  const pendingCard = useMemo(
    () => cards.find((c) => c.id === pendingDeleteId) ?? null,
    [cards, pendingDeleteId],
  );

  const requestDelete = (e: MouseEvent, id: string) => {
    e.stopPropagation();
    setPendingDeleteId(id);
    setDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (pendingDeleteId) {
      setCards((prev) => prev.filter((c) => c.id !== pendingDeleteId));
    }
    setPendingDeleteId(null);
    setDeleteOpen(false);
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
        <div className="px-3 pt-4 pb-3">
          <h1 className="text-left" style={pageTitleStyle}>
            {mi.title}
          </h1>
        </div>

        <div
          className="grid pb-4"
          style={{
            gap: "var(--vf-sp-12)",
            paddingInline: "var(--vf-sp-12)",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          }}
        >
          {cards.map((card) => (
            <div
              key={card.id}
              className="relative overflow-hidden w-full"
              style={{
                height: 244,
                borderRadius: "var(--vf-radius-tile)",
                backgroundColor: "var(--vf-surface-muted)",
              }}
            >
              <button
                type="button"
                onClick={() => onOpenTryOn?.(card.id)}
                className="block w-full h-full text-left"
              >
                <img
                  src={card.imageUrl}
                  alt=""
                  className="w-full h-full object-cover"
                  draggable={false}
                />
              </button>
              <button
                type="button"
                aria-label={mi.deleteAria}
                onClick={(e) => requestDelete(e, card.id)}
                className="absolute flex items-center justify-center"
                style={{
                  top: 12,
                  right: 12,
                  width: 32,
                  height: 32,
                  borderRadius: 999,
                  backgroundColor: "var(--vf-surface)",
                }}
              >
                <Trash2 size={16} strokeWidth={1.5} style={{ color: "var(--vf-text)" }} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="shrink-0" style={{ paddingInline: "var(--vf-sp-12)", paddingBottom: "var(--vf-sp-8)" }}>
        <button
          type="button"
          onClick={onNewTryOn}
          className="w-full text-xs font-bold uppercase tracking-wide"
          style={primaryButtonStyle(true)}
        >
          {mi.newTryOn}
        </button>
      </div>
      <Watermark />

      <WarningModal
        open={deleteOpen && pendingCard !== null}
        title={deleteWarning.title}
        confirmLabel={deleteWarning.confirm}
        cancelLabel={deleteWarning.cancel}
        onCancel={() => {
          setDeleteOpen(false);
          setPendingDeleteId(null);
        }}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
