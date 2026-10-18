/**
 * Дефолтные примеры «хороших/плохих» фото для bottom-sheet загрузки.
 * Структурировано по полу и слоту — админка сможет переопределять любые массивы
 * через DeepPartial<WidgetConfig> (createProfile.uploadExamples).
 *
 * Источники изображений лежат в src/assets/upload-examples/{gender}/{slot}/.
 */
import type { ProfilePhotoSlotId } from "./types";

import femalePortraitGood1 from "@/assets/upload-examples/female/portrait/good-1.jpg";
import femalePortraitGood2 from "@/assets/upload-examples/female/portrait/good-2.png";
import femalePortraitGood3 from "@/assets/upload-examples/female/portrait/good-3.png";
import femalePortraitBad1 from "@/assets/upload-examples/female/portrait/bad-1.png";
import femalePortraitBad2 from "@/assets/upload-examples/female/portrait/bad-2.png";
import femalePortraitBad3 from "@/assets/upload-examples/female/portrait/bad-3.png";

import malePortraitGood1 from "@/assets/upload-examples/male/portrait/good-1.png";
import malePortraitGood2 from "@/assets/upload-examples/male/portrait/good-2.png";
import malePortraitGood3 from "@/assets/upload-examples/male/portrait/good-3.png";
import malePortraitBad1 from "@/assets/upload-examples/male/portrait/bad-1.png";
import malePortraitBad2 from "@/assets/upload-examples/male/portrait/bad-2.png";
import malePortraitBad3 from "@/assets/upload-examples/male/portrait/bad-3.png";

import femaleFullGood1 from "@/assets/upload-examples/female/full-height/good-1.png";
import femaleFullGood2 from "@/assets/upload-examples/female/full-height/good-2.png";
import femaleFullGood3 from "@/assets/upload-examples/female/full-height/good-3.png";
import femaleFullBad1 from "@/assets/upload-examples/female/full-height/bad-1.png";
import femaleFullBad2 from "@/assets/upload-examples/female/full-height/bad-2.png";
import femaleFullBad3 from "@/assets/upload-examples/female/full-height/bad-3.png";

import maleFullGood1 from "@/assets/upload-examples/male/full-height/good-1.png";
import maleFullGood2 from "@/assets/upload-examples/male/full-height/good-2.png";
import maleFullGood3 from "@/assets/upload-examples/male/full-height/good-3.png";
import maleFullBad1 from "@/assets/upload-examples/male/full-height/bad-1.png";
import maleFullBad2 from "@/assets/upload-examples/male/full-height/bad-2.png";
import maleFullBad3 from "@/assets/upload-examples/male/full-height/bad-3.png";

import femaleBackGood1 from "@/assets/upload-examples/female/back/good-1.png";
import femaleBackGood2 from "@/assets/upload-examples/female/back/good-2.png";
import femaleBackGood3 from "@/assets/upload-examples/female/back/good-3.png";
import femaleBackBad1 from "@/assets/upload-examples/female/back/bad-1.png";
import femaleBackBad2 from "@/assets/upload-examples/female/back/bad-2.png";
import femaleBackBad3 from "@/assets/upload-examples/female/back/bad-3.png";

import maleBackGood1 from "@/assets/upload-examples/male/back/good-1.png";
import maleBackGood2 from "@/assets/upload-examples/male/back/good-2.png";
import maleBackGood3 from "@/assets/upload-examples/male/back/good-3.png";
import maleBackBad1 from "@/assets/upload-examples/male/back/bad-1.png";
import maleBackBad2 from "@/assets/upload-examples/male/back/bad-2.png";
import maleBackBad3 from "@/assets/upload-examples/male/back/bad-3.png";

import femaleProfileGood1 from "@/assets/upload-examples/female/profile/good-1.png";
import femaleProfileGood2 from "@/assets/upload-examples/female/profile/good-2.png";
import femaleProfileGood3 from "@/assets/upload-examples/female/profile/good-3.png";
import femaleProfileBad1 from "@/assets/upload-examples/female/profile/bad-1.png";
import femaleProfileBad2 from "@/assets/upload-examples/female/profile/bad-2.png";
import femaleProfileBad3 from "@/assets/upload-examples/female/profile/bad-3.jpg";

import maleProfileGood1 from "@/assets/upload-examples/male/profile/good-1.png";
import maleProfileGood2 from "@/assets/upload-examples/male/profile/good-2.jpg";
import maleProfileGood3 from "@/assets/upload-examples/male/profile/good-3.jpg";
import maleProfileBad1 from "@/assets/upload-examples/male/profile/bad-1.png";
import maleProfileBad2 from "@/assets/upload-examples/male/profile/bad-2.png";
import maleProfileBad3 from "@/assets/upload-examples/male/profile/bad-3.png";

export type UploadExampleGender = "female" | "male";

export interface UploadExamplesForSlot {
  /** Положительные примеры (зелёная галочка, кликабельны). */
  good: string[];
  /** Отрицательные примеры (красный крестик, неинтерактивны). */
  bad: string[];
}

export type UploadExamplesByGender = Record<
  UploadExampleGender,
  Record<ProfilePhotoSlotId, UploadExamplesForSlot>
>;

export const defaultUploadExamples: UploadExamplesByGender = {
  female: {
    portrait: {
      good: [femalePortraitGood1, femalePortraitGood2, femalePortraitGood3],
      bad: [femalePortraitBad1, femalePortraitBad2, femalePortraitBad3],
    },
    fullHeight: {
      // Порядок по дизайну Figma: студия (чистый фон) → зеркальное селфи → улица.
      good: [femaleFullGood3, femaleFullGood1, femaleFullGood2],
      bad: [femaleFullBad1, femaleFullBad2, femaleFullBad3],
    },
    back: {
      good: [femaleBackGood1, femaleBackGood2, femaleBackGood3],
      bad: [femaleBackBad1, femaleBackBad2, femaleBackBad3],
    },
    profile: {
      good: [femaleProfileGood1, femaleProfileGood2, femaleProfileGood3],
      bad: [femaleProfileBad1, femaleProfileBad2, femaleProfileBad3],
    },
  },
  male: {
    portrait: {
      good: [malePortraitGood1, malePortraitGood2, malePortraitGood3],
      bad: [malePortraitBad1, malePortraitBad2, malePortraitBad3],
    },
    fullHeight: {
      // Порядок по дизайну Figma: студия (чистый фон) → зеркальное селфи → улица.
      good: [maleFullGood3, maleFullGood1, maleFullGood2],
      bad: [maleFullBad1, maleFullBad2, maleFullBad3],
    },
    back: {
      good: [maleBackGood1, maleBackGood2, maleBackGood3],
      bad: [maleBackBad1, maleBackBad2, maleBackBad3],
    },
    profile: {
      good: [maleProfileGood1, maleProfileGood2, maleProfileGood3],
      bad: [maleProfileBad1, maleProfileBad2, maleProfileBad3],
    },
  },
};
