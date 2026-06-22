import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useRef, useState, type ChangeEvent, type ReactNode } from "react";
import {
  defaultWidgetConfig,
  useWidgetOverrides,
  WidgetConfigProvider,
  type WidgetColors,
  type WidgetOverrides,
} from "@/widget/config";
import {
  deleteMediaRef,
  deleteSplashSlide,
  isMediaIdbRef,
  saveBackgroundTile,
  savePoseTile,
  saveSplashSlide,
  saveUploadExample,
} from "@/widget/config/media-assets";
import { useSplashSlidePreview } from "@/widget/config/useResolvedSplashImages";
import { useTileImagePreview, useTileMediaPreview } from "@/widget/config/useResolvedTiles";
import type { ConfigTile, ProfilePhotoSlotId } from "@/widget/config/types";
import { TileMedia } from "@/components/widget/ui/TileMedia";
import {
  defaultUploadExamples,
  type UploadExampleGender,
  type UploadExamplesByGender,
  type UploadExamplesForSlot,
} from "@/widget/config/uploadExamples";
import { BrandLogo } from "@/components/widget/BrandLogo";
import Widget from "@/components/widget/Widget";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
});

const COLOR_FIELDS: Array<{
  key: keyof WidgetColors;
  label: string;
  hint: string;
}> = [
  {
    key: "primary",
    label: "Основной цвет",
    hint: "Фирменный акцент: тёмные карточки, шапки модалок, акцентные блоки.",
  },
  {
    key: "onPrimary",
    label: "Текст на основном",
    hint: "Цвет текста и иконок поверх основного цвета.",
  },
  {
    key: "surface",
    label: "Фон виджета",
    hint: "Базовый фон всех экранов.",
  },
  {
    key: "surfaceMuted",
    label: "Приглушённый фон",
    hint: "Фон карточек, полей и второстепенных блоков.",
  },
  {
    key: "text",
    label: "Основной текст",
    hint: "Заголовки, подписи, основной контент.",
  },
  {
    key: "textMuted",
    label: "Вторичный текст",
    hint: "Подсказки, описания, неактивные подписи.",
  },
  {
    key: "border",
    label: "Границы",
    hint: "Рамки полей, разделители, обводки плиток.",
  },
  {
    key: "btnBg",
    label: "Кнопка — фон",
    hint: "Фон активной основной кнопки («Начать», «Продолжить»).",
  },
  {
    key: "btnBgDisabled",
    label: "Кнопка — фон (неактивна)",
    hint: "Фон кнопки, когда действие недоступно.",
  },
  {
    key: "btnText",
    label: "Кнопка — текст",
    hint: "Цвет надписи на основных кнопках.",
  },
  {
    key: "error",
    label: "Ошибка",
    hint: "Рамки невалидных полей и текст ошибок валидации.",
  },
  {
    key: "success",
    label: "Успех",
    hint: "Галочки, позитивные подсказки, «хорошие» примеры фото.",
  },
  {
    key: "cardHero",
    label: "Фон hero-карточек",
    hint: "Подложка под превью модели и большие иллюстрации.",
  },
];

const RADIUS_FIELDS: Array<{
  key: "widget" | "card" | "button" | "tile";
  label: string;
  hint: string;
}> = [
  {
    key: "widget",
    label: "Скругление виджета",
    hint: "Внешние углы контейнера виджета на десктопе.",
  },
  {
    key: "card",
    label: "Скругление карточек",
    hint: "Крупные блоки контента (профиль, формы, hero-карточки).",
  },
  {
    key: "tile",
    label: "Скругление миниатюр",
    hint: "Сетки гардероба, фонов, поз и магазина.",
  },
  {
    key: "button",
    label: "Скругление кнопок",
    hint: "Основные CTA-кнопки и pill-элементы.",
  },
];

const UPLOAD_EXAMPLE_SLOTS: ProfilePhotoSlotId[] = [
  "portrait",
  "fullHeight",
  "back",
  "profile",
];

const UPLOAD_SLOT_LABELS: Record<ProfilePhotoSlotId, string> = {
  portrait: "Анфас",
  fullHeight: "В полный рост",
  back: "Со спины",
  profile: "В профиль",
};

function collectCustomUploadRefs(
  custom: UploadExamplesByGender,
  defaults: UploadExamplesByGender,
): string[] {
  const refs: string[] = [];
  for (const gender of ["female", "male"] as const) {
    for (const slot of UPLOAD_EXAMPLE_SLOTS) {
      for (const kind of ["good", "bad"] as const) {
        for (const ref of custom[gender][slot][kind]) {
          if (!defaults[gender][slot][kind].includes(ref)) refs.push(ref);
        }
      }
    }
  }
  return refs;
}

function SectionIntro({ title, description }: { title: string; description: string }) {
  return (
    <div>
      <h2 className="font-medium">{title}</h2>
      <p className="text-sm text-neutral-600 mt-1">{description}</p>
    </div>
  );
}

function FieldHint({ children }: { children: ReactNode }) {
  return <p className="text-xs text-neutral-500 mt-0.5">{children}</p>;
}

function SplashSlideThumb({ refId }: { refId: string }) {
  const src = useSplashSlidePreview(refId);
  return (
    <div
      className="shrink-0 overflow-hidden rounded-lg border border-neutral-200 bg-neutral-900"
      style={{ width: 72, height: 96 }}
    >
      {src ? (
        <img src={src} alt="" className="w-full h-full object-cover" draggable={false} />
      ) : (
        <div className="w-full h-full bg-neutral-200 animate-pulse" />
      )}
    </div>
  );
}

function TileCatalogThumb({ image, tint }: { image?: string; tint?: string }) {
  const { src, isVideo } = useTileMediaPreview(image);
  return (
    <div
      className="shrink-0 overflow-hidden rounded-lg border border-neutral-200"
      style={{
        width: 72,
        height: 72,
        backgroundColor: tint ?? (src ? "#111" : "#e5e5e5"),
      }}
    >
      {src ? (
        <TileMedia src={src} isVideo={isVideo} className="w-full h-full object-cover" />
      ) : tint ? null : (
        <div className="w-full h-full bg-neutral-200 animate-pulse" />
      )}
    </div>
  );
}

function ExampleThumb({ refId, variant }: { refId: string; variant: "good" | "bad" }) {
  const src = useTileImagePreview(refId);
  return (
    <div
      className="relative shrink-0 overflow-hidden rounded-lg border border-neutral-200"
      style={{ width: 72, height: 96, backgroundColor: "#f5f5f5" }}
    >
      {src ? (
        <img src={src} alt="" className="w-full h-full object-cover object-top" draggable={false} />
      ) : (
        <div className="w-full h-full bg-neutral-200 animate-pulse" />
      )}
      <span
        className="absolute top-1 right-1 flex items-center justify-center rounded-full text-[10px] font-bold text-white"
        style={{
          width: 18,
          height: 18,
          backgroundColor: variant === "good" ? "#22a06b" : "#e63946",
        }}
      >
        {variant === "good" ? "✓" : "×"}
      </span>
    </div>
  );
}

function UploadExamplesEditor({
  examples,
  gender,
  slot,
  uploading,
  onGenderChange,
  onSlotChange,
  onAddGood,
  onAddBad,
  onRemoveGood,
  onRemoveBad,
  onReset,
}: {
  examples: UploadExamplesForSlot;
  gender: UploadExampleGender;
  slot: ProfilePhotoSlotId;
  uploading: boolean;
  onGenderChange: (gender: UploadExampleGender) => void;
  onSlotChange: (slot: ProfilePhotoSlotId) => void;
  onAddGood: (files: FileList) => void;
  onAddBad: (files: FileList) => void;
  onRemoveGood: (index: number) => void;
  onRemoveBad: (index: number) => void;
  onReset: () => void;
}) {
  const goodRef = useRef<HTMLInputElement>(null);
  const badRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {(["female", "male"] as const).map((g) => (
          <button
            key={g}
            type="button"
            onClick={() => onGenderChange(g)}
            className={`text-xs px-3 py-1.5 rounded-full border ${
              gender === g ? "bg-neutral-900 text-white border-neutral-900" : "bg-white border-neutral-300"
            }`}
          >
            {g === "female" ? "Женщина" : "Мужчина"}
          </button>
        ))}
      </div>

      <label className="block text-sm">
        <span className="font-medium">Слот фото</span>
        <select
          className="mt-1 w-full border rounded px-3 py-2 text-sm"
          value={slot}
          onChange={(e) => onSlotChange(e.target.value as ProfilePhotoSlotId)}
        >
          {UPLOAD_EXAMPLE_SLOTS.map((id) => (
            <option key={id} value={id}>
              {UPLOAD_SLOT_LABELS[id]}
            </option>
          ))}
        </select>
      </label>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <p className="text-sm font-medium">Хорошие примеры</p>
          {examples.good.length === 0 ? (
            <p className="text-xs text-neutral-500">Нет примеров</p>
          ) : (
            <ul className="flex flex-wrap gap-2">
              {examples.good.map((refId, index) => (
                <li key={`${refId}-${index}`} className="relative">
                  <ExampleThumb refId={refId} variant="good" />
                  <button
                    type="button"
                    onClick={() => onRemoveGood(index)}
                    className="absolute -top-1 -left-1 w-5 h-5 rounded-full bg-red-600 text-white text-xs leading-none"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          )}
          <button
            type="button"
            disabled={uploading}
            onClick={() => goodRef.current?.click()}
            className="text-xs px-3 py-1.5 rounded-full bg-neutral-900 text-white disabled:opacity-60"
          >
            {uploading ? "Загрузка…" : "Добавить хороший"}
          </button>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">Плохие примеры</p>
          {examples.bad.length === 0 ? (
            <p className="text-xs text-neutral-500">Нет примеров</p>
          ) : (
            <ul className="flex flex-wrap gap-2">
              {examples.bad.map((refId, index) => (
                <li key={`${refId}-${index}`} className="relative">
                  <ExampleThumb refId={refId} variant="bad" />
                  <button
                    type="button"
                    onClick={() => onRemoveBad(index)}
                    className="absolute -top-1 -left-1 w-5 h-5 rounded-full bg-red-600 text-white text-xs leading-none"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          )}
          <button
            type="button"
            disabled={uploading}
            onClick={() => badRef.current?.click()}
            className="text-xs px-3 py-1.5 rounded-full bg-neutral-900 text-white disabled:opacity-60"
          >
            {uploading ? "Загрузка…" : "Добавить плохой"}
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={onReset}
        className="text-xs px-3 py-1.5 rounded-full bg-white border border-neutral-300"
      >
        Вернуть примеры по умолчанию
      </button>

      <input
        ref={goodRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.length) onAddGood(e.target.files);
          e.target.value = "";
        }}
      />
      <input
        ref={badRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.length) onAddBad(e.target.files);
          e.target.value = "";
        }}
      />
    </div>
  );
}

function TileCatalogEditor({
  tiles,
  uploading,
  addLabel,
  emptyHint,
  fileAccept = "image/*",
  onAdd,
  onLabelChange,
  onRemove,
  onResetDefaults,
}: {
  tiles: ConfigTile[];
  uploading: boolean;
  addLabel: string;
  emptyHint: string;
  fileAccept?: string;
  onAdd: (files: FileList) => void;
  onLabelChange: (index: number, label: string) => void;
  onRemove: (index: number) => void;
  onResetDefaults: () => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-3">
      {tiles.length === 0 ? (
        <p className="text-sm text-neutral-500">{emptyHint}</p>
      ) : (
        <ul className="space-y-3">
          {tiles.map((tile, index) => (
            <li
              key={tile.id}
              className="flex gap-3 items-start p-3 rounded-lg border border-neutral-200 bg-neutral-50"
            >
              <TileCatalogThumb image={tile.image} tint={tile.tint} />
              <div className="flex-1 min-w-0 space-y-2">
                <input
                  className="w-full border rounded px-2 py-1.5 text-sm"
                  value={tile.label}
                  onChange={(e) => onLabelChange(index, e.target.value)}
                />
                <p className="text-xs text-neutral-500 truncate">{tile.id}</p>
              </div>
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="shrink-0 text-xs text-red-600"
              >
                Удалить
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={uploading}
          onClick={() => fileRef.current?.click()}
          className="text-xs px-3 py-1.5 rounded-full bg-neutral-900 text-white disabled:opacity-60"
        >
          {uploading ? "Загрузка…" : addLabel}
        </button>
        <button
          type="button"
          onClick={onResetDefaults}
          className="text-xs px-3 py-1.5 rounded-full bg-white border border-neutral-300"
        >
          Вернуть по умолчанию
        </button>
      </div>
      <input
        ref={fileRef}
        type="file"
        accept={fileAccept}
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.length) onAdd(e.target.files);
          e.target.value = "";
        }}
      />
    </div>
  );
}

function AdminPage() {
  const [overrides, setOverrides, resetOverrides] = useWidgetOverrides();
  const [uploadingSlides, setUploadingSlides] = useState(false);
  const [uploadingBackgrounds, setUploadingBackgrounds] = useState(false);
  const [uploadingPoses, setUploadingPoses] = useState(false);
  const [uploadingExamples, setUploadingExamples] = useState(false);
  const [uploadExamplesGender, setUploadExamplesGender] =
    useState<UploadExampleGender>("female");
  const [uploadExamplesSlot, setUploadExamplesSlot] =
    useState<ProfilePhotoSlotId>("portrait");

  const light = {
    ...defaultWidgetConfig.theme.light,
    ...overrides.theme?.light,
  } as WidgetColors;

  const fonts = {
    ...defaultWidgetConfig.theme.fonts,
    ...overrides.theme?.fonts,
  };

  const brand = {
    ...defaultWidgetConfig.brand,
    ...overrides.brand,
  };

  const watermark = {
    ...defaultWidgetConfig.watermark,
    ...overrides.watermark,
  };

  const splash = {
    ...defaultWidgetConfig.splash,
    ...overrides.splash,
  };

  const splashRu = useMemo(
    () => ({
      ...defaultWidgetConfig.i18n.ru.splash,
      ...overrides.i18n?.ru?.splash,
    }),
    [overrides.i18n?.ru?.splash],
  );

  const splashImages = splash.images;

  const backgroundTiles =
    overrides.teleport?.backgrounds ?? defaultWidgetConfig.teleport.backgrounds;
  const poseTiles = overrides.animateLook?.poses ?? defaultWidgetConfig.animateLook.poses;
  const uploadExamples =
    overrides.createProfile?.uploadExamples ?? defaultWidgetConfig.createProfile.uploadExamples;

  const slideFileRef = useRef<HTMLInputElement>(null);

  const radius = {
    ...defaultWidgetConfig.theme.radius,
    ...overrides.theme?.radius,
  };

  const patch = (updater: (prev: WidgetOverrides) => WidgetOverrides) => {
    setOverrides((prev) => updater(prev));
  };

  const setColor = (key: keyof WidgetColors, value: string) => {
    patch((prev) => ({
      ...prev,
      theme: {
        ...prev.theme,
        light: { ...defaultWidgetConfig.theme.light, ...prev.theme?.light, [key]: value },
      },
    }));
  };

  const setSplashRuText = (key: "title" | "subtitle" | "cta", value: string) => {
    patch((prev) => ({
      ...prev,
      i18n: {
        ...prev.i18n,
        ru: {
          ...prev.i18n?.ru,
          splash: {
            ...defaultWidgetConfig.i18n.ru.splash,
            ...prev.i18n?.ru?.splash,
            [key]: value,
          },
        },
      },
    }));
  };

  const setSplashImages = (images: string[]) => {
    patch((prev) => ({
      ...prev,
      splash: { ...defaultWidgetConfig.splash, ...prev.splash, images },
    }));
  };

  const setBackgroundTiles = (backgrounds: ConfigTile[]) => {
    patch((prev) => ({
      ...prev,
      teleport: { ...defaultWidgetConfig.teleport, ...prev.teleport, backgrounds },
    }));
  };

  const setPoseTiles = (poses: ConfigTile[]) => {
    patch((prev) => ({
      ...prev,
      animateLook: { ...defaultWidgetConfig.animateLook, ...prev.animateLook, poses },
    }));
  };

  const setUploadExamples = (next: UploadExamplesByGender) => {
    patch((prev) => ({
      ...prev,
      createProfile: {
        ...defaultWidgetConfig.createProfile,
        ...prev.createProfile,
        uploadExamples: next,
      },
    }));
  };

  const patchUploadSlot = (
    gender: UploadExampleGender,
    slot: ProfilePhotoSlotId,
    patchSlot: (current: UploadExamplesForSlot) => UploadExamplesForSlot,
  ) => {
    setUploadExamples({
      ...uploadExamples,
      [gender]: {
        ...uploadExamples[gender],
        [slot]: patchSlot(uploadExamples[gender][slot]),
      },
    });
  };

  const removeBackgroundTile = async (index: number) => {
    const tile = backgroundTiles[index];
    if (tile?.image) await deleteMediaRef(tile.image);
    setBackgroundTiles(backgroundTiles.filter((_, i) => i !== index));
  };

  const removePoseTile = async (index: number) => {
    const tile = poseTiles[index];
    if (tile?.image) await deleteMediaRef(tile.image);
    setPoseTiles(poseTiles.filter((_, i) => i !== index));
  };

  const onBackgroundFiles = async (files: FileList) => {
    setUploadingBackgrounds(true);
    try {
      const added: ConfigTile[] = [];
      for (const file of Array.from(files)) {
        const image = await saveBackgroundTile(file);
        added.push({
          id: `bg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          label: file.name.replace(/\.[^.]+$/, "") || "новый фон",
          image,
        });
      }
      setBackgroundTiles([...backgroundTiles, ...added]);
    } finally {
      setUploadingBackgrounds(false);
    }
  };

  const onPoseFiles = async (files: FileList) => {
    setUploadingPoses(true);
    try {
      const added: ConfigTile[] = [];
      for (const file of Array.from(files)) {
        const image = await savePoseTile(file);
        added.push({
          id: `pose-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          label: file.name.replace(/\.[^.]+$/, "") || "новая поза",
          image,
        });
      }
      setPoseTiles([...poseTiles, ...added]);
    } finally {
      setUploadingPoses(false);
    }
  };

  const resetBackgroundTiles = async () => {
    for (const tile of backgroundTiles) {
      if (tile.image && !defaultWidgetConfig.teleport.backgrounds.some((d) => d.image === tile.image)) {
        await deleteMediaRef(tile.image);
      }
    }
    patch((prev) => {
      const next = { ...prev };
      delete next.teleport;
      return next;
    });
  };

  const resetPoseTiles = async () => {
    for (const tile of poseTiles) {
      if (tile.image && !defaultWidgetConfig.animateLook.poses.some((d) => d.image === tile.image)) {
        await deleteMediaRef(tile.image);
      }
    }
    patch((prev) => {
      const next = { ...prev };
      delete next.animateLook;
      return next;
    });
  };

  const resetUploadExamples = async () => {
    const custom = overrides.createProfile?.uploadExamples;
    if (custom) {
      for (const ref of collectCustomUploadRefs(custom, defaultUploadExamples)) {
        await deleteMediaRef(ref);
      }
    }
    patch((prev) => {
      const next = { ...prev };
      if (next.createProfile) {
        const cp = { ...next.createProfile };
        delete cp.uploadExamples;
        next.createProfile = Object.keys(cp).length ? cp : undefined;
      }
      return next;
    });
  };

  const onUploadExampleFiles = async (
    kind: "good" | "bad",
    files: FileList,
  ) => {
    setUploadingExamples(true);
    try {
      const refs: string[] = [];
      for (const file of Array.from(files)) {
        refs.push(await saveUploadExample(file));
      }
      patchUploadSlot(uploadExamplesGender, uploadExamplesSlot, (current) => ({
        ...current,
        [kind]: [...current[kind], ...refs],
      }));
    } finally {
      setUploadingExamples(false);
    }
  };

  const removeUploadExample = async (
    kind: "good" | "bad",
    index: number,
  ) => {
    const list = uploadExamples[uploadExamplesGender][uploadExamplesSlot][kind];
    const ref = list[index];
    if (ref && isMediaIdbRef(ref)) await deleteMediaRef(ref);
    patchUploadSlot(uploadExamplesGender, uploadExamplesSlot, (current) => ({
      ...current,
      [kind]: current[kind].filter((_, i) => i !== index),
    }));
  };

  const removeSplashImage = async (index: number) => {
    const ref = splashImages[index];
    if (ref) await deleteSplashSlide(ref);
    setSplashImages(splashImages.filter((_, i) => i !== index));
  };

  const onSlideFiles = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    setUploadingSlides(true);
    try {
      const refs: string[] = [];
      for (const file of Array.from(files)) {
        refs.push(await saveSplashSlide(file));
      }
      const hasCustomImages = Boolean(overrides.splash?.images);
      setSplashImages(hasCustomImages ? [...splashImages, ...refs] : refs);
    } finally {
      setUploadingSlides(false);
      e.target.value = "";
    }
  };

  const resetAll = async () => {
    for (const ref of splashImages) {
      await deleteSplashSlide(ref);
    }
    for (const tile of backgroundTiles) {
      if (tile.image) await deleteMediaRef(tile.image);
    }
    for (const tile of poseTiles) {
      if (tile.image) await deleteMediaRef(tile.image);
    }
    const customExamples = overrides.createProfile?.uploadExamples;
    if (customExamples) {
      for (const ref of collectCustomUploadRefs(customExamples, defaultUploadExamples)) {
        await deleteMediaRef(ref);
      }
    }
    resetOverrides();
  };

  const previewConfig = useMemo(() => overrides, [overrides]);

  return (
    <WidgetConfigProvider config={previewConfig}>
      <div className="min-h-[100dvh] bg-neutral-100">
        <div className="max-w-7xl mx-auto p-4 sm:p-8 grid gap-8 xl:grid-cols-[1fr_375px]">
          <div className="space-y-6">
            <header className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h1 className="text-xl font-semibold">VirtuFit</h1>
                <p className="text-sm text-neutral-600 mt-1">
                  Настройки стилей виджета. Сохраняются в браузере и применяются к виджету и
                  галерее экранов.
                </p>
              </div>
              <div className="flex gap-2">
                <Link
                  to="/gallery"
                  className="text-xs px-3 py-1.5 rounded-full bg-white shadow border"
                >
                  Экраны
                </Link>
                <Link to="/" className="text-xs px-3 py-1.5 rounded-full bg-white shadow border">
                  Виджет
                </Link>
                <button
                  type="button"
                  onClick={() => void resetAll()}
                  className="text-xs px-3 py-1.5 rounded-full bg-white shadow border text-red-600"
                >
                  Сбросить
                </button>
              </div>
            </header>

            <section className="bg-white rounded-xl shadow p-5 space-y-4">
              <SectionIntro
                title="Цвета (светлая тема)"
                description="Палитра виджета. Меняйте цвет — справа сразу видно результат на экране «Вариант примерки»."
              />
              <div className="grid sm:grid-cols-2 gap-4">
                {COLOR_FIELDS.map(({ key, label, hint }) => (
                  <label key={key} className="flex items-start gap-3 text-sm">
                    <input
                      type="color"
                      value={light[key]}
                      onChange={(e) => setColor(key, e.target.value)}
                      className="w-10 h-10 rounded border cursor-pointer shrink-0 mt-0.5"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="font-medium block">{label}</span>
                      <FieldHint>{hint}</FieldHint>
                      <code className="text-xs text-neutral-400 mt-1 block">{light[key]}</code>
                    </span>
                  </label>
                ))}
              </div>
            </section>

            <section className="bg-white rounded-xl shadow p-5 space-y-4">
              <SectionIntro
                title="Шрифты и скругления"
                description="Типографика и форма элементов. Указывайте CSS font-family (как в макете)."
              />
              <label className="block text-sm">
                <span className="font-medium">Шрифт заголовков</span>
                <FieldHint>Крупные заголовки, uppercase-надписи, названия разделов.</FieldHint>
                <input
                  className="mt-1 w-full border rounded px-3 py-2 text-sm"
                  value={fonts.heading}
                  onChange={(e) =>
                    patch((prev) => ({
                      ...prev,
                      theme: { ...prev.theme, fonts: { ...fonts, heading: e.target.value } },
                    }))
                  }
                />
              </label>
              <label className="block text-sm">
                <span className="font-medium">Шрифт основного текста</span>
                <FieldHint>Описания, подписи полей, кнопки, вторичный контент.</FieldHint>
                <input
                  className="mt-1 w-full border rounded px-3 py-2 text-sm"
                  value={fonts.body}
                  onChange={(e) =>
                    patch((prev) => ({
                      ...prev,
                      theme: { ...prev.theme, fonts: { ...fonts, body: e.target.value } },
                    }))
                  }
                />
              </label>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {RADIUS_FIELDS.map(({ key, label, hint }) => (
                  <label key={key} className="block text-sm">
                    <span className="font-medium">{label}</span>
                    <FieldHint>{hint}</FieldHint>
                    <input
                      className="mt-1 w-full border rounded px-3 py-2 text-sm"
                      value={radius[key]}
                      onChange={(e) =>
                        patch((prev) => ({
                          ...prev,
                          theme: {
                            ...prev.theme,
                            radius: { ...radius, [key]: e.target.value },
                          },
                        }))
                      }
                    />
                  </label>
                ))}
              </div>
            </section>

            <section className="bg-white rounded-xl shadow p-5 space-y-4">
              <SectionIntro
                title="Логотип"
                description="Брендинг сайта-хоста: логотип в шапке и на splash-экране."
              />
              <label className="block text-sm">
                <span className="font-medium">Текст логотипа (alt)</span>
                <FieldHint>
                  Подпись для доступности и запасной текст, если картинка логотипа не задана.
                </FieldHint>
                <input
                  className="mt-1 w-full border rounded px-3 py-2 text-sm"
                  value={brand.logoAlt}
                  onChange={(e) =>
                    patch((prev) => ({
                      ...prev,
                      brand: { ...brand, logoAlt: e.target.value },
                    }))
                  }
                />
              </label>
              <label className="block text-sm">
                <span className="font-medium">URL логотипа (SVG / PNG)</span>
                <FieldHint>Ссылка на файл логотипа. Пусто — показывается текст alt.</FieldHint>
                <input
                  className="mt-1 w-full border rounded px-3 py-2 text-sm"
                  value={brand.logoUrl ?? ""}
                  onChange={(e) =>
                    patch((prev) => ({
                      ...prev,
                      brand: { ...brand, logoUrl: e.target.value || undefined },
                    }))
                  }
                />
              </label>
              <label className="flex items-start gap-2 text-sm">
                <input
                  type="checkbox"
                  className="mt-1"
                  checked={brand.logoAnimationEnabled}
                  onChange={(e) =>
                    patch((prev) => ({
                      ...prev,
                      brand: { ...brand, logoAnimationEnabled: e.target.checked },
                    }))
                  }
                />
                <span>
                  <span className="font-medium block">Анимация логотипа</span>
                  <FieldHint>Включить анимацию появления логотипа в шапке.</FieldHint>
                </span>
              </label>
              <div>
                <p className="text-xs text-neutral-500 mb-2">Предпросмотр логотипа на тёмном фоне</p>
                <div className="flex items-center gap-3 p-3 bg-neutral-900 rounded-lg">
                  <BrandLogo animationOverride={brand.logoAnimation} enabledOverride />
                </div>
              </div>
            </section>

            <section className="bg-white rounded-xl shadow p-5 space-y-4">
              <SectionIntro
                title="Водяной знак"
                description="Подпись внизу всех экранов, модалок и bottom sheet'ов виджета."
              />
              <label className="block text-sm">
                <span className="font-medium">Текст</span>
                <FieldHint>Например «by Mall'ER» или «Разработано Компанией».</FieldHint>
                <input
                  className="mt-1 w-full border rounded px-3 py-2 text-sm"
                  value={watermark.text}
                  onChange={(e) =>
                    patch((prev) => ({
                      ...prev,
                      watermark: { ...watermark, text: e.target.value },
                    }))
                  }
                />
              </label>
              <label className="block text-sm">
                <span className="font-medium">Ссылка</span>
                <FieldHint>URL при клике. Оставьте пустым — текст без ссылки.</FieldHint>
                <input
                  className="mt-1 w-full border rounded px-3 py-2 text-sm"
                  value={watermark.href}
                  onChange={(e) =>
                    patch((prev) => ({
                      ...prev,
                      watermark: { ...watermark, href: e.target.value },
                    }))
                  }
                />
              </label>
              <label className="flex items-start gap-2 text-sm">
                <input
                  type="checkbox"
                  className="mt-1"
                  checked={watermark.openInNewTab}
                  onChange={(e) =>
                    patch((prev) => ({
                      ...prev,
                      watermark: { ...watermark, openInNewTab: e.target.checked },
                    }))
                  }
                />
                <span>
                  <span className="font-medium block">Открывать ссылку в новой вкладке</span>
                </span>
              </label>
              <label className="flex items-start gap-2 text-sm">
                <input
                  type="checkbox"
                  className="mt-1"
                  checked={watermark.removableOnPlan}
                  onChange={(e) => {
                    const removableOnPlan = e.target.checked;
                    patch((prev) => ({
                      ...prev,
                      watermark: {
                        ...watermark,
                        removableOnPlan,
                        enabled: removableOnPlan ? watermark.enabled : true,
                      },
                    }));
                  }}
                />
                <span>
                  <span className="font-medium block">Тариф позволяет скрыть</span>
                  <FieldHint>
                    Симуляция тарифа Pro+: при выключении клиент сможет убрать водяной знак.
                    На базовом тарифе знак обязателен.
                  </FieldHint>
                </span>
              </label>
              <label className="flex items-start gap-2 text-sm">
                <input
                  type="checkbox"
                  className="mt-1"
                  checked={watermark.enabled}
                  disabled={!watermark.removableOnPlan}
                  onChange={(e) =>
                    patch((prev) => ({
                      ...prev,
                      watermark: { ...watermark, enabled: e.target.checked },
                    }))
                  }
                />
                <span>
                  <span className="font-medium block">Показывать водяной знак</span>
                  {watermark.removableOnPlan ? (
                    <FieldHint>Снимите галочку, чтобы скрыть подпись на всех экранах.</FieldHint>
                  ) : (
                    <FieldHint>
                      Скрытие недоступно на текущем тарифе. Подключите Pro+ или включите опцию
                      выше для теста.
                    </FieldHint>
                  )}
                </span>
              </label>
              <div className="rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2">
                <p className="text-xs text-neutral-600">
                  Предпросмотр:{" "}
                  <span className="font-medium uppercase tracking-wide">{watermark.text}</span>
                </p>
              </div>
            </section>

            <section className="bg-white rounded-xl shadow p-5 space-y-4">
              <SectionIntro
                title="Заставка"
                description="Первый экран при открытии виджета — слайдер, заголовок и кнопка «Продолжить»."
              />
              <label className="flex items-start gap-2 text-sm">
                <input
                  type="checkbox"
                  className="mt-1"
                  checked={splash.enabled}
                  onChange={(e) =>
                    patch((prev) => ({
                      ...prev,
                      splash: { ...splash, enabled: e.target.checked },
                    }))
                  }
                />
                <span>
                  <span className="font-medium block">Показывать заставку</span>
                  <FieldHint>
                    Если выключено — виджет сразу открывается на «Вариант примерки».
                  </FieldHint>
                </span>
              </label>

              <div className="space-y-3 pt-1 border-t border-neutral-100">
                <p className="text-sm font-medium">Тексты (RU)</p>
                <label className="block text-sm">
                  <span className="font-medium">Заголовок</span>
                  <FieldHint>Крупный uppercase-заголовок под слайдером.</FieldHint>
                  <input
                    className="mt-1 w-full border rounded px-3 py-2 text-sm"
                    value={splashRu.title}
                    onChange={(e) => setSplashRuText("title", e.target.value)}
                  />
                </label>
                <label className="block text-sm">
                  <span className="font-medium">Подзаголовок</span>
                  <FieldHint>Описание под заголовком.</FieldHint>
                  <textarea
                    className="mt-1 w-full border rounded px-3 py-2 text-sm min-h-[72px] resize-y"
                    value={splashRu.subtitle}
                    onChange={(e) => setSplashRuText("subtitle", e.target.value)}
                  />
                </label>
                <label className="block text-sm">
                  <span className="font-medium">Текст кнопки</span>
                  <FieldHint>Основная CTA-кнопка внизу экрана.</FieldHint>
                  <input
                    className="mt-1 w-full border rounded px-3 py-2 text-sm"
                    value={splashRu.cta}
                    onChange={(e) => setSplashRuText("cta", e.target.value)}
                  />
                </label>
              </div>

              <div className="space-y-3 pt-1 border-t border-neutral-100">
                <p className="text-sm font-medium">Слайды hero-карусели</p>
                <FieldHint>
                  Загрузите фото с компьютера — они сохраняются в браузере (IndexedDB) и
                  подхватываются виджетом и галереей.
                </FieldHint>
                <ul className="space-y-3">
                  {splashImages.map((refId, index) => (
                    <li
                      key={refId}
                      className="flex gap-3 items-center p-3 rounded-lg border border-neutral-200 bg-neutral-50"
                    >
                      <SplashSlideThumb refId={refId} />
                      <span className="flex-1 text-sm text-neutral-700">Слайд {index + 1}</span>
                      <button
                        type="button"
                        onClick={() => void removeSplashImage(index)}
                        disabled={splashImages.length <= 1}
                        className="shrink-0 text-xs text-red-600 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        Удалить
                      </button>
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  disabled={uploadingSlides}
                  onClick={() => slideFileRef.current?.click()}
                  className="text-xs px-3 py-1.5 rounded-full bg-neutral-900 text-white disabled:opacity-60"
                >
                  {uploadingSlides ? "Загрузка…" : "Добавить фото"}
                </button>
                <input
                  ref={slideFileRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => void onSlideFiles(e)}
                />
              </div>

              <label className="block text-sm pt-1 border-t border-neutral-100">
                <span className="font-medium">Автопрокрутка слайдов, мс</span>
                <FieldHint>
                  Интервал смены слайдов на заставке. 0 — только ручное переключение.
                </FieldHint>
                <input
                  type="number"
                  min={0}
                  step={500}
                  className="mt-1 w-full border rounded px-3 py-2 text-sm"
                  value={splash.autoplayMs}
                  onChange={(e) =>
                    patch((prev) => ({
                      ...prev,
                      splash: { ...splash, autoplayMs: Number(e.target.value) },
                    }))
                  }
                />
              </label>
            </section>

            <section className="bg-white rounded-xl shadow p-5 space-y-4">
              <SectionIntro
                title="Телепорт — фоны"
                description="Каталог фонов на экране «Сменить фон». Загрузите превью (изображение или видео) — файлы сохраняются в браузере."
              />
              <TileCatalogEditor
                tiles={backgroundTiles}
                uploading={uploadingBackgrounds}
                addLabel="Добавить фон"
                emptyHint="Список фонов пуст. Добавьте файлы или верните набор по умолчанию."
                onAdd={(files) => void onBackgroundFiles(files)}
                onLabelChange={(index, label) => {
                  const next = backgroundTiles.map((tile, i) =>
                    i === index ? { ...tile, label } : tile,
                  );
                  setBackgroundTiles(next);
                }}
                onRemove={(index) => void removeBackgroundTile(index)}
                onResetDefaults={() => void resetBackgroundTiles()}
              />
            </section>

            <section className="bg-white rounded-xl shadow p-5 space-y-4">
              <SectionIntro
                title="Оживить образ — позы и анимации"
                description="Каталог превью на экране «Оживить образ». Добавляйте картинки или видео-превью анимаций."
              />
              <TileCatalogEditor
                tiles={poseTiles}
                uploading={uploadingPoses}
                addLabel="Добавить позу / анимацию"
                emptyHint="Список поз пуст. Добавьте файлы или верните набор по умолчанию."
                fileAccept="image/*,video/*"
                onAdd={(files) => void onPoseFiles(files)}
                onLabelChange={(index, label) => {
                  const next = poseTiles.map((tile, i) =>
                    i === index ? { ...tile, label } : tile,
                  );
                  setPoseTiles(next);
                }}
                onRemove={(index) => void removePoseTile(index)}
                onResetDefaults={() => void resetPoseTiles()}
              />
            </section>

            <section className="bg-white rounded-xl shadow p-5 space-y-4">
              <SectionIntro
                title="Профиль — примеры фото в диалоге загрузки"
                description="Сетка «хорошо / плохо» в bottom-sheet «Загрузить фото анфас» и других слотов. Файлы сохраняются в браузере."
              />
              <UploadExamplesEditor
                examples={uploadExamples[uploadExamplesGender][uploadExamplesSlot]}
                gender={uploadExamplesGender}
                slot={uploadExamplesSlot}
                uploading={uploadingExamples}
                onGenderChange={setUploadExamplesGender}
                onSlotChange={setUploadExamplesSlot}
                onAddGood={(files) => void onUploadExampleFiles("good", files)}
                onAddBad={(files) => void onUploadExampleFiles("bad", files)}
                onRemoveGood={(index) => void removeUploadExample("good", index)}
                onRemoveBad={(index) => void removeUploadExample("bad", index)}
                onReset={() => void resetUploadExamples()}
              />
            </section>
          </div>

          <div className="flex flex-col gap-6 xl:sticky xl:top-8 xl:self-start">
            <div className="flex flex-col gap-2">
              <p className="text-xs text-neutral-500 text-center xl:text-left">
                Предпросмотр заставки — изменения применяются сразу
              </p>
              <div className="flex justify-center xl:justify-start">
                <Widget key={`splash-${splashImages.length}-${splashRu.title}`} initialScreen="splash" />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-xs text-neutral-500 text-center xl:text-left">
                Телепорт — каталог фонов
              </p>
              <div className="flex justify-center xl:justify-start">
                <Widget
                  key={`bg-${backgroundTiles.length}-${backgroundTiles[0]?.id ?? ""}`}
                  initialScreen="change-background"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-xs text-neutral-500 text-center xl:text-left">
                Оживить образ — каталог поз
              </p>
              <div className="flex justify-center xl:justify-start">
                <Widget
                  key={`pose-${poseTiles.length}-${poseTiles[0]?.id ?? ""}`}
                  initialScreen="animate-image"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </WidgetConfigProvider>
  );
}
