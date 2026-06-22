import female_adult_1 from "@/assets/models/female-adult-1.png";
import female_adult_2 from "@/assets/models/female-adult-2.png";
import female_adult_3 from "@/assets/models/female-adult-3.png";
import female_adult_4 from "@/assets/models/female-adult-4.png";
import female_adult_5 from "@/assets/models/female-adult-5.png";
import female_adult_6 from "@/assets/models/female-adult-6.png";
import female_adult_7 from "@/assets/models/female-adult-7.png";
import female_adult_8 from "@/assets/models/female-adult-8.png";
import female_adult_9 from "@/assets/models/female-adult-9.png";
import female_adult_10 from "@/assets/models/female-adult-10.png";
import female_adult_11 from "@/assets/models/female-adult-11.png";
import female_adult_12 from "@/assets/models/female-adult-12.png";
import female_adult_13 from "@/assets/models/female-adult-13.png";
import female_adult_14 from "@/assets/models/female-adult-14.png";
import female_child_1 from "@/assets/models/female-child-1.png";
import female_child_2 from "@/assets/models/female-child-2.png";
import female_child_3 from "@/assets/models/female-child-3.png";
import female_child_4 from "@/assets/models/female-child-4.png";
import female_child_5 from "@/assets/models/female-child-5.png";
import female_child_6 from "@/assets/models/female-child-6.png";
import female_child_7 from "@/assets/models/female-child-7.png";
import female_child_8 from "@/assets/models/female-child-8.png";
import female_child_9 from "@/assets/models/female-child-9.png";
import female_child_10 from "@/assets/models/female-child-10.png";
import female_child_11 from "@/assets/models/female-child-11.png";
import female_child_12 from "@/assets/models/female-child-12.png";
import female_child_13 from "@/assets/models/female-child-13.png";
import female_child_14 from "@/assets/models/female-child-14.png";
import male_adult_1 from "@/assets/models/male-adult-1.png";
import male_adult_2 from "@/assets/models/male-adult-2.png";
import male_adult_3 from "@/assets/models/male-adult-3.png";
import male_adult_4 from "@/assets/models/male-adult-4.png";
import male_adult_5 from "@/assets/models/male-adult-5.png";
import male_adult_6 from "@/assets/models/male-adult-6.png";
import male_adult_7 from "@/assets/models/male-adult-7.png";
import male_adult_8 from "@/assets/models/male-adult-8.png";
import male_adult_9 from "@/assets/models/male-adult-9.png";
import male_adult_10 from "@/assets/models/male-adult-10.png";
import male_adult_11 from "@/assets/models/male-adult-11.png";
import male_adult_12 from "@/assets/models/male-adult-12.png";
import male_adult_13 from "@/assets/models/male-adult-13.png";
import male_adult_14 from "@/assets/models/male-adult-14.png";
import male_child_1 from "@/assets/models/male-child-1.png";
import male_child_2 from "@/assets/models/male-child-2.png";
import male_child_3 from "@/assets/models/male-child-3.png";
import male_child_4 from "@/assets/models/male-child-4.png";
import male_child_5 from "@/assets/models/male-child-5.png";
import male_child_6 from "@/assets/models/male-child-6.jpg";
import male_child_7 from "@/assets/models/male-child-7.jpg";
import male_child_8 from "@/assets/models/male-child-8.png";
import male_child_9 from "@/assets/models/male-child-9.jpg";
import male_child_10 from "@/assets/models/male-child-10.jpg";
import male_child_11 from "@/assets/models/male-child-11.jpg";
import male_child_12 from "@/assets/models/male-child-12.png";
import male_child_13 from "@/assets/models/male-child-13.png";
import male_child_14 from "@/assets/models/male-child-14.png";

export interface ProfileModelOption {
  id: string;
  image: string;
}

export type ProfileModelCatalogId =
  | "female-adult"
  | "female-child"
  | "male-adult"
  | "male-child";

/** Сколько моделей показываем до «смотреть ещё» — Figma `674:4802`. */
export const PROFILE_MODEL_PREVIEW_COUNT = 6;

export const profileModelCatalogs: Record<ProfileModelCatalogId, ProfileModelOption[]> = {
  "female-adult": [
    { id: "female-adult-1", image: female_adult_1 },
    { id: "female-adult-2", image: female_adult_2 },
    { id: "female-adult-3", image: female_adult_3 },
    { id: "female-adult-4", image: female_adult_4 },
    { id: "female-adult-5", image: female_adult_5 },
    { id: "female-adult-6", image: female_adult_6 },
    { id: "female-adult-7", image: female_adult_7 },
    { id: "female-adult-8", image: female_adult_8 },
    { id: "female-adult-9", image: female_adult_9 },
    { id: "female-adult-10", image: female_adult_10 },
    { id: "female-adult-11", image: female_adult_11 },
    { id: "female-adult-12", image: female_adult_12 },
    { id: "female-adult-13", image: female_adult_13 },
    { id: "female-adult-14", image: female_adult_14 },
  ],
  "female-child": [
    { id: "female-child-1", image: female_child_1 },
    { id: "female-child-2", image: female_child_2 },
    { id: "female-child-3", image: female_child_3 },
    { id: "female-child-4", image: female_child_4 },
    { id: "female-child-5", image: female_child_5 },
    { id: "female-child-6", image: female_child_6 },
    { id: "female-child-7", image: female_child_7 },
    { id: "female-child-8", image: female_child_8 },
    { id: "female-child-9", image: female_child_9 },
    { id: "female-child-10", image: female_child_10 },
    { id: "female-child-11", image: female_child_11 },
    { id: "female-child-12", image: female_child_12 },
    { id: "female-child-13", image: female_child_13 },
    { id: "female-child-14", image: female_child_14 },
  ],
  "male-adult": [
    { id: "male-adult-1", image: male_adult_1 },
    { id: "male-adult-2", image: male_adult_2 },
    { id: "male-adult-3", image: male_adult_3 },
    { id: "male-adult-4", image: male_adult_4 },
    { id: "male-adult-5", image: male_adult_5 },
    { id: "male-adult-6", image: male_adult_6 },
    { id: "male-adult-7", image: male_adult_7 },
    { id: "male-adult-8", image: male_adult_8 },
    { id: "male-adult-9", image: male_adult_9 },
    { id: "male-adult-10", image: male_adult_10 },
    { id: "male-adult-11", image: male_adult_11 },
    { id: "male-adult-12", image: male_adult_12 },
    { id: "male-adult-13", image: male_adult_13 },
    { id: "male-adult-14", image: male_adult_14 },
  ],
  "male-child": [
    { id: "male-child-1", image: male_child_1 },
    { id: "male-child-2", image: male_child_2 },
    { id: "male-child-3", image: male_child_3 },
    { id: "male-child-4", image: male_child_4 },
    { id: "male-child-5", image: male_child_5 },
    { id: "male-child-6", image: male_child_6 },
    { id: "male-child-7", image: male_child_7 },
    { id: "male-child-8", image: male_child_8 },
    { id: "male-child-9", image: male_child_9 },
    { id: "male-child-10", image: male_child_10 },
    { id: "male-child-11", image: male_child_11 },
    { id: "male-child-12", image: male_child_12 },
    { id: "male-child-13", image: male_child_13 },
    { id: "male-child-14", image: male_child_14 },
  ],
};

export function profileModelCatalogId(
  gender: "female" | "male",
  isChild: boolean,
): ProfileModelCatalogId {
  return `${gender}-${isChild ? "child" : "adult"}`;
}
