import { useCallback, useEffect, useRef, useState } from "react";
import { useWidgetConfig, useWidgetCssVars } from "@/widget/config";
import type { UserMenuItemId } from "@/widget/config";
import { UserMenuNavProvider } from "@/widget/user-menu/UserMenuNavContext";
import { UserMenuPinsProvider } from "@/widget/user-menu/useUserMenuPins";
import type { WidgetRoute } from "@/widget/navigation";
import { SplashScreen } from "./SplashScreen";
import { StartPage } from "./screens/StartPage";
import { StartPageAlt } from "./screens/StartPageAlt";
import { UserMenu } from "./screens/UserMenu";
import { CreateProfile } from "./screens/CreateProfile";
import { UploadPhoto } from "./screens/UploadPhoto";
import { InfoModal } from "./screens/InfoModal";
import { ConfiguringGeneration } from "./screens/ConfiguringGeneration";
import { GenerationPage } from "./screens/GenerationPage";
import { MyWardrobe } from "./screens/MyWardrobe";
import { MyImages } from "./screens/MyImages";
import { AddFromStore } from "./screens/AddFromStore";
import { ChangeBackground } from "./screens/ChangeBackground";
import { AnimateImage } from "./screens/AnimateImage";
import { PreloaderPreview } from "./screens/PreloaderPreview";
import { WarningModal } from "./screens/WarningModal";
import type { TileItem } from "@/components/widget/screens/wardrobe/data";
import {
  GENERATION_LOADER_MS,
} from "./screens/generation/useGenerationPreloader";

export interface WidgetProps {
  initialScreen?: WidgetRoute;
}

/**
 * Корневой компонент виджета. Управляет:
 *  - применением CSS-переменных темы на свой скоуп (без влияния на сайт-хост);
 *  - переключением между экранами;
 *  - data-vf-theme для возможных скоупных стилей.
 */
export default function Widget({ initialScreen }: WidgetProps = {}) {
  const { config, effectiveTheme, t } = useWidgetConfig();
  const cssVars = useWidgetCssVars();

  const [screen, setScreen] = useState<WidgetRoute>(
    initialScreen ?? (config.splash.enabled ? "splash" : "start-page"),
  );
  const [warningOpen, setWarningOpen] = useState(false);
  const [replaceOutfitOpen, setReplaceOutfitOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [wardrobeReturnRoute, setWardrobeReturnRoute] = useState<WidgetRoute>("my-wardrobe");
  const [storeReturnRoute, setStoreReturnRoute] = useState<WidgetRoute>("my-wardrobe");
  const [configReturnRoute, setConfigReturnRoute] = useState<WidgetRoute>("start-page");
  const [pendingWardrobeAdd, setPendingWardrobeAdd] = useState(false);
  const [setPickReturnRoute, setSetPickReturnRoute] =
    useState<WidgetRoute>("generation-page");
  const [appliedWardrobeSet, setAppliedWardrobeSet] = useState<TileItem | null>(null);
  const [generationLoading, setGenerationLoading] = useState(false);
  const [generationLoadingVariant, setGenerationLoadingVariant] = useState<
    "v1" | "v2"
  >("v1");
  const generationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearGenerationTimer = useCallback(() => {
    if (generationTimerRef.current !== null) {
      window.clearTimeout(generationTimerRef.current);
      generationTimerRef.current = null;
    }
  }, []);

  const startGenerationLoading = useCallback(
    (variant: "v1" | "v2" = "v1") => {
      clearGenerationTimer();
      setGenerationLoadingVariant(variant);
      setGenerationLoading(true);
      generationTimerRef.current = window.setTimeout(() => {
        setGenerationLoading(false);
        generationTimerRef.current = null;
      }, GENERATION_LOADER_MS);
    },
    [clearGenerationTimer],
  );

  useEffect(() => () => clearGenerationTimer(), [clearGenerationTimer]);

  const navigate = (to: WidgetRoute) => {
    if (to !== "generation-page" && generationLoading) {
      clearGenerationTimer();
      setGenerationLoading(false);
    }
    console.info("[VirtuFit] navigation", { from: screen, to });
    setScreen(to);
  };

  const openAddFromWardrobe = (returnTo: WidgetRoute = "my-wardrobe") => {
    setWardrobeReturnRoute(returnTo);
    setPendingWardrobeAdd(true);
    navigate("my-wardrobe");
  };

  const openAddFromStore = (returnTo: WidgetRoute = "my-wardrobe") => {
    setStoreReturnRoute(returnTo);
    navigate("add-from-store");
  };

  const handleMenuSelect = (id: UserMenuItemId) => {
    if (id === "stylist") return;
    const routes: Record<Exclude<UserMenuItemId, "stylist">, WidgetRoute> = {
      profile: "create-profile-empty",
      tryons: "my-images",
      wardrobe: "my-wardrobe",
    };
    navigate(routes[id]);
  };

  const runGeneration = () => {
    navigate("generation-page");
    startGenerationLoading("v1");
  };

  const runAnimate = () => {
    navigate("generation-page");
    startGenerationLoading("v2");
  };

  const generationPageProps = {
    onOpenMenu: () => navigate("user-menu"),
    onClose: () => navigate("start-page"),
    onAddToWardrobe: () => navigate("my-wardrobe"),
    onAddFromStore: () => openAddFromStore("generation-page"),
    onAddFromWardrobe: () => openAddFromWardrobe("generation-page"),
    onConfigure: () => {
      setConfigReturnRoute("generation-page");
      navigate("configuring-generation");
    },
    onClearOutfit: () => setWarningOpen(true),
    onShowHowItWorks: () => setInfoOpen(true),
    onDeleteOutfit: () => navigate("start-page"),
    onChangeBackground: () => navigate("change-background"),
    onAnimate: () => navigate("animate-image"),
    onLooksSelect: () => setReplaceOutfitOpen(true),
    isGenerating: generationLoading,
    generatingVariant: generationLoadingVariant,
    onTryOn: () => startGenerationLoading("v1"),
    appliedSet: appliedWardrobeSet,
  };

  const showReplaceOutfitWarning =
    replaceOutfitOpen || screen === "popup-warning-replace-outfit";

  return (
    <div
      data-vf-root
      data-vf-theme={effectiveTheme}
      className="relative flex flex-col overflow-hidden w-full flex-1 min-h-0 sm:flex-none sm:w-[375px] sm:h-[812px] sm:rounded-[var(--vf-radius-widget)] sm:shadow-[var(--vf-shadow-widget)]"
      style={{
        ...cssVars,
        backgroundColor: "var(--vf-surface)",
        color: "var(--vf-text)",
      }}
    >
      <UserMenuPinsProvider>
      <UserMenuNavProvider onSelect={handleMenuSelect}>
      <div className="relative flex flex-1 flex-col min-h-0 min-w-0 w-full">
      {screen === "splash" && (
        <SplashScreen onStart={() => navigate("start-page")} />
      )}
      {screen === "splash-slide-2" && (
        <SplashScreen
          initialSlideIndex={1}
          freezeSlider
          onStart={() => navigate("start-page")}
        />
      )}
      {screen === "splash-slide-3" && (
        <SplashScreen
          initialSlideIndex={2}
          freezeSlider
          onStart={() => navigate("start-page")}
        />
      )}
      {screen === "start-page" && (
        <StartPage
          onOpenUserMenu={() => navigate("user-menu")}
          onClose={() => navigate("start-page")}
          onStart={(v) =>
            navigate(
              v === "pro" ? "create-profile-empty" : "configuring-generation",
            )
          }
        />
      )}
      {screen === "start-page-alt" && (
        <StartPageAlt
          onOpenUserMenu={() => navigate("user-menu")}
          onClose={() => navigate("start-page")}
          onStart={(v) =>
            navigate(
              v === "pro" ? "create-profile-empty" : "configuring-generation",
            )
          }
        />
      )}
      {screen === "user-menu" && (
        <UserMenu
          onClose={() => navigate("start-page")}
          onSelect={handleMenuSelect}
        />
      )}
      {screen === "user-menu-v2" && (
        <UserMenu
          variant="v2"
          onClose={() => navigate("start-page")}
          onSelect={handleMenuSelect}
        />
      )}
      {screen === "create-profile-empty" && (
        <CreateProfile
          variant="empty"
          onOpenMenu={() => navigate("user-menu")}
          onClose={() => navigate("start-page")}
          onContinue={() => navigate("configuring-generation")}
        />
      )}
      {screen === "create-profile-filled" && (
        <CreateProfile
          variant="filled"
          onOpenMenu={() => navigate("user-menu")}
          onClose={() => navigate("start-page")}
          onContinue={() => navigate("configuring-generation")}
        />
      )}
      {screen === "create-profile-errors" && (
        <CreateProfile
          variant="errors"
          onOpenMenu={() => navigate("user-menu")}
          onClose={() => navigate("start-page")}
        />
      )}
      {screen === "create-profile-scroll-params" && (
        <CreateProfile
          variant="filled"
          initialScrollToParams
          onOpenMenu={() => navigate("user-menu")}
          onClose={() => navigate("start-page")}
          onContinue={() => navigate("configuring-generation")}
        />
      )}
      {screen === "upload-photo" && (
        <div className="relative flex flex-col flex-1 min-h-0">
          <UploadPhoto
            onOpenMenu={() => navigate("user-menu")}
            onClose={() => navigate("start-page")}
            onContinue={() => navigate("configuring-generation")}
            onShowInfo={() => setInfoOpen(true)}
          />
          <InfoModal open={infoOpen} onClose={() => setInfoOpen(false)} />
        </div>
      )}
      {screen === "upload-photo-invalid" && (
        <UploadPhoto
          variant="invalid"
          onOpenMenu={() => navigate("user-menu")}
          onClose={() => navigate("start-page")}
          onContinue={() => navigate("configuring-generation")}
        />
      )}
      {screen === "info-modal" && (
        <div className="relative flex flex-col flex-1 min-h-0">
          <UploadPhoto
            onOpenMenu={() => navigate("user-menu")}
            onClose={() => navigate("start-page")}
            onContinue={() => navigate("configuring-generation")}
          />
          <InfoModal onClose={() => navigate("upload-photo")} />
        </div>
      )}
      {screen === "configuring-generation" && (
        <ConfiguringGeneration
          onOpenMenu={() => navigate("user-menu")}
          onClose={() => navigate(configReturnRoute)}
          onGenerate={runGeneration}
        />
      )}
      {screen === "preloader-v1" && (
        <PreloaderPreview
          variant="v1"
          onDone={() => navigate("generation-page")}
        />
      )}
      {screen === "preloader-v2" && (
        <PreloaderPreview
          variant="v2"
          onDone={() => navigate("generation-page")}
        />
      )}
      {screen === "generation-page" && <GenerationPage {...generationPageProps} />}
      {screen === "generation-page-p2" && <GenerationPage {...generationPageProps} />}
      {screen === "generation-page-p2-v2" && <GenerationPage {...generationPageProps} />}
      {screen === "generation-item-config" && (
        <GenerationPage {...generationPageProps} initialConfigItemId="3" />
      )}
      {screen === "popup-warning-clear-item" && (
        <GenerationPage
          {...generationPageProps}
          initialConfigItemId="3"
          initialClearItemWarning
        />
      )}
      {(screen === "popup-warning-replace-outfit") && (
        <GenerationPage {...generationPageProps} />
      )}
      {screen === "popup-warning-delete-item-content" && (
        <GenerationPage
          {...generationPageProps}
          initialConfigItemId="9"
          initialClearItemWarning
        />
      )}
      {screen === "my-images" && (
        <MyImages
          onOpenMenu={() => navigate("user-menu")}
          onClose={() => navigate("start-page")}
          onNewTryOn={() => navigate("configuring-generation")}
          onOpenTryOn={() => navigate("generation-page")}
        />
      )}
      {screen === "my-images-delete" && (
        <MyImages
          initialDeleteWarning
          onOpenMenu={() => navigate("user-menu")}
          onClose={() => navigate("start-page")}
          onNewTryOn={() => navigate("configuring-generation")}
          onOpenTryOn={() => navigate("generation-page")}
        />
      )}
      {(screen === "my-wardrobe" ||
        screen === "my-wardrobe-set-pick" ||
        screen === "my-wardrobe-edit" ||
        screen === "popup-warning-delete-wardrobe" ||
        screen === "add-from-wardrobe") && (
        <MyWardrobe
          mode={screen === "my-wardrobe-set-pick" ? "setPick" : "default"}
          initialAddOpen={screen === "add-from-wardrobe" || pendingWardrobeAdd}
          onAddOpenConsumed={() => setPendingWardrobeAdd(false)}
          initialEditItemId={
            screen === "my-wardrobe-edit" || screen === "popup-warning-delete-wardrobe"
              ? "dress-1"
              : undefined
          }
          initialDeleteOpen={screen === "popup-warning-delete-wardrobe"}
          onOpenMenu={() => navigate("user-menu")}
          onClose={() => {
            setPendingWardrobeAdd(false);
            navigate(
              screen === "add-from-wardrobe" ? wardrobeReturnRoute : "start-page",
            );
          }}
          onCancelPick={() => navigate(setPickReturnRoute)}
          onSelectSet={(item) => {
            setAppliedWardrobeSet(item);
            navigate(setPickReturnRoute);
          }}
          onAddFromStore={() => openAddFromStore("my-wardrobe")}
        />
      )}
      {screen === "add-from-store" && (
        <AddFromStore
          onOpenMenu={() => navigate("user-menu")}
          onClose={() => navigate(storeReturnRoute)}
          onAdd={() => navigate(storeReturnRoute)}
        />
      )}
      {screen === "add-from-store-filter" && (
        <AddFromStore
          initialFilterOpen
          onOpenMenu={() => navigate("user-menu")}
          onClose={() => navigate(storeReturnRoute)}
          onAdd={() => navigate(storeReturnRoute)}
        />
      )}
      {screen === "change-background" && (
        <ChangeBackground
          onOpenMenu={() => navigate("user-menu")}
          onClose={() => navigate("generation-page")}
          onApply={() => navigate("generation-page")}
        />
      )}
      {screen === "change-background-custom" && (
        <ChangeBackground
          initialUploadOpen
          onOpenMenu={() => navigate("user-menu")}
          onClose={() => navigate("generation-page")}
          onApply={() => navigate("generation-page")}
        />
      )}
      {screen === "animate-image" && (
        <AnimateImage
          onOpenMenu={() => navigate("user-menu")}
          onClose={() => navigate("generation-page")}
          onApply={runAnimate}
          onCancel={() => navigate("generation-page")}
        />
      )}
      {screen === "animate-image-custom-pose" && (
        <AnimateImage
          onOpenMenu={() => navigate("user-menu")}
          onClose={() => navigate("generation-page")}
          onApply={runAnimate}
          onCancel={() => navigate("generation-page")}
        />
      )}
      {screen === "popup-warning-delete-pose" && (
        <AnimateImage
          onOpenMenu={() => navigate("user-menu")}
          onClose={() => navigate("generation-page")}
          onApply={runAnimate}
          onCancel={() => navigate("generation-page")}
        />
      )}
      {screen === "popup-warning" && (
        <GenerationPage
          onOpenMenu={() => navigate("user-menu")}
          onClose={() => navigate("start-page")}
        />
      )}

      <WarningModal
        open={(warningOpen || screen === "popup-warning") && !generationLoading}
        onCancel={() => {
          setWarningOpen(false);
          if (screen === "popup-warning") navigate("generation-page");
        }}
        onConfirm={() => {
          setWarningOpen(false);
          navigate("start-page");
        }}
      />

      <WarningModal
        open={showReplaceOutfitWarning}
        title={t.screens.warnings.replaceOutfitWithSet.title}
        confirmLabel={t.screens.warnings.replaceOutfitWithSet.confirm}
        cancelLabel={t.screens.warnings.replaceOutfitWithSet.cancel}
        onCancel={() => {
          setReplaceOutfitOpen(false);
          if (screen === "popup-warning-replace-outfit") navigate("generation-page");
        }}
        onConfirm={() => {
          setReplaceOutfitOpen(false);
          setSetPickReturnRoute("generation-page");
          navigate("my-wardrobe-set-pick");
        }}
      />
      </div>
      </UserMenuNavProvider>
      </UserMenuPinsProvider>
    </div>
  );
}
