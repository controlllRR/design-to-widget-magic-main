/**
 * Экспорт PNG-референсов из Figma REST API в src/assets/figma-ref/.
 *
 * Usage:
 *   FIGMA_ACCESS_TOKEN=xxx node scripts/export-figma-refs.mjs
 *   FIGMA_ACCESS_TOKEN=xxx node scripts/export-figma-refs.mjs my-images generation-page-p2-v2
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(ROOT, "src/assets/figma-ref");
const FILE_KEY = "nEJeT6wB7wu3XOya5ZMPPH";
const SCALE = 2;

/** slug → { nodeId, filename } */
const EXPORTS = {
  "my-images": { nodeId: "1169:15884", filename: "my-images.png" },
  "generation-page-p2-v2": { nodeId: "1211:24713", filename: "generation-page-p2-v2.png" },
  "generation-page-p2": { nodeId: "1211:24201", filename: "generation-page-p2.png" },
  "create-profile-scroll-params": {
    nodeId: "1211:25283",
    filename: "create-profile-scroll-params.png",
  },
  "user-menu-v2": { nodeId: "1169:16134", filename: "user-menu-v2.png" },
  "add-from-store-filter": { nodeId: "1157:14722", filename: "add-from-store-filter.png" },
};

async function exportNode(token, { nodeId, filename }) {
  const ids = encodeURIComponent(nodeId);
  const imagesUrl = `https://api.figma.com/v1/images/${FILE_KEY}?ids=${ids}&format=png&scale=${SCALE}`;
  const imagesRes = await fetch(imagesUrl, {
    headers: { "X-Figma-Token": token },
  });
  if (!imagesRes.ok) {
    throw new Error(`Figma images API ${imagesRes.status}: ${await imagesRes.text()}`);
  }
  const imagesJson = await imagesRes.json();
  const pngUrl = imagesJson.images?.[nodeId];
  if (!pngUrl) {
    throw new Error(`No image URL for node ${nodeId}`);
  }

  const pngRes = await fetch(pngUrl);
  if (!pngRes.ok) {
    throw new Error(`PNG download failed ${pngRes.status}`);
  }
  const buffer = Buffer.from(await pngRes.arrayBuffer());
  const outPath = path.join(OUT_DIR, filename);
  await writeFile(outPath, buffer);
  console.log(`✓ ${filename} ← ${nodeId} (${buffer.length} bytes)`);
}

async function main() {
  const token = process.env.FIGMA_ACCESS_TOKEN;
  if (!token) {
    console.error("Set FIGMA_ACCESS_TOKEN env var (Figma → Settings → Personal access tokens).");
    process.exit(1);
  }

  const slugs = process.argv.slice(2);
  const targets =
    slugs.length > 0
      ? slugs.map((slug) => {
          const entry = EXPORTS[slug];
          if (!entry) throw new Error(`Unknown slug "${slug}". Available: ${Object.keys(EXPORTS).join(", ")}`);
          return { slug, ...entry };
        })
      : Object.entries(EXPORTS).map(([slug, entry]) => ({ slug, ...entry }));

  await mkdir(OUT_DIR, { recursive: true });
  for (const target of targets) {
    await exportNode(token, target);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
