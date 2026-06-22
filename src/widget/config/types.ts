/**
 * Типы конфигурации виджета виртуальной примерки.
 * Все экраны читают значения через useWidgetConfig().
 * Partial-конфиг (DeepPartial<WidgetConfig>) сливается с дефолтами в WidgetConfigProvider.
 */

export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

export type ThemeMode = "light" | "dark" | "system";
export type Locale = "ru" | "en";

export interface WidgetColors {
  /** Основной фирменный цвет (тёмные карточки, кнопки). */
  primary: string;
  /** Текст на primary. */
  onPrimary: string;
  /** Базовый фон виджета. */
  surface: string;
  /** Приглушённый фон (карточки/блоки). */
  surfaceMuted: string;
  /** Основной текст. */
  text: string;
  /** Вторичный текст. */
  textMuted: string;
  /** Цвет границ/разделителей. */
  border: string;
  /** Кнопка — фон активного состояния. */
  btnBg: string;
  /** Кнопка — фон disabled. */
  btnBgDisabled: string;
  /** Кнопка — цвет текста. */
  btnText: string;
  /** Цвет ошибок (рамки invalid, текст ошибок). */
  error: string;
  /** Фон hero-карточек (превью модели). */
  cardHero: string;
  /** Успех (галочки, positive hints). */
  success: string;
}

export interface WidgetTheme {
  light: WidgetColors;
  dark: WidgetColors;
  radius: {
    /** Внешний радиус контейнера виджета. */
    widget: string;
    /** Карточки внутри. */
    card: string;
    /** Кнопка. */
    button: string;
    /** Миниатюры в сетках (гардероб, фон, позы, магазин). */
    tile: string;
  };
  shadow: {
    widget: string;
    card: string;
  };
  fonts: {
    /** Имя шрифта для заголовков (Oswald по умолчанию). */
    heading: string;
    /** Имя шрифта для основного текста (Manrope). */
    body: string;
  };
}

/** Доступные варианты анимации логотипа магазина-хоста. */
export type LogoAnimationId =
  | "fadeIn"
  | "slideDown"
  | "scaleIn"
  | "float"
  | "shimmer"
  | "pulse"
  | "rotateIn";

export interface BrandConfig {
  /** URL логотипа сайта (PNG/JPG/SVG). Если не задан — рендерим текст logoAlt. */
  logoUrl?: string;
  /** Текст-заглушка логотипа (например, название бренда). */
  logoAlt: string;
  /** Внешняя ссылка с логотипа (на главную сайта-хоста). */
  siteUrl?: string;
  /** Включена ли анимация логотипа. */
  logoAnimationEnabled: boolean;
  /** Тип анимации логотипа. */
  logoAnimation: LogoAnimationId;
  /**
   * Инвертировать ли цвет логотипа в белый (для тёмного hero-фона).
   * По умолчанию true — сохраняем текущее поведение.
   */
  logoInvert: boolean;
}

export interface SplashConfig {
  /** Показывать ли splash перед start-экраном. */
  enabled: boolean;
  /** Изображения для слайдера-героя. */
  images: string[];
  /** Интервал автопрокрутки слайдера, мс. 0 — выключить автопрокрутку. */
  autoplayMs: number;
}

/** Плитка фона / позы в конфиге (URL или vf-idb://…). */
export interface ConfigTile {
  id: string;
  label: string;
  image?: string;
  tint?: string;
}

export interface TeleportConfig {
  backgrounds: ConfigTile[];
}

export interface AnimateLookConfig {
  poses: ConfigTile[];
}

export interface WatermarkConfig {
  enabled: boolean;
  text: string;
  href: string;
  openInNewTab: boolean;
  /** Тариф позволяет скрыть водяной знак; иначе он всегда показывается. */
  removableOnPlan: boolean;
}

/** ID встроенных пунктов user-menu. Иконки рендерятся внутри компонента. */
export type UserMenuItemId = "profile" | "tryons" | "wardrobe" | "stylist";

export interface UserMenuItemConfig {
  id: UserMenuItemId;
  /** Показывать ли пункт. */
  enabled: boolean;
  /** Показывать иконку-«пин» справа (фичеринг/закреплённость). */
  pinned: boolean;
}

export interface LegalLinkConfig {
  /** Текст ссылки (берётся из i18n, если пусто). */
  enabled: boolean;
  /** Внешний URL — открывается в новой вкладке. Если undefined — некликабельная подпись. */
  href?: string;
}

export interface UserMenuConfig {
  items: UserMenuItemConfig[];
  legal: {
    privacy: LegalLinkConfig;
    terms: LegalLinkConfig;
    dataConsent: LegalLinkConfig;
  };
}

/** Слот для фотографии профиля. id используется в i18n.createProfile.photoSlots. */
export type ProfilePhotoSlotId =
  | "portrait"
  | "fullHeight"
  | "back"
  | "profile";

/** Режим отображения загруженного фото в слоте. */
export type PhotoSlotFitMode = "cover" | "contain-fill";

export interface ProfilePhotoSlotConfig {
  id: ProfilePhotoSlotId;
  enabled: boolean;
  /** Обязательный для отправки (валидация). */
  required: boolean;
  /**
   * Как кадрировать загруженное фото:
   *  - "cover" (по умолчанию): фото заполняет слот, прижато к верху (`object-position: top`).
   *  - "contain-fill": фото целиком (contain), пустоты по бокам — то же фото cover c прозрачностью на подложке.
   */
  fitMode?: PhotoSlotFitMode;
  /**
   * Цвет подложки под полупрозрачным fill-слоем для режима "contain-fill".
   * По умолчанию #ACACAC.
   */
  fillBg?: string;
}

/** Группы параметров фигуры — каждая вкладка показывает свои поля. */
export type ProfileParamsTab = "basic" | "extended" | "detailed";

/** ID числовых полей с диапазоном (для слайдеров). */
export type ProfileFieldId =
  | "age"
  | "height"
  | "chest"
  | "waist"
  | "hips"
  | "shoulderSize"
  | "footLength"
  | "footWidth"
  | "footArch";

export interface ProfileFieldConfig {
  id: ProfileFieldId;
  /** Минимум слайдера. */
  min: number;
  /** Максимум слайдера. */
  max: number;
  /** Шаг. */
  step: number;
  /** Дефолтное значение. */
  defaultValue?: number;
  /** Единица измерения, например "см" или "лет". */
  unit?: string;
  /** Показывать ли ссылку «как определить размер». */
  hint?: boolean;
}

/** Варианты «телосложение» (5 ступеней). */
export type BodyTypeId =
  | "veryThin"
  | "thin"
  | "average"
  | "slightlyFull"
  | "full";

/** Варианты «размер груди» (5 ступеней). */
export type BreastSizeId =
  | "verySmall"
  | "small"
  | "average"
  | "large"
  | "veryLarge";

/** Варианты «тип фигуры» (5 ступеней — по столбцам спрайта Figma). */
export type FigureShapeId =
  | "rectangle"
  | "circle"
  | "invertedTriangle"
  | "hourglass"
  | "triangle";

/** Варианты «размер бёдер» (5 ступеней). */
export type HipsSizeId =
  | "narrow"
  | "slightlyNarrow"
  | "average"
  | "slightlyWide"
  | "wide";

/** Варианты «форма бёдер» (5 столбцов — по спрайту Figma). */
export type HipsShapeId =
  | "square"
  | "pear"
  | "invertedTriangle"
  | "circle"
  | "invertedHeart";

/** Варианты «живот» (4 ступени — по спрайту Figma). */
export type BellyShapeId = "flat" | "small" | "average" | "large";

/** Варианты «длина шеи» (4 ступени — по спрайту Figma). */
export type NeckLengthId = "veryShort" | "short" | "average" | "long";

/** Сегменты «рост» — диапазоны в см. */
export interface HeightRangeOption {
  id: string;
  label: string;
  /** Числовое значение — например, серединный рост в диапазоне (опционально). */
  value?: number;
}

export interface CreateProfileConfig {
  /** Доступные значения пола. */
  genders: Array<"female" | "male">;
  /** Включён ли тоггл «ребёнок». */
  childToggleEnabled: boolean;
  /** Доступные режимы ввода фото. */
  photoModes: Array<"own" | "model">;
  /** Слоты фотографий. */
  photoSlots: ProfilePhotoSlotConfig[];
  /** Какие табы параметров доступны. */
  paramsTabs: ProfileParamsTab[];
  /** Поля для каждой вкладки параметров. */
  paramsFields: Record<ProfileParamsTab, ProfileFieldConfig[]>;
  /** Опции «длина ног». */
  legLengthOptions: string[];
  /** Опции «размер одежды» (например XS/S/M/L/XL...). */
  clothingSizeOptions: string[];
  /** Опции «размер обуви» (например 36..46). */
  shoeSizeOptions: string[];
  /** Дефолтный выбранный размер одежды. */
  defaultClothingSize?: string;
  /** Дефолтный выбранный размер обуви. */
  defaultShoeSize?: string;
  /** Опции «форма плеч» (id'шники). */
  shoulderShapes: Array<"normal" | "sloped" | "rectangular" | "muscular" | "bony">;
  /** Доступные варианты «телосложение» (порядок задаёт порядок отрисовки). */
  bodyTypes: BodyTypeId[];
  /** Доступные варианты «размер груди». */
  breastSizes: BreastSizeId[];
  /** Доступные варианты «тип фигуры». */
  figureShapes: FigureShapeId[];
  /** Доступные варианты «размер бёдер». */
  hipsSizes: HipsSizeId[];
  /** Доступные варианты «форма бёдер». */
  hipsShapes: HipsShapeId[];
  /** Доступные варианты «живот». */
  bellyShapes: BellyShapeId[];
  /** Доступные варианты «длина шеи». */
  neckLengths: NeckLengthId[];
  /** Возрастной слайдер карточки «возраст». */
  age: { min: number; max: number; step: number; defaultValue: number };
  /** Сегменты диапазонов в карточке «рост». */
  heightRanges: HeightRangeOption[];
  /** Дефолтно выбранный bodyType (если не задан — берётся 3-й, «average»). */
  defaultBodyType?: BodyTypeId;
  /** Дефолтно выбранный breastSize. */
  defaultBreastSize?: BreastSizeId;
  /** Дефолтно выбранный figureShape. */
  defaultFigureShape?: FigureShapeId;
  /** Дефолтно выбранный hipsSize. */
  defaultHipsSize?: HipsSizeId;
  /** Дефолтно выбранный hipsShape. */
  defaultHipsShape?: HipsShapeId;
  /** Дефолтно выбранный bellyShape. */
  defaultBellyShape?: BellyShapeId;
  /** Дефолтно выбранный neckLength. */
  defaultNeckLength?: NeckLengthId;
  /**
   * Примеры «хороших/плохих» фото в диалоге загрузки.
   * Ключ 1 — пол, ключ 2 — id слота. Админка может переопределять любые массивы.
   */
  uploadExamples: Record<
    "female" | "male",
    Record<ProfilePhotoSlotId, { good: string[]; bad: string[] }>
  >;
}

export interface I18nDictionary {
  splash: {
    title: string;
    subtitle: string;
    cta: string;
  };
  start: {
    title: string;
    expressTitle: string;
    expressDesc: string;
    proTitle: string;
    proDesc: string;
    agreeData: string;
    agreePolicy: string;
    cta: string;
    profile: string;
    poweredBy: string;
    poweredByCompany: string;
  };
  userMenu: {
    items: Record<UserMenuItemId, string>;
    legal: {
      privacy: string;
      terms: string;
      dataConsent: string;
    };
  };
  createProfile: {
    title: string;
    genderLabel: string;
    genderFemale: string;
    genderMale: string;
    genderChild: string;
    photoHintOwn: string;
    photoHintModel: string;
    seeMoreModels: string;
    photoModeOwn: string;
    photoModeModel: string;
    lookTab: string;
    addLook: string;
    photoSlots: Record<ProfilePhotoSlotId, string>;
    photoRequired: string;
    removeAdditionalPhotos: string;
    paramsTitle: string;
    paramsTabBasic: string;
    paramsTabExtended: string;
    paramsTabDetailed: string;
    /** Подсказка под табами (basic): «Если вы хотите получать рекомендации…». */
    paramsBasicHint: string;
    /** Заголовок карточки «телосложение». */
    bodyTypeLabel: string;
    /** Заголовок карточки «размер груди». */
    breastSizeLabel: string;
    /** Заголовок карточки «возраст». */
    ageLabel: string;
    /** Заголовок карточки «рост». */
    heightLabel: string;
    /** Заголовок карточки «тип фигуры». */
    figureShapeLabel: string;
    /** Заголовок карточки «размер бёдер». */
    hipsSizeLabel: string;
    /** Заголовок карточки «форма бёдер». */
    hipsShapeLabel: string;
    /** Заголовок карточки «живот». */
    bellyShapeLabel: string;
    /** Заголовок карточки «длина шеи». */
    neckLengthLabel: string;
    /** Заголовок карточки «размер одежды». */
    clothingSizeLabel: string;
    /** Заголовок карточки «размер обуви». */
    shoeSizeLabel: string;
    /** Префикс «выбрано: …». */
    chosenPrefix: string;
    /** Названия вариантов телосложения (общий ключ для м/ж). */
    bodyTypeNames: Record<
      "veryThin" | "thin" | "average" | "slightlyFull" | "full",
      string
    >;
    /** Названия вариантов «размер груди». */
    breastSizeNames: Record<
      "verySmall" | "small" | "average" | "large" | "veryLarge",
      string
    >;
    /** Названия вариантов «тип фигуры». */
    figureShapeNames: Record<FigureShapeId, string>;
    /** Названия вариантов «размер бёдер». */
    hipsSizeNames: Record<HipsSizeId, string>;
    /** Названия вариантов «форма бёдер». */
    hipsShapeNames: Record<HipsShapeId, string>;
    /** Названия вариантов «живот». */
    bellyShapeNames: Record<BellyShapeId, string>;
    /** Названия вариантов «длина шеи». */
    neckLengthNames: Record<NeckLengthId, string>;
    fields: Record<ProfileFieldId, string>;
    legLengthLabel: string;
    shoulderShapeLabel: string;
    shoulderShapeChosen: string;
    shoulderShapeNames: Record<
      "normal" | "sloped" | "rectangular" | "muscular" | "bony",
      string
    >;
    howToMeasure: string;
    sizeChart: string;
    addExtraParams: string;
    deleteProfile: string;
    cta: string;
    errorPhotos: string;
    errorModel: string;
    errorRequired: string;
    /** Диалог загрузки фото (bottom-sheet). */
    uploadDialog: {
      portraitTitle: string;
      fullHeightTitle: string;
      backTitle: string;
      profileTitle: string;
      subtitle: string;
      showTips: string;
      hideTips: string;
      cameraBtn: string;
      selectBtn: string;
      /** Базовый набор советов (используется если нет tipsBySlot для конкретного слота). */
      tips: string[];
      /** Советы по слотам — переопределяют tips для каждого типа фото. */
      tipsBySlot?: Partial<Record<ProfilePhotoSlotId, string[]>>;
    };
    deleteProfileDialog: {
      title: string;
      confirm: string;
      cancel: string;
    };
    measureGuides: Partial<
      Record<
        ProfileFieldId,
        {
          title: string;
          steps: { label?: string; text: string }[];
        }
      >
    >;
    legLengthSizeChart: {
      title: string;
      howToMeasureLink: string;
      columns: { eu: string; gost: string; length: string };
      rows: { eu: string; gost: string; length: string }[];
    };
  };
  /** Тексты вторичных экранов (wardrobe, generation, modals). */
  screens: {
    common: {
      search: string;
      cancel: string;
      save: string;
      apply: string;
      close: string;
      ok: string;
      linkCopied: string;
      good: string;
      bad: string;
      examples: string;
      tips: string;
      secShort: string;
    };
    wardrobe: {
      addItem: string;
      addFromStore: string;
      addSet: string;
      selectSet: string;
      cancelPick: string;
    };
    wardrobeSetAdd: {
      title: string;
      typeValue: string;
      typeHint: string;
    };
    myImages: {
      title: string;
      newTryOn: string;
      deleteAria: string;
    };
    wardrobeEdit: {
      title: string;
      nameLabel: string;
      uploadPhoto: string;
      photoTips: string;
      uploadExtra: string;
      deleteItem: string;
    };
    store: {
      title: string;
      pickTitle: string;
      applicationAreaPrefix: string;
      select: string;
      cancel: string;
      addToWardrobe: string;
      tabStore: string;
      tabWardrobe: string;
      emptySearch: string;
    };
    storeFilter: {
      title: string;
      apply: string;
      categories: {
        all: string;
        tops: string;
        bottoms: string;
        footwear: string;
        accessories: string;
      };
    };
    catalogFilters: {
      title: string;
      back: string;
      resetAll: string;
      resetSection: string;
      show: string;
      cancel: string;
      removeChip: string;
      chipType: string;
      chipColor: string;
      chipComposition: string;
      chipPrice: string;
      sections: {
        color: string;
        composition: string;
        category: string;
        price: string;
        length: string;
        style: string;
        season: string;
        material: string;
        sleeve: string;
        cut: string;
        model: string;
      };
      colors: Record<
        | "black"
        | "white"
        | "blue"
        | "red"
        | "yellow"
        | "orange"
        | "beige"
        | "green"
        | "purple"
        | "gray"
        | "pink"
        | "lightBlue"
        | "brown",
        string
      >;
      compositions: Record<
        | "cotton"
        | "linen"
        | "leather"
        | "viscose"
        | "fleece"
        | "wool"
        | "elastane",
        string
      >;
      productTypes: Record<
        | "jacket"
        | "coat"
        | "sheepskinCoat"
        | "downJacket"
        | "cardigan"
        | "sweater"
        | "jumper"
        | "vest"
        | "dress"
        | "sundress"
        | "tshirt"
        | "tankTop"
        | "swimsuit"
        | "bra",
        string
      >;
      materials: Record<
        | "leather"
        | "ecoLeather"
        | "dermontin"
        | "textile"
        | "velvet"
        | "suede"
        | "denim",
        string
      >;
      lengths: Record<"short" | "medium" | "long" | "maxi", string>;
      styles: Record<"casual" | "classic" | "sport" | "evening", string>;
      seasons: Record<"spring" | "summer" | "autumn" | "winter", string>;
      sleeves: Record<"short" | "long" | "threeQuarter" | "sleeveless", string>;
      cuts: Record<"slim" | "regular" | "oversize" | "fitted", string>;
      models: Record<"basic" | "fitted" | "relaxed", string>;
    };
    wardrobeAdd: {
      title: string;
      uploadHint: string;
      takePhoto: string;
      fromGallery: string;
    };
    addSheet: {
      namePlaceholder: string;
      uploadPhoto: string;
      photoTips: string;
      add: string;
    };
    background: {
      title: string;
      search: string;
      addCustom: string;
    };
    animate: {
      title: string;
      search: string;
      addCustom: string;
    };
    generation: {
      tryOn: string;
      outfitTitle: string;
      buyAll: string;
      sizeWarning: string;
      changeBackground: string;
      animate: string;
      share: string;
      configureOutfit: string;
      clearOutfit: string;
      moreActions: string;
      moreMenu: {
        title: string;
        fullScreen: string;
        howItWorks: string;
        share: string;
        clearOutfit: string;
        deleteOutfit: string;
      };
      shareMenu: {
        title: string;
        download: string;
        copyLink: string;
        shareVia: string;
      };
      addWear: {
        outfitTitle: string;
        accessoryTitle: string;
        tabs: {
          head: string;
          torso: string;
          legs: string;
          feet: string;
          face: string;
          ears: string;
          neck: string;
          hands: string;
          back: string;
        };
      };
      itemConfig: {
        configurePrefix: string;
        resetAll: string;
        clearItem: string;
        noOptions: string;
        noSettings: string;
        fields: {
          visorSide: string;
          style: string;
          fastener: string;
          sleeve: string;
          sleeveRoll: string;
          collarHeight: string;
          collarType: string;
          styling: string;
          cuffRoll: string;
          fit: string;
          carryHand: string;
          lacing: string;
          tuckedInFootwear: string;
          glassesPlacement: string;
        };
        options: {
          oversize: string;
          fitted: string;
          sleeveStraight: string;
          sleeveRolled: string;
          sleevePushed: string;
          collarRegular: string;
          collarStanding: string;
          stylingRegular: string;
          stylingCuffed: string;
          fitHigh: string;
          fitRegular: string;
          fitLow: string;
          handLeft: string;
          handRight: string;
          laced: string;
          unlaced: string;
          tuckedIn: string;
          notTuckedIn: string;
          onEyes: string;
          onHead: string;
          onClothing: string;
        };
        sliderLabels: {
          visorFront: string;
          visorRight: string;
          visorBack: string;
          visorLeft: string;
          unbuttoned: string;
          buttoned: string;
          pct0: string;
          pct50: string;
          pct100: string;
        };
      };
    };
    preloader: {
      label: string;
      devDone: string;
    };
    configuring: {
      selectProfile: string;
      selectPose: string;
    };
    warning: {
      title: string;
      confirm: string;
      cancel: string;
    };
    warnings: {
      clearOutfit: { title: string; confirm: string; cancel: string };
      clearItem: { title: string; confirm: string; cancel: string };
      deleteWardrobeItem: { title: string; confirm: string; cancel: string };
      replaceOutfitWithSet: { title: string; confirm: string; cancel: string };
      deletePose: { title: string; confirm: string; cancel: string };
      deleteItemContent: { title: string; confirm: string; cancel: string };
      deleteTryOn: { title: string; confirm: string; cancel: string };
      deleteOutfit: { title: string; confirm: string; cancel: string };
    };
  };
}

export interface WidgetConfig {
  /** Режим темы. По умолчанию "light". */
  themeMode: ThemeMode;
  /** Текущая локаль. */
  locale: Locale;
  /** Доступные локали и их словари. */
  i18n: Record<Locale, I18nDictionary>;
  theme: WidgetTheme;
  brand: BrandConfig;
  splash: SplashConfig;
  /** Телепорт — каталог фонов. */
  teleport: TeleportConfig;
  /** Оживить образ — каталог поз / анимаций. */
  animateLook: AnimateLookConfig;
  userMenu: UserMenuConfig;
  watermark: WatermarkConfig;
  createProfile: CreateProfileConfig;
}
