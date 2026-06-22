/**
 * Экраны VirtuFit widget — New path (`59:2578`).
 */
import type { WidgetScreenId } from "./navigation";
import { figmaNodeIdForScreen } from "./gallery-figma-refs";

export type FigmaSyncStatus = "done" | "partial" | "todo";

export interface WidgetScreenEntry {
  slug: WidgetScreenId;
  name: string;
  nameRu: string;
  phase: "A" | "B" | "C" | "D";
  /** Node-id в Figma New path (если есть). */
  figmaNodeId?: string;
  /** Степень соответствия макету. */
  figmaStatus: FigmaSyncStatus;
}

export const WIDGET_SCREENS: WidgetScreenEntry[] = [
  { slug: "splash", name: "Splash", nameRu: "Заставка", phase: "A", figmaStatus: "done" },
  {
    slug: "splash-slide-2",
    name: "Splash slide 2",
    nameRu: "Заставка — слайд 2",
    phase: "D",
    figmaStatus: "done",
  },
  {
    slug: "splash-slide-3",
    name: "Splash slide 3",
    nameRu: "Заставка — слайд 3",
    phase: "D",
    figmaStatus: "done",
  },
  {
    slug: "start-page",
    name: "Start-page",
    nameRu: "Вариант примерки (pro)",
    phase: "A",
    figmaStatus: "done",
  },
  {
    slug: "start-page-alt",
    name: "Start-page (alt)",
    nameRu: "Вариант примерки (express)",
    phase: "A",
    figmaStatus: "done",
  },
  {
    slug: "user-menu",
    name: "User-menu",
    nameRu: "Меню пользователя",
    phase: "A",
    figmaStatus: "done",
  },
  {
    slug: "user-menu-v2",
    name: "User-menu v2",
    nameRu: "Меню пользователя v2",
    phase: "D",
    figmaStatus: "done",
  },
  {
    slug: "create-profile-empty",
    name: "Create profile Empty",
    nameRu: "Создание профиля — пустой",
    phase: "A",
    figmaStatus: "done",
  },
  {
    slug: "create-profile-filled",
    name: "Create profile Filled",
    nameRu: "Создание профиля — заполненный",
    phase: "A",
    figmaStatus: "done",
  },
  {
    slug: "create-profile-errors",
    name: "Create profile Errors",
    nameRu: "Создание профиля — ошибки",
    phase: "A",
    figmaStatus: "done",
  },
  {
    slug: "create-profile-scroll-params",
    name: "Create profile (scroll params)",
    nameRu: "Профиль — параметры (скролл)",
    phase: "D",
    figmaStatus: "done",
  },
  {
    slug: "upload-photo",
    name: "Upload photo",
    nameRu: "Загрузка фото",
    phase: "A",
    figmaStatus: "done",
  },
  {
    slug: "upload-photo-invalid",
    name: "Upload photo (invalid)",
    nameRu: "Загрузка фото — ошибка",
    phase: "D",
    figmaStatus: "done",
  },
  {
    slug: "info-modal",
    name: "Information modal",
    nameRu: "Модалка с рекомендациями",
    phase: "A",
    figmaStatus: "done",
  },
  {
    slug: "configuring-generation",
    name: "Configuring Generation",
    nameRu: "Настройка генерации",
    phase: "B",
    figmaStatus: "done",
  },
  {
    slug: "generation-page",
    name: "Generation page",
    nameRu: "Страница примерки",
    phase: "B",
    figmaStatus: "done",
  },
  {
    slug: "generation-page-p2",
    name: "Generation page P2",
    nameRu: "Примерка P2",
    phase: "D",
    figmaStatus: "done",
  },
  {
    slug: "generation-page-p2-v2",
    name: "Generation page P2 v2",
    nameRu: "Примерка P2 (вариант 2)",
    phase: "D",
    figmaStatus: "done",
  },
  {
    slug: "generation-item-config",
    name: "Item config sheet",
    nameRu: "Настройки вещи",
    phase: "D",
    figmaStatus: "done",
  },
  {
    slug: "preloader-v1",
    name: "Preloader v1",
    nameRu: "Прелоадер v1",
    phase: "B",
    figmaStatus: "done",
  },
  {
    slug: "preloader-v2",
    name: "Preloader v2",
    nameRu: "Прелоадер v2",
    phase: "B",
    figmaStatus: "done",
  },
  {
    slug: "popup-warning",
    name: "Pop-Up Warning",
    nameRu: "Предупреждение (очистить образ)",
    phase: "B",
    figmaStatus: "done",
  },
  {
    slug: "popup-warning-clear-item",
    name: "Pop-Up clear item",
    nameRu: "Предупреждение (очистить элемент)",
    phase: "D",
    figmaStatus: "done",
  },
  {
    slug: "popup-warning-replace-outfit",
    name: "Pop-Up replace outfit",
    nameRu: "Предупреждение (готовый набор)",
    phase: "D",
    figmaStatus: "done",
  },
  {
    slug: "popup-warning-delete-pose",
    name: "Pop-Up delete pose",
    nameRu: "Предупреждение (удалить позу)",
    phase: "D",
    figmaStatus: "done",
  },
  {
    slug: "popup-warning-delete-item-content",
    name: "Pop-Up delete item content",
    nameRu: "Предупреждение (удалить с содержимым)",
    phase: "D",
    figmaStatus: "done",
  },
  {
    slug: "popup-warning-delete-wardrobe",
    name: "Pop-Up delete wardrobe item",
    nameRu: "Предупреждение (удалить из гардероба)",
    phase: "D",
    figmaStatus: "done",
  },
  {
    slug: "my-images",
    name: "My images",
    nameRu: "Мои примерки",
    phase: "C",
    figmaStatus: "done",
  },
  {
    slug: "my-images-delete",
    name: "My images (delete confirm)",
    nameRu: "Мои примерки — удаление",
    phase: "D",
    figmaStatus: "done",
  },
  {
    slug: "my-wardrobe",
    name: "My wardrobe",
    nameRu: "Мой гардероб",
    phase: "C",
    figmaStatus: "done",
  },
  {
    slug: "my-wardrobe-set-pick",
    name: "Wardrobe set pick",
    nameRu: "Гардероб — выбор набора",
    phase: "D",
    figmaStatus: "done",
  },
  {
    slug: "my-wardrobe-edit",
    name: "Wardrobe edit sheet",
    nameRu: "Редактирование вещи",
    phase: "D",
    figmaStatus: "done",
  },
  {
    slug: "add-from-store",
    name: "Add from store",
    nameRu: "Добавить из магазина",
    phase: "C",
    figmaStatus: "done",
  },
  {
    slug: "add-from-store-filter",
    name: "Add from store (filter)",
    nameRu: "Магазин — фильтр",
    phase: "D",
    figmaStatus: "done",
  },
  {
    slug: "add-from-wardrobe",
    name: "Add from wardrobe (sheet)",
    nameRu: "Гардероб — добавить вещь (sheet)",
    phase: "C",
    figmaStatus: "done",
  },
  {
    slug: "change-background",
    name: "Change background",
    nameRu: "Смена фона",
    phase: "C",
    figmaStatus: "done",
  },
  {
    slug: "change-background-custom",
    name: "Change background (custom upload)",
    nameRu: "Смена фона — загрузка",
    phase: "D",
    figmaStatus: "done",
  },
  {
    slug: "animate-image",
    name: "Animate image",
    nameRu: "Анимация образа",
    phase: "C",
    figmaStatus: "done",
  },
  {
    slug: "animate-image-custom-pose",
    name: "Animate image (custom pose upload)",
    nameRu: "Анимация — загрузка позы",
    phase: "D",
    figmaStatus: "done",
  },
].map((entry) => ({
  ...entry,
  figmaNodeId: figmaNodeIdForScreen(entry.slug),
}));
