import fs from "fs";
import path from "path";

const dest = new URL("../src/assets/models", import.meta.url);
const cats = ["female-adult", "female-child", "male-adult", "male-child"];
const exts = ["png", "jpg", "jpeg", "webp"];
const imports = [];
const catalogs = {};

for (const key of cats) {
  catalogs[key] = [];
  for (let i = 1; i <= 14; i++) {
    let file = null;
    let ext = null;
    for (const e of exts) {
      const p = path.join(dest.pathname.replace(/^\//, ""), `${key}-${i}.${e}`);
      const winPath = path.join(
        "C:/Users/anton/Documents/design-to-widget-magic-main/design-to-widget-magic-main/src/assets/models",
        `${key}-${i}.${e}`,
      );
      if (fs.existsSync(winPath)) {
        file = `${key}-${i}`;
        ext = e;
        break;
      }
    }
    if (!file) break;
    const varName = file.replace(/-/g, "_");
    imports.push(`import ${varName} from "@/assets/models/${file}.${ext}";`);
    catalogs[key].push({ id: file, var: varName });
  }
}

let out = `${imports.join("\n")}\n\n`;
out += `export interface ProfileModelOption {
  id: string;
  image: string;
}

export type ProfileModelCatalogId =
  | "female-adult"
  | "female-child"
  | "male-adult"
  | "male-child";

/** Сколько моделей показываем до «смотреть ещё» — Figma \`674:4802\`. */
export const PROFILE_MODEL_PREVIEW_COUNT = 6;

export const profileModelCatalogs: Record<ProfileModelCatalogId, ProfileModelOption[]> = {
`;
for (const key of cats) {
  out += `  "${key}": [\n`;
  for (const m of catalogs[key]) {
    out += `    { id: "${m.id}", image: ${m.var} },\n`;
  }
  out += `  ],\n`;
}
out += `};

export function profileModelCatalogId(
  gender: "female" | "male",
  isChild: boolean,
): ProfileModelCatalogId {
  return \`\${gender}-\${isChild ? "child" : "adult"}\`;
}
`;

const outPath =
  "C:/Users/anton/Documents/design-to-widget-magic-main/design-to-widget-magic-main/src/widget/config/profile-models.ts";
fs.writeFileSync(outPath, out);
console.log("written", catalogs["female-adult"].length, "models per category");
