import type { WidgetScreenId } from "./navigation";
import { FIGMA_NEW_PATH } from "@/figma/new-path-registry";

const SLUG_TO_FIGMA_KEY: Partial<
  Record<WidgetScreenId, keyof typeof FIGMA_NEW_PATH.screens>
> = {
  "start-page": "startPage",
  "start-page-alt": "startPageAlt",
  "user-menu": "userMenu",
  "user-menu-v2": "userMenuV2",
  "create-profile-empty": "createProfileEmpty",
  "create-profile-filled": "createProfileFilled",
  "create-profile-errors": "createProfileErrors",
  "create-profile-scroll-params": "createProfileScrollParams",
  "upload-photo": "uploadPhoto",
  "upload-photo-invalid": "uploadPhotoInvalid",
  "info-modal": "infoModal",
  "configuring-generation": "configuringGeneration",
  "generation-page": "generationPage",
  "generation-page-p2": "generationPageP2",
  "generation-page-p2-v2": "generationPageP2V2",
  "generation-item-config": "generationItemConfig",
  "preloader-v1": "preloaderV1",
  "preloader-v2": "preloaderV2",
  "popup-warning": "popupWarning",
  "popup-warning-clear-item": "popupWarningClearItem",
  "popup-warning-replace-outfit": "popupWarningReplaceOutfit",
  "popup-warning-delete-pose": "popupWarningDeletePose",
  "popup-warning-delete-item-content": "popupWarningDeleteItemContent",
  "popup-warning-delete-wardrobe": "popupWarningDeleteWardrobe",
  "my-images": "myImages",
  "my-images-delete": "myImages",
  "my-wardrobe": "myWardrobe",
  "my-wardrobe-set-pick": "wardrobeSetPick",
  "my-wardrobe-edit": "wardrobeEdit",
  "add-from-store": "addFromStore",
  "add-from-store-filter": "storeFilter",
  "add-from-wardrobe": "addFromWardrobe",
  "change-background": "changeBackground",
  "change-background-custom": "addCustomBackground",
  "animate-image": "animateImage",
  "animate-image-custom-pose": "addCustomPose",
};

export function figmaNodeIdForScreen(slug: WidgetScreenId): string | undefined {
  const key = SLUG_TO_FIGMA_KEY[slug];
  return key ? FIGMA_NEW_PATH.screens[key] : undefined;
}

export function figmaDesignUrl(nodeId: string): string {
  const normalized = nodeId.replace(":", "-");
  return `https://www.figma.com/design/${FIGMA_NEW_PATH.fileKeyCloud}/Try-on-widget--Copy-?node-id=${normalized}`;
}
