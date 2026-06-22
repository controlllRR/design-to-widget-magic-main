import { Plus, UserCircle2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useWidgetConfig } from "@/widget/config";
import type {
  ProfileFieldConfig,
  ProfileFieldId,
  ProfileParamsTab,
  ProfilePhotoSlotId,
  WidgetConfig,
} from "@/widget/config";
import type {
  BodyTypeId,
  BreastSizeId,
  FigureShapeId,
  HipsSizeId,
  HipsShapeId,
  BellyShapeId,
  NeckLengthId,
} from "@/widget/config";
import {
  AgeCard,
  FieldRow,
  HeightCard,
  LegLengthCard,
  paramCardStyle,
  PhotoSlot,
  PhotoUploadDialog,
  ProfileHelpSheet,
  type ProfileHelpSheetKind,
  RadioRow,
  SegmentedTabs,
  ShapePickerCard,
  SizePicker,
  Toggle,
  ModelPickerGrid,
  bodyTypeIcons,
  breastSizeIcons,
  shoulderShapeIcons,
  figureShapeIcons,
  hipsSizeIcons,
  hipsShapeIcons,
  bellyIcons,
  neckLengthIcons,
  type ShoulderShapeId,
} from "@/components/widget/ui";
import { WidgetHeader } from "@/components/widget/WidgetHeader";
import { Watermark } from "@/components/widget/Watermark";
import { WarningModal } from "@/components/widget/screens/WarningModal";
import { defaultUploadExamples } from "@/widget/config/uploadExamples";
import {
  profileModelCatalogId,
  profileModelCatalogs,
  PROFILE_MODEL_PREVIEW_COUNT,
} from "@/widget/config/profile-models";
import { secondaryButtonStyle } from "@/components/widget/ui/screenShell";

interface CreateProfileProps {
  onOpenMenu?: () => void;
  onClose?: () => void;
  /** empty — дефолт; filled — заполненный; errors — состояние валидации (Figma). */
  variant?: "empty" | "filled" | "errors";
  onContinue?: () => void;
  onDeleteProfile?: () => void;
  /** Gallery QA: проскроллить к параметрам — Figma `1211:25283`. */
  initialScrollToParams?: boolean;
}

const PLACEHOLDER_PHOTO =
  "data:image/svg+xml," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect fill="#e8e8e8" width="200" height="200"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#999" font-size="14">photo</text></svg>',
  );

function filledProfilePhotos(gender: Gender): Partial<Record<ProfilePhotoSlotId, string>> {
  const ex = defaultUploadExamples[gender];
  return {
    portrait: ex.portrait.good[0] ?? PLACEHOLDER_PHOTO,
    fullHeight: ex.fullHeight.good[0] ?? PLACEHOLDER_PHOTO,
    back: ex.portrait.good[1] ?? PLACEHOLDER_PHOTO,
    profile: ex.portrait.good[2] ?? PLACEHOLDER_PHOTO,
  };
}

function initFieldValues(
  paramsFields: WidgetConfig["createProfile"]["paramsFields"],
  variant: "empty" | "filled" | "errors",
): Record<string, number | ""> {
  const init: Record<string, number | ""> = {};
  (Object.keys(paramsFields) as ProfileParamsTab[]).forEach((tab) => {
    paramsFields[tab].forEach((f) => {
      init[f.id] = f.defaultValue ?? "";
    });
  });
  if (variant === "filled" || variant === "errors" || variant === "empty") {
    init.age = 30;
    init.height = 165;
    init.chest = 90;
    init.waist = 60;
    init.hips = variant === "filled" ? 95 : "";
  }
  return init;
}

type Gender = "female" | "male";
type PhotoMode = "own" | "model";

/**
 * Экран «Создать профиль».
 * Полностью управляется через config.createProfile + i18n.createProfile.
 * Все элементы (текст/цвета/радиусы/состав полей) настраиваются через WidgetConfigProvider.
 *
 * Логика:
 *  - photoMode "own"  → пользователь грузит фото в слоты (есть валидация обязательных).
 *  - photoMode "model"→ сетка моделей, «смотреть ещё», параметры фигуры (без «размер груди» у детей).
 *  - Параметры разбиты на 3 вкладки: basic / extended / detailed.
 *  - Для invalid-полей (как "обхват бёдер" в Figma) — поле подсвечивается красной рамкой.
 *  - CTA disabled пока не выполнены условия (фото или параметры обязательны).
 */
export function CreateProfile({
  onOpenMenu,
  onClose,
  variant = "empty",
  onContinue,
  onDeleteProfile,
  initialScrollToParams = false,
}: CreateProfileProps) {
  const { config, t } = useWidgetConfig();
  const cp = config.createProfile;
  const t_cp = t.createProfile;

  // Pol & child
  const [gender, setGender] = useState<Gender>(cp.genders[0] ?? "female");
  const [isChild, setIsChild] = useState(false);

  // Photo mode + photos
  const [photoMode, setPhotoMode] = useState<PhotoMode>(
    cp.photoModes[0] ?? "own",
  );
  const [selectedModelId, setSelectedModelId] = useState<string | null>(() => {
    const key = profileModelCatalogId(cp.genders[0] ?? "female", false);
    return profileModelCatalogs[key][0]?.id ?? null;
  });
  const [modelsExpanded, setModelsExpanded] = useState(false);
  const [photos, setPhotos] = useState<Partial<Record<ProfilePhotoSlotId, string>>>(
    () => {
      if (variant === "filled") {
        return filledProfilePhotos(cp.genders[0] ?? "female");
      }
      if (variant === "errors") {
        return {
          back: defaultUploadExamples[cp.genders[0] ?? "female"].portrait.good[1],
          profile: defaultUploadExamples[cp.genders[0] ?? "female"].portrait.good[2],
        };
      }
      return {};
    },
  );

  // Looks (вкладки «Образ 1 / +»)
  const [looks, setLooks] = useState<number[]>([1]);
  const [activeLook, setActiveLook] = useState(1);

  // Параметры
  const [paramsTab, setParamsTab] = useState<ProfileParamsTab>(
    variant === "errors" || variant === "empty" || variant === "filled"
      ? "detailed"
      : "basic",
  );
  const [fieldValues, setFieldValues] = useState<Record<string, number | "">>(
    () => initFieldValues(cp.paramsFields, variant),
  );

  // legLength оставлен в config — будет использован в extended/detailed,
  // на basic сейчас отображаем шейп-пикеры (по дизайну Figma).
  const [shoulderShape, setShoulderShape] = useState<ShoulderShapeId>(
    cp.shoulderShapes[1] ?? "sloped",
  );

  // Базовые шейп-пикеры (телосложение, размер груди)
  const [bodyType, setBodyType] = useState<BodyTypeId>(
    cp.defaultBodyType ?? cp.bodyTypes[1] ?? "thin",
  );
  const [breastSize, setBreastSize] = useState<BreastSizeId>(
    cp.defaultBreastSize ?? cp.breastSizes[1] ?? "small",
  );

  // Extended-параметры (расширенные)
  const [age, setAge] = useState<number | null>(cp.age.defaultValue);
  const [heightRange, setHeightRange] = useState<string | null>(
    cp.heightRanges[Math.floor(cp.heightRanges.length / 2)]?.id ?? null,
  );
  const [figureShape, setFigureShape] = useState<FigureShapeId>(
    cp.defaultFigureShape ?? cp.figureShapes[1] ?? "hourglass",
  );
  const [hipsSize, setHipsSize] = useState<HipsSizeId>(
    cp.defaultHipsSize ?? cp.hipsSizes[0] ?? "narrow",
  );
  const [hipsShape, setHipsShape] = useState<HipsShapeId>(
    cp.defaultHipsShape ?? cp.hipsShapes[1] ?? "pear",
  );
  const [bellyShape, setBellyShape] = useState<BellyShapeId>(
    cp.defaultBellyShape ?? cp.bellyShapes[0] ?? "flat",
  );
  const [neckLength, setNeckLength] = useState<NeckLengthId>(
    cp.defaultNeckLength ?? cp.neckLengths[2] ?? "average",
  );
  const [legLength, setLegLength] = useState<string | null>(
    variant === "filled" ? "32" : cp.legLengthOptions[2] ?? null,
  );
  const [clothingSize, setClothingSize] = useState<string | null>(
    cp.defaultClothingSize ?? cp.clothingSizeOptions[0] ?? null,
  );
  const [shoeSize, setShoeSize] = useState<string | null>(
    cp.defaultShoeSize ?? cp.shoeSizeOptions[0] ?? null,
  );
  const [submitted, setSubmitted] = useState(variant === "errors");
  const [uploadSlot, setUploadSlot] = useState<ProfilePhotoSlotId | null>(null);
  const [helpSheet, setHelpSheet] = useState<ProfileHelpSheetKind | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const paramsSectionRef = useRef<HTMLDivElement | null>(null);

  const openMeasureHint = (fieldId: ProfileFieldId) => {
    setHelpSheet({ type: "measure", fieldId });
  };

  const openDetailedParams = () => {
    setParamsTab("detailed");
    requestAnimationFrame(() => {
      paramsSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  useEffect(() => {
    if (!initialScrollToParams) return;
    setParamsTab("detailed");
    requestAnimationFrame(() => {
      paramsSectionRef.current?.scrollIntoView({ behavior: "auto", block: "start" });
    });
  }, [initialScrollToParams]);

  useEffect(() => {
    const models = profileModelCatalogs[profileModelCatalogId(gender, isChild)];
    setSelectedModelId(models[0]?.id ?? null);
    setModelsExpanded(false);
  }, [gender, isChild]);

  const catalogModels =
    profileModelCatalogs[profileModelCatalogId(gender, isChild)];
  const hasMoreModels = catalogModels.length > PROFILE_MODEL_PREVIEW_COUNT;
  const visibleModels = modelsExpanded
    ? catalogModels
    : catalogModels.slice(0, PROFILE_MODEL_PREVIEW_COUNT);

  const requiredPhotos = useMemo(
    () => cp.photoSlots.filter((s) => s.enabled && s.required).map((s) => s.id),
    [cp.photoSlots],
  );

  const photosOk =
    photoMode === "model"
      ? Boolean(selectedModelId)
      : requiredPhotos.every((id) => Boolean(photos[id]));

  // На вкладке basic теперь шейп-пикеры (всегда выбрано) — валидация числовых полей не нужна.
  const requiredFieldsOk = true;

  const canSubmit = photosOk && requiredFieldsOk;
  const ctaLooksActive = canSubmit || variant === "errors";
  const selectedModel = catalogModels.find((m) => m.id === selectedModelId);
  const portraitAvatar =
    photoMode === "model" ? selectedModel?.image : photos.portrait;

  const clothingShoeSizeFields = (
    <>
      <SizePicker
        title={t_cp.clothingSizeLabel}
        options={cp.clothingSizeOptions}
        value={clothingSize}
        onChange={(v) => {
          console.info("[VirtuFit] clothingSize change", v);
          setClothingSize(v);
        }}
        shape="circle"
        chosenPrefix={t_cp.chosenPrefix}
      />
      <SizePicker
        title={t_cp.shoeSizeLabel}
        options={cp.shoeSizeOptions}
        value={shoeSize}
        onChange={(v) => {
          console.info("[VirtuFit] shoeSize change", v);
          setShoeSize(v);
        }}
        shape="square"
        chosenPrefix={t_cp.chosenPrefix}
      />
    </>
  );

  const handleUpload = (id: ProfilePhotoSlotId) => {
    console.info("[VirtuFit] open upload dialog", { id });
    setUploadSlot(id);
  };
  const handleRemove = (id: ProfilePhotoSlotId) =>
    setPhotos((p) => {
      const next = { ...p };
      delete next[id];
      return next;
    });

  const handleSubmit = () => {
    setSubmitted(true);
    console.info("[VirtuFit] create-profile submit", {
      canSubmit,
      gender,
      isChild,
      photoMode,
      selectedModelId,
      fieldValues,
      bodyType,
      breastSize,
      shoulderShape,
    });
    if (!canSubmit) return;
    onContinue?.();
  };

  const photoSlots = cp.photoSlots.filter((s) => s.enabled);
  const fields = cp.paramsFields[paramsTab];

  return (
    <div
      className="relative flex flex-col w-full h-full min-w-0 overflow-hidden"
      style={{
        fontFamily: "var(--vf-font-body)",
        backgroundColor: "var(--vf-surface)",
        color: "var(--vf-text)",
      }}
    >
      <WidgetHeader onMenu={onOpenMenu} onProfile={onOpenMenu} onClose={onClose} />

      {/* Скроллируемая область */}
      <div
        className="flex flex-col flex-1 min-h-0 w-full min-w-0 overflow-y-auto"
        style={{ paddingBottom: "var(--vf-sp-12)" }}
      >
        {/* Заголовок + аватар */}
        <div
          className="flex flex-col w-full min-w-0"
          style={{
            gap: "var(--vf-sp-12)",
            paddingInline: "var(--vf-sp-12)",
            paddingTop: "var(--vf-sp-16)",
          }}
        >
          <h1
            className="uppercase leading-[1.05] text-left"
            style={{
              fontFamily: "var(--vf-font-heading)",
              fontWeight: 700,
              fontSize: "var(--vf-fs-26)",
              letterSpacing: "0.01em",
              color: "var(--vf-text)",
            }}
          >
            {t_cp.title}
          </h1>
          <div
            className="rounded-full flex items-center justify-center overflow-hidden"
            style={{
              width: "clamp(56px, 17vw, 64px)",
              height: "clamp(56px, 17vw, 64px)",
              border: "1px solid color-mix(in oklab, var(--vf-text) 25%, transparent)",
            }}
          >
            {portraitAvatar ? (
              <img
                src={portraitAvatar}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              <UserCircle2
                strokeWidth={1.2}
                style={{
                  width: "60%",
                  height: "60%",
                  color: "color-mix(in oklab, var(--vf-text) 60%, transparent)",
                }}
              />
            )}
          </div>
        </div>

        <div
          className="h-px w-full"
          style={{
            backgroundColor: "color-mix(in oklab, var(--vf-text) 10%, transparent)",
            marginTop: "var(--vf-sp-16)",
          }}
        />

        {/* Блок ПОЛ */}
        <Section>
          <Card>
            <div
              className="flex items-center justify-between w-full min-w-0"
              style={{ gap: "var(--vf-sp-12)" }}
            >
              <h2
                className="uppercase shrink-0"
                style={{
                  fontFamily: "var(--vf-font-heading)",
                  fontWeight: 700,
                  fontSize: "var(--vf-fs-16)",
                  color: "var(--vf-text)",
                  letterSpacing: "0.01em",
                }}
              >
                {t_cp.genderLabel}
              </h2>
            </div>
            <div
              className="flex items-center justify-between w-full min-w-0 flex-wrap"
              style={{ gap: "var(--vf-sp-12)", marginTop: "var(--vf-sp-12)" }}
            >
              <RadioRow
                name="gender"
                value={gender}
                onChange={setGender}
                options={cp.genders.map((g) => ({
                  id: g,
                  label: g === "female" ? t_cp.genderFemale : t_cp.genderMale,
                }))}
              />
              {cp.childToggleEnabled && (
                <Toggle
                  checked={isChild}
                  onChange={setIsChild}
                  label={t_cp.genderChild}
                  ariaLabel={t_cp.genderChild}
                />
              )}
            </div>
          </Card>
        </Section>

        {/* Подсказка про модель */}
        <Section>
          <p
            className="leading-[1.4]"
            style={{
              fontSize: "var(--vf-fs-12)",
              color: "color-mix(in oklab, var(--vf-text) 70%, transparent)",
              fontWeight: 400,
            }}
          >
            {photoMode === "own" ? t_cp.photoHintOwn : t_cp.photoHintModel}
          </p>
        </Section>

        {/* Photo mode tabs */}
        <Section>
          <SegmentedTabs
            variant="pill"
            value={photoMode}
            onChange={setPhotoMode}
            items={cp.photoModes.map((m) => ({
              id: m,
              label: m === "own" ? t_cp.photoModeOwn : t_cp.photoModeModel,
            }))}
            ariaLabel={
              photoMode === "own" ? t_cp.photoHintOwn : t_cp.photoHintModel
            }
          />
        </Section>

        {photoMode === "model" && (
          <>
            <Section>
              <ModelPickerGrid
                models={visibleModels}
                selectedId={selectedModelId}
                onSelect={setSelectedModelId}
              />
            </Section>
            {hasMoreModels && !modelsExpanded && (
              <Section>
                <button
                  type="button"
                  onClick={() => setModelsExpanded(true)}
                  className="flex items-center justify-center w-full uppercase"
                  style={{
                    ...secondaryButtonStyle,
                    fontFamily: "var(--vf-font-body)",
                    fontSize: "var(--vf-fs-12)",
                    fontWeight: 800,
                    letterSpacing: "0.09em",
                  }}
                >
                  {t_cp.seeMoreModels}
                </button>
              </Section>
            )}
          </>
        )}

        {photoMode === "own" && (
          <>
            {/* Looks tabs */}
            <Section>
              <div
                className="flex items-center w-full min-w-0"
                style={{ gap: "var(--vf-sp-16)" }}
              >
                <SegmentedTabs
                  variant="underline"
                  value={String(activeLook)}
                  onChange={(v) => setActiveLook(Number(v))}
                  items={looks.map((n) => ({
                    id: String(n),
                    label: `${t_cp.lookTab} ${n}`,
                  }))}
                />
                <button
                  type="button"
                  aria-label={t_cp.addLook}
                  onClick={() => {
                    const next = (looks.at(-1) ?? 0) + 1;
                    setLooks([...looks, next]);
                    setActiveLook(next);
                  }}
                  className="flex items-center justify-center shrink-0"
                  style={{ width: 28, height: 28 }}
                >
                  <Plus
                    strokeWidth={1.5}
                    style={{ width: 18, height: 18, color: "var(--vf-text)" }}
                  />
                </button>
              </div>
            </Section>

            {/* Photo grid */}
            <Section>
              <div
                className="grid w-full min-w-0"
                style={{
                  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                  gap: "var(--vf-sp-12)",
                }}
              >
                {photoSlots.map((slot) => (
                  <PhotoSlot
                    key={slot.id}
                    src={photos[slot.id]}
                    label={t_cp.photoSlots[slot.id]}
                    required={slot.required}
                    fitMode={slot.fitMode}
                    fillBg={slot.fillBg}
                    invalid={
                      submitted && slot.required && !photos[slot.id]
                    }
                    onUpload={() => handleUpload(slot.id)}
                    onRemove={() => handleRemove(slot.id)}
                  />
                ))}
              </div>
              <button
                type="button"
                className="self-start text-left underline underline-offset-2"
                style={{
                  marginTop: "var(--vf-sp-12)",
                  fontFamily: "var(--vf-font-body)",
                  fontSize: "var(--vf-fs-12)",
                  fontWeight: 500,
                  color: "color-mix(in oklab, var(--vf-text) 70%, transparent)",
                }}
              >
                {t_cp.removeAdditionalPhotos}
              </button>
            </Section>
          </>
        )}

        {/* Параметры фигуры — Figma `674:4854` / видны и в режиме модели */}
        <Section>
          <div ref={paramsSectionRef}>
          <h2
            className="uppercase"
            style={{
              fontFamily: "var(--vf-font-heading)",
              fontWeight: 700,
              fontSize: "var(--vf-fs-22)",
              color: "var(--vf-text)",
              letterSpacing: "0.01em",
              marginBottom: "var(--vf-sp-12)",
            }}
          >
            {t_cp.paramsTitle}
          </h2>
          <SegmentedTabs
            variant="pill"
            size="sm"
            value={paramsTab}
            onChange={setParamsTab}
            items={cp.paramsTabs.map((tab) => ({
              id: tab,
              label:
                tab === "basic"
                  ? t_cp.paramsTabBasic
                  : tab === "extended"
                    ? t_cp.paramsTabExtended
                    : t_cp.paramsTabDetailed,
            }))}
          />
          </div>
        </Section>

        {/* Поля параметров */}
        {paramsTab === "basic" ? (
          <Section>
            <div
              className="flex flex-col w-full min-w-0"
              style={{ gap: "var(--vf-sp-16)" }}
            >
              <p
                className="leading-[1.4]"
                style={{
                  fontFamily: "var(--vf-font-body)",
                  fontSize: "var(--vf-fs-12)",
                  fontWeight: 300,
                  color: "var(--vf-text)",
                }}
              >
                {t_cp.paramsBasicHint}
              </p>

              <ShapePickerCard
                title={t_cp.bodyTypeLabel}
                chosenPrefix={t_cp.chosenPrefix}
                value={bodyType}
                onChange={(id) => {
                  console.info("[VirtuFit] bodyType change", id);
                  setBodyType(id);
                }}
                options={cp.bodyTypes.map((id) => ({
                  id,
                  label: t_cp.bodyTypeNames[id],
                  Icon: bodyTypeIcons[gender][id],
                }))}
              />

              {!isChild && (
              <ShapePickerCard
                title={t_cp.breastSizeLabel}
                chosenPrefix={t_cp.chosenPrefix}
                value={breastSize}
                onChange={(id) => {
                  console.info("[VirtuFit] breastSize change", id);
                  setBreastSize(id);
                }}
                options={cp.breastSizes.map((id) => ({
                  id,
                  label: t_cp.breastSizeNames[id],
                  Icon: breastSizeIcons[gender][id],
                }))}
              />
              )}

              {clothingShoeSizeFields}
            </div>
          </Section>
        ) : paramsTab === "extended" ? (
          <Section>
            <div
              className="flex flex-col w-full min-w-0"
              style={{ gap: "var(--vf-sp-12)" }}
            >
              <p
                className="leading-[1.4]"
                style={{
                  fontFamily: "var(--vf-font-body)",
                  fontSize: "var(--vf-fs-12)",
                  fontWeight: 300,
                  color: "var(--vf-text)",
                }}
              >
                {t_cp.paramsBasicHint}
              </p>

              {/* 1. Возраст */}
              <AgeCard
                label={t_cp.ageLabel}
                value={age}
                min={cp.age.min}
                max={cp.age.max}
                step={cp.age.step}
                defaultValue={cp.age.defaultValue}
                onChange={(v) => {
                  console.info("[VirtuFit] age change", v);
                  setAge(v);
                }}
              />

              {/* 2. Рост */}
              <HeightCard
                label={t_cp.heightLabel}
                options={cp.heightRanges}
                value={heightRange}
                chosenPrefix={t_cp.chosenPrefix}
                onChange={(v) => {
                  console.info("[VirtuFit] heightRange change", v);
                  setHeightRange(v);
                }}
              />

              {/* 3. Телосложение */}
              <ShapePickerCard
                title={t_cp.bodyTypeLabel}
                chosenPrefix={t_cp.chosenPrefix}
                value={bodyType}
                onChange={(id) => {
                  console.info("[VirtuFit] bodyType change", id);
                  setBodyType(id);
                }}
                options={cp.bodyTypes.map((id) => ({
                  id,
                  label: t_cp.bodyTypeNames[id],
                  Icon: bodyTypeIcons[gender][id],
                }))}
              />

              {/* 4. Тип фигуры */}
              <ShapePickerCard
                title={t_cp.figureShapeLabel}
                chosenPrefix={t_cp.chosenPrefix}
                value={figureShape}
                onChange={(id) => {
                  console.info("[VirtuFit] figureShape change", id);
                  setFigureShape(id);
                }}
                options={cp.figureShapes.map((id) => ({
                  id,
                  label: t_cp.figureShapeNames[id],
                  Icon: figureShapeIcons[gender][id],
                }))}
              />

              {/* 5. Размер груди */}
              <ShapePickerCard
                title={t_cp.breastSizeLabel}
                chosenPrefix={t_cp.chosenPrefix}
                value={breastSize}
                onChange={(id) => {
                  console.info("[VirtuFit] breastSize change", id);
                  setBreastSize(id);
                }}
                options={cp.breastSizes.map((id) => ({
                  id,
                  label: t_cp.breastSizeNames[id],
                  Icon: breastSizeIcons[gender][id],
                }))}
              />

              {/* 6. Живот */}
              <ShapePickerCard
                title={t_cp.bellyShapeLabel}
                chosenPrefix={t_cp.chosenPrefix}
                value={bellyShape}
                onChange={(id) => {
                  console.info("[VirtuFit] bellyShape change", id);
                  setBellyShape(id);
                }}
                options={cp.bellyShapes.map((id) => ({
                  id,
                  label: t_cp.bellyShapeNames[id],
                  Icon: bellyIcons[gender][id],
                }))}
              />

              {/* 7. Размер бёдер */}
              <ShapePickerCard
                title={t_cp.hipsSizeLabel}
                chosenPrefix={t_cp.chosenPrefix}
                value={hipsSize}
                onChange={(id) => {
                  console.info("[VirtuFit] hipsSize change", id);
                  setHipsSize(id);
                }}
                options={cp.hipsSizes.map((id) => ({
                  id,
                  label: t_cp.hipsSizeNames[id],
                  Icon: hipsSizeIcons[gender][id],
                }))}
              />

              {/* 8. Форма бёдер */}
              <ShapePickerCard
                title={t_cp.hipsShapeLabel}
                chosenPrefix={t_cp.chosenPrefix}
                value={hipsShape}
                onChange={(id) => {
                  console.info("[VirtuFit] hipsShape change", id);
                  setHipsShape(id);
                }}
                options={cp.hipsShapes.map((id) => ({
                  id,
                  label: t_cp.hipsShapeNames[id],
                  Icon: hipsShapeIcons[gender][id],
                }))}
              />

              {/* 9. Длина шеи */}
              <ShapePickerCard
                title={t_cp.neckLengthLabel}
                chosenPrefix={t_cp.chosenPrefix}
                value={neckLength}
                onChange={(id) => {
                  console.info("[VirtuFit] neckLength change", id);
                  setNeckLength(id);
                }}
                options={cp.neckLengths.map((id) => ({
                  id,
                  label: t_cp.neckLengthNames[id],
                  Icon: neckLengthIcons[gender][id],
                }))}
              />

              {/* 10. Форма плеч */}
              <ShapePickerCard
                title={t_cp.shoulderShapeLabel}
                chosenPrefix={t_cp.shoulderShapeChosen}
                value={shoulderShape}
                onChange={(id) => {
                  console.info("[VirtuFit] shoulderShape change", id);
                  setShoulderShape(id);
                }}
                options={cp.shoulderShapes.map((id) => ({
                  id,
                  label: t_cp.shoulderShapeNames[id],
                  Icon: shoulderShapeIcons[gender][id],
                }))}
                ariaLabel={t_cp.shoulderShapeLabel}
              />

              {clothingShoeSizeFields}
            </div>
          </Section>
        ) : (
          <Section>
            <div
              className="flex flex-col w-full min-w-0"
              style={{ gap: "var(--vf-sp-20)" }}
            >
              {fields.map((f: ProfileFieldConfig) => {
                const invalid =
                  submitted &&
                  (fieldValues[f.id] === "" ||
                    (variant === "errors" && f.id === "hips"));
                return (
                  <div key={f.id} className="w-full min-w-0" style={paramCardStyle}>
                    <FieldRow
                      label={t_cp.fields[f.id]}
                      value={fieldValues[f.id] ?? ""}
                      min={f.min}
                      max={f.max}
                      step={f.step}
                      onChange={(v) =>
                        setFieldValues((s) => ({ ...s, [f.id]: v }))
                      }
                      hint={f.hint}
                      hintLabel={t_cp.howToMeasure}
                      onHintClick={
                        f.hint ? () => openMeasureHint(f.id) : undefined
                      }
                      invalid={invalid}
                    />
                  </div>
                );
              })}

              {/* длина ног */}
              <LegLengthCard
                label={t_cp.legLengthLabel}
                options={cp.legLengthOptions.map((id) => ({ id, label: id }))}
                value={legLength}
                onChange={(v) => {
                  console.info("[VirtuFit] legLength change", v);
                  setLegLength(v);
                }}
              />
              <button
                type="button"
                onClick={() => setHelpSheet({ type: "sizeChart" })}
                className="self-start text-left underline underline-offset-2"
                style={{
                  fontFamily: "var(--vf-font-body)",
                  fontSize: "var(--vf-fs-12)",
                  fontWeight: 400,
                  color: "color-mix(in oklab, var(--vf-text) 70%, transparent)",
                  marginTop: "calc(var(--vf-sp-12) * -1)",
                  paddingLeft: "var(--vf-sp-20)",
                }}
              >
                {t_cp.sizeChart}
              </button>

              {clothingShoeSizeFields}
            </div>
          </Section>
        )}

        {/* Доп. ссылки */}
        <Section>
          <div className="flex flex-col w-full min-w-0" style={{ gap: "var(--vf-sp-8)" }}>
            {paramsTab !== "detailed" && (
            <button
              type="button"
              onClick={openDetailedParams}
              className="self-start text-left underline underline-offset-2"
              style={{
                fontFamily: "var(--vf-font-body)",
                fontSize: "var(--vf-fs-12)",
                fontWeight: 500,
                color: "var(--vf-text)",
              }}
            >
              {t_cp.addExtraParams}
            </button>
            )}
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="self-start text-left"
              style={{
                fontFamily: "var(--vf-font-body)",
                fontSize: "var(--vf-fs-12)",
                fontWeight: 400,
                color: "color-mix(in oklab, var(--vf-text) 70%, transparent)",
              }}
            >
              {t_cp.deleteProfile}
            </button>
          </div>
        </Section>

      </div>

      {/* Sticky CTA — Figma: кнопка вне scroll */}
      <div
        className="shrink-0 w-full min-w-0"
        style={{
          paddingInline: "var(--vf-sp-12)",
          paddingTop: "var(--vf-sp-12)",
          paddingBottom: "var(--vf-sp-8)",
          backgroundColor: "var(--vf-surface)",
        }}
      >
        <button
          type="button"
          disabled={!canSubmit}
          onClick={handleSubmit}
          className="flex items-center justify-center w-full transition-colors min-w-0"
          style={{
            gap: "var(--vf-sp-10)",
            height: "var(--vf-sz-46)",
            paddingInline: "var(--vf-sp-28)",
            paddingBlock: "var(--vf-sp-12)",
            backgroundColor: ctaLooksActive
              ? "var(--vf-btn-bg)"
              : "var(--vf-btn-bg-disabled)",
            borderRadius: "var(--vf-radius-button)",
          }}
        >
          <span
            className="uppercase whitespace-nowrap"
            style={{
              fontFamily: "var(--vf-font-body)",
              fontSize: "var(--vf-fs-12)",
              fontWeight: 800,
              letterSpacing: "1.08px",
              color: ctaLooksActive ? "var(--vf-btn-text)" : "rgba(255,255,255,0.7)",
            }}
          >
            {t_cp.cta}
          </span>
        </button>
        {submitted && !canSubmit && (
          <p
            className="text-center"
            style={{
              marginTop: "var(--vf-sp-8)",
              fontFamily: "var(--vf-font-body)",
              fontSize: "var(--vf-fs-12)",
              color: "var(--vf-error)",
              fontWeight: 500,
            }}
          >
            {variant === "errors" && photoMode === "own" && !photosOk
              ? "для создания профиля с вашей фотографией нужно загрузить обязательные снимки."
              : photoMode === "own" && !photosOk
                ? t_cp.errorPhotos
                : photoMode === "model" && !photosOk
                  ? t_cp.errorModel
                  : t_cp.errorRequired}
          </p>
        )}
      </div>

      <Watermark />

      {uploadSlot && (
        <PhotoUploadDialog
          open
          slotId={uploadSlot}
          gender={gender === "male" ? "male" : "female"}
          onClose={() => setUploadSlot(null)}
          onSelected={(url) => {
            setPhotos((p) => ({ ...p, [uploadSlot]: url }));
          }}
        />
      )}

      {helpSheet && (
        <ProfileHelpSheet
          kind={helpSheet}
          gender={gender === "male" ? "male" : "female"}
          onClose={() => setHelpSheet(null)}
          onOpenMeasure={(fieldId) => setHelpSheet({ type: "measure", fieldId })}
        />
      )}

      <WarningModal
        open={showDeleteConfirm}
        title={t_cp.deleteProfileDialog?.title ?? "Вы действительно хотите удалить профиль?"}
        confirmLabel={t_cp.deleteProfileDialog?.confirm ?? "да, удалить"}
        cancelLabel={t_cp.deleteProfileDialog?.cancel ?? "отмена"}
        onCancel={() => setShowDeleteConfirm(false)}
        onConfirm={() => {
          setShowDeleteConfirm(false);
          console.info("[VirtuFit] delete profile confirmed");
          onDeleteProfile?.();
        }}
      />
    </div>
  );
}

/** Паддинговая обёртка для секций. */
function Section({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="w-full min-w-0"
      style={{
        paddingInline: "var(--vf-sp-12)",
        paddingTop: "var(--vf-sp-16)",
      }}
    >
      {children}
    </div>
  );
}

/** Серая карточка-блок (для блока «ПОЛ»). */
function Card({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="w-full min-w-0"
      style={{
        ...paramCardStyle,
        padding: "var(--vf-sp-16)",
      }}
    >
      {children}
    </div>
  );
}
