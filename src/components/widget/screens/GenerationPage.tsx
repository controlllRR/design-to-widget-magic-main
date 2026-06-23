import { useMemo, useRef, useState, useEffect } from "react";
import {
  BrushCleaning,
  Download,
  HelpCircle,
  Link2,
  Maximize2,
  Share2,
  Trash2,
} from "lucide-react";
import { useWidgetConfig } from "@/widget/config";
import { WidgetHeader } from "@/components/widget/WidgetHeader";
import { Watermark } from "@/components/widget/Watermark";
import { WarningModal } from "@/components/widget/screens/WarningModal";
import {
  GENERATION_HERO,
  GENERATION_OUTFIT,
  OUTFIT_TO_WEAR,
} from "@/components/widget/screens/generation/data";
import { GenerationHero } from "@/components/widget/screens/generation/GenerationHero";
import { GenerationPreloaderOverlay } from "@/components/widget/screens/generation/GenerationPreloaderOverlay";
import type { WearSlot } from "@/components/widget/screens/generation/GenerationHeroOverlay";
import { GenerationToolbar } from "@/components/widget/screens/generation/GenerationToolbar";
import {
  OutfitComposition,
  SizeWarningBanner,
} from "@/components/widget/screens/generation/OutfitComposition";
import { OutfitItemConfigSheet } from "@/components/widget/screens/generation/OutfitItemConfigSheet";
import {
  defaultConfigForItem,
  type OutfitItemConfigValues,
} from "@/components/widget/screens/generation/outfitItemConfig";
import { GenerationModularListSheet } from "@/components/widget/screens/generation/GenerationModularListSheet";
import { AddWearPickerSheet } from "@/components/widget/screens/generation/AddWearPickerSheet";
import {
  ACCESSORY_ADD_TABS,
  OUTFIT_ADD_TABS,
} from "@/components/widget/screens/generation/addWearCatalog";
import {
  copyLookLink,
  downloadLookImage,
  openLookFullscreen,
  shareLookVia,
} from "@/components/widget/screens/generation/generationShareActions";
import { widgetScreenShellStyle } from "@/components/widget/ui/screenShell";
import type { TileItem } from "@/components/widget/screens/wardrobe/data";

export interface GenerationPageProps {
  onOpenMenu?: () => void;
  onClose?: () => void;
  onAddToWardrobe?: () => void;
  onAddFromStore?: () => void;
  onAddFromWardrobe?: () => void;
  onConfigure?: () => void;
  /** Figma `clean` — confirm «очистить весь образ». */
  onClearOutfit?: () => void;
  /** @deprecated use onClearOutfit */
  onShowWarning?: () => void;
  onMore?: () => void;
  onChangeBackground?: () => void;
  onAnimate?: () => void;
  /** Figma toolbar share — List-Share `732:4119`. Override для gallery. */
  onShare?: () => void;
  onShowHowItWorks?: () => void;
  onDeleteOutfit?: () => void;
  onShareNotice?: (message: string) => void;
  /** Клик по «готовым образам» — показать confirm замены набора. */
  onLooksSelect?: () => void;
  /** Прелоадер «примерка» — управляется Widget, чтобы не сбрасывался при ре-рендере. */
  isGenerating?: boolean;
  generatingVariant?: "v1" | "v2";
  onTryOn?: () => void;
  /** Gallery QA: открыть config sheet для вещи. */
  initialConfigItemId?: string;
  /** Gallery QA: сразу показать confirm «очистить элемент». */
  initialClearItemWarning?: boolean;
  onInitialGeneratingConsumed?: () => void;
  /** Выбранный набор из гардероба — заменяет состав образа. */
  appliedSet?: TileItem | null;
}

/** Generation page — Figma nEJeT6wB7wu3XOya5ZMPPH `674:4649` / board `59:2578`. */
export function GenerationPage({
  onOpenMenu,
  onClose,
  onAddToWardrobe,
  onAddFromStore,
  onAddFromWardrobe,
  onConfigure,
  onClearOutfit,
  onShowWarning,
  onMore,
  onChangeBackground,
  onAnimate,
  onShare,
  onShowHowItWorks,
  onDeleteOutfit,
  onShareNotice,
  onLooksSelect,
  isGenerating = false,
  generatingVariant = "v1",
  onTryOn,
  initialConfigItemId,
  initialClearItemWarning = false,
  appliedSet = null,
}: GenerationPageProps) {
  const { t } = useWidgetConfig();
  const g = t.screens.generation;
  const moreMenu = g.moreMenu;
  const shareMenu = g.shareMenu;
  const clearItemWarning = t.screens.warnings.clearItem;
  const deleteItemContentWarning = t.screens.warnings.deleteItemContent;
  const deleteOutfitWarning = t.screens.warnings.deleteOutfit;
  const shellRef = useRef<HTMLDivElement>(null);

  const [moreSheetOpen, setMoreSheetOpen] = useState(false);
  const [shareSheetOpen, setShareSheetOpen] = useState(false);
  const [outfitAddOpen, setOutfitAddOpen] = useState(false);
  const [accessoryAddOpen, setAccessoryAddOpen] = useState(false);
  const [deleteOutfitOpen, setDeleteOutfitOpen] = useState(false);
  const [shareNoticeLocal, setShareNoticeLocal] = useState<string | null>(null);

  const [selectedWearId, setSelectedWearId] = useState<string | null>(
    initialConfigItemId ? (OUTFIT_TO_WEAR[initialConfigItemId] ?? null) : "shirt",
  );
  const [slideIndex, setSlideIndex] = useState(0);
  const [highlightOutfitId, setHighlightOutfitId] = useState<string | null>(
    initialConfigItemId ?? "3",
  );
  const [hiddenOutfitIds, setHiddenOutfitIds] = useState<Set<string>>(() => new Set());
  const [configItemId, setConfigItemId] = useState<string | null>(initialConfigItemId ?? null);
  const [clearItemOpen, setClearItemOpen] = useState(initialClearItemWarning);
  const [itemConfigs, setItemConfigs] = useState<Record<string, OutfitItemConfigValues>>(() => {
    const init: Record<string, OutfitItemConfigValues> = {};
    for (const item of GENERATION_OUTFIT) {
      init[item.id] = defaultConfigForItem(item.id);
    }
    return init;
  });

  useEffect(() => {
    if (!appliedSet) return;
    setHiddenOutfitIds(new Set(GENERATION_OUTFIT.map((item) => item.id)));
    setSelectedWearId("looks");
    setHighlightOutfitId(null);
    setConfigItemId(null);
  }, [appliedSet]);

  const visibleOutfit = useMemo(
    () => GENERATION_OUTFIT.filter((item) => !hiddenOutfitIds.has(item.id)),
    [hiddenOutfitIds],
  );

  const configItem = configItemId
    ? GENERATION_OUTFIT.find((item) => item.id === configItemId) ?? null
    : null;

  const openItemConfig = (outfitItemId: string) => {
    if (isGenerating) return;
    setHighlightOutfitId(outfitItemId);
    setSelectedWearId(OUTFIT_TO_WEAR[outfitItemId] ?? null);
    setConfigItemId(outfitItemId);
    setItemConfigs((prev) => ({
      ...prev,
      [outfitItemId]: prev[outfitItemId] ?? defaultConfigForItem(outfitItemId),
    }));
  };

  const handleWearSelect = (slot: WearSlot) => {
    if (isGenerating) return;
    setSelectedWearId(slot.id);

    if (slot.id === "add-left") {
      setOutfitAddOpen(true);
      return;
    }
    if (slot.id === "add-right") {
      setAccessoryAddOpen(true);
      return;
    }
    if (slot.kind === "looks") {
      if (onLooksSelect) {
        onLooksSelect();
      } else {
        onAddToWardrobe?.();
      }
      return;
    }
    if (slot.outfitItemId && !hiddenOutfitIds.has(slot.outfitItemId)) {
      openItemConfig(slot.outfitItemId);
      return;
    }
    if (slot.outfitItemId) return;
    onConfigure?.();
  };

  const closeConfig = () => setConfigItemId(null);

  const performClearItem = () => {
    if (!configItemId) return;
    setHiddenOutfitIds((prev) => new Set(prev).add(configItemId));
    if (highlightOutfitId === configItemId) {
      setHighlightOutfitId(null);
      setSelectedWearId(null);
    }
    closeConfig();
  };

  const clearWarningCopy =
    configItemId === "9" ? deleteItemContentWarning : clearItemWarning;

  const handleResetAll = () => {
    if (!configItemId) return;
    setItemConfigs((prev) => ({
      ...prev,
      [configItemId]: defaultConfigForItem(configItemId),
    }));
  };

  const handleClearOutfit = onClearOutfit ?? onShowWarning;

  const openMoreSheet = () => {
    if (isGenerating) return;
    if (onMore) {
      onMore();
      return;
    }
    setMoreSheetOpen(true);
  };

  const openShareSheet = () => {
    if (onShare) {
      onShare();
      return;
    }
    setShareSheetOpen(true);
  };

  const showShareNotice = (message: string) => {
    onShareNotice?.(message);
    setShareNoticeLocal(message);
    window.setTimeout(() => setShareNoticeLocal(null), 2200);
  };

  const lookImageUrl = GENERATION_HERO.generation;
  const lookPageUrl = typeof window !== "undefined" ? window.location.href : "";

  const handleCopyLink = async () => {
    const copied = await copyLookLink(lookPageUrl);
    if (copied) {
      setShareSheetOpen(false);
      showShareNotice(t.screens.common.linkCopied);
    }
  };

  const handleDownloadLook = async () => {
    try {
      await downloadLookImage(lookImageUrl);
      setShareSheetOpen(false);
    } catch {
      // ignore download errors in prototype
    }
  };

  const handleShareVia = async () => {
    const shared = await shareLookVia(shareMenu.title, lookPageUrl);
    if (shared) setShareSheetOpen(false);
  };

  return (
    <div
      ref={shellRef}
      className="relative flex flex-col flex-1 min-h-0 min-w-0"
      style={widgetScreenShellStyle}
    >
      {shareNoticeLocal ? (
        <div
          role="status"
          className="absolute left-1/2 top-14 z-[60] -translate-x-1/2 rounded-full px-4 py-2 text-xs shadow-md"
          style={{
            backgroundColor: "var(--vf-btn-bg)",
            color: "var(--vf-btn-text)",
          }}
        >
          {shareNoticeLocal}
        </div>
      ) : null}
      <WidgetHeader
        onMenu={onOpenMenu}
        onProfile={onOpenMenu}
        onClose={onClose}
        profileLabel={t.start.profile}
        showPinnedShortcuts={false}
      />

      <div className="relative flex flex-col flex-1 min-h-0 overflow-y-auto pb-2">
        {isGenerating ? (
          <div
            className="absolute inset-0 z-[25]"
            style={{ pointerEvents: "auto" }}
            aria-hidden
          />
        ) : null}
        <GenerationHero
          height={516}
          wearRails
          disabled={isGenerating}
          selectedWearId={selectedWearId}
          slideIndex={slideIndex}
          onSlideChange={setSlideIndex}
          onWearSelect={handleWearSelect}
          onClearOutfit={handleClearOutfit}
          onMore={openMoreSheet}
          clearOutfitLabel={g.clearOutfit}
          moreActionsLabel={g.moreActions}
          looksThumbnail={appliedSet?.imageUrl}
          overlay={
            isGenerating ? (
              <GenerationPreloaderOverlay label={t.screens.preloader.label} />
            ) : undefined
          }
        />

        <div className="pt-6 pb-4">
          <GenerationToolbar
            primaryLabel={g.tryOn}
            shareLabel={g.share}
            settingsLabel={g.configureOutfit}
            enhanceLabel={g.changeBackground}
            videoLabel={g.animate}
            disabled={isGenerating}
            onPrimary={onTryOn}
            onShare={openShareSheet}
            onSettings={onConfigure}
            onEnhance={onChangeBackground}
            onVideo={onAnimate}
          />
        </div>

        <OutfitComposition
          items={visibleOutfit}
          highlightedId={highlightOutfitId}
          onItemSelect={openItemConfig}
          skeleton={isGenerating && generatingVariant === "v1"}
        />

        <div className="pt-2">
          <SizeWarningBanner />
        </div>
      </div>
      <Watermark compact />

      <OutfitItemConfigSheet
        open={configItemId !== null}
        item={configItem}
        values={configItemId ? (itemConfigs[configItemId] ?? {}) : {}}
        onChange={(values) => {
          if (!configItemId) return;
          setItemConfigs((prev) => ({ ...prev, [configItemId]: values }));
        }}
        onClose={closeConfig}
        onResetAll={handleResetAll}
        onClearItem={() => setClearItemOpen(true)}
      />

      <GenerationModularListSheet
        open={moreSheetOpen}
        title={moreMenu.title}
        onClose={() => setMoreSheetOpen(false)}
        items={[
          {
            id: "fullscreen",
            label: moreMenu.fullScreen,
            icon: Maximize2,
            onClick: () => {
              setMoreSheetOpen(false);
              openLookFullscreen(shellRef.current?.closest("[data-vf-root]") as HTMLElement | null);
            },
          },
          {
            id: "how-it-works",
            label: moreMenu.howItWorks,
            icon: HelpCircle,
            onClick: () => {
              setMoreSheetOpen(false);
              onShowHowItWorks?.();
            },
          },
          {
            id: "share",
            label: moreMenu.share,
            icon: Share2,
            onClick: () => {
              setMoreSheetOpen(false);
              setShareSheetOpen(true);
            },
          },
          {
            id: "clear",
            label: moreMenu.clearOutfit,
            icon: BrushCleaning,
            onClick: () => {
              setMoreSheetOpen(false);
              handleClearOutfit?.();
            },
          },
          {
            id: "delete",
            label: moreMenu.deleteOutfit,
            icon: Trash2,
            onClick: () => {
              setMoreSheetOpen(false);
              setDeleteOutfitOpen(true);
            },
          },
        ]}
      />

      <GenerationModularListSheet
        open={shareSheetOpen}
        title={shareMenu.title}
        onClose={() => setShareSheetOpen(false)}
        items={[
          {
            id: "download",
            label: shareMenu.download,
            icon: Download,
            onClick: () => void handleDownloadLook(),
          },
          {
            id: "copy",
            label: shareMenu.copyLink,
            icon: Link2,
            onClick: () => void handleCopyLink(),
          },
          {
            id: "via",
            label: shareMenu.shareVia,
            icon: Share2,
            onClick: () => void handleShareVia(),
          },
        ]}
      />

      <AddWearPickerSheet
        open={outfitAddOpen}
        kind="outfit"
        tabs={OUTFIT_ADD_TABS}
        onClose={() => setOutfitAddOpen(false)}
        onSelect={() => {
          onAddFromStore?.();
        }}
      />

      <AddWearPickerSheet
        open={accessoryAddOpen}
        kind="accessory"
        tabs={ACCESSORY_ADD_TABS}
        onClose={() => setAccessoryAddOpen(false)}
        onSelect={() => {
          onAddFromWardrobe?.();
        }}
      />

      <WarningModal
        open={deleteOutfitOpen}
        title={deleteOutfitWarning.title}
        confirmLabel={deleteOutfitWarning.confirm}
        cancelLabel={deleteOutfitWarning.cancel}
        onCancel={() => setDeleteOutfitOpen(false)}
        onConfirm={() => {
          setDeleteOutfitOpen(false);
          onDeleteOutfit?.();
        }}
      />

      <WarningModal
        open={clearItemOpen}
        title={clearWarningCopy.title}
        confirmLabel={clearWarningCopy.confirm}
        cancelLabel={clearWarningCopy.cancel}
        onCancel={() => setClearItemOpen(false)}
        onConfirm={() => {
          setClearItemOpen(false);
          performClearItem();
        }}
      />
    </div>
  );
}
